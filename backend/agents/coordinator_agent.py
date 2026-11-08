from math import ceil
from agents.itinerary_agent import generate_itinerary
from agents.destination_agent import recommend_destinations, DESTINATIONS
from agents.budget_agent import calculate_trip_budget
from agents.transportation_agent import recommend_transportation
from agents.accommodation_agent import recommend_accommodation
from agents.meal_agent import calculate_meal_plan
from agents.itinerary_agent import generate_itinerary


def _money(value):
    try:
        return round(float(value or 0))
    except (TypeError, ValueError, OverflowError):
        return 0


def coordinate_travel_plan(
    destination,
    budget_pkr,
    days=5,
    travelers=2,
    region=None,
    preferred_region=None,
    travel_style="Adventure",
    accommodation_type="Hotel",
    accommodation_tier="Standard",
    room_type="Double",
    rooms=1,
    breakfast="Included",
    lunch="Separate",
    dinner="Separate",
    dietary_preferences=None,
    transport_preference="any",
    include_local_transport=True,
    departure_date=None,
    special_requests=""
):

    # -------------------------------------------------
    # 1. DESTINATION VALIDATION
    # -------------------------------------------------

    if not isinstance(destination, str) or not destination.strip():
        raise ValueError("Destination is required.")

    destination = destination.strip()

    selected = next(
        (
            x for x in DESTINATIONS
            if x["name"].casefold() == destination.casefold()
        ),
        None
    )

    if selected is None:
        supported = ", ".join(x["name"] for x in DESTINATIONS)

        raise ValueError(
            f"Unsupported destination. Supported destinations: {supported}"
        )

    # -------------------------------------------------
    # 2. INPUT VALIDATION
    # -------------------------------------------------

    try:
        days = int(days)
        travelers = int(travelers)
        rooms = int(rooms)
        budget_pkr = int(budget_pkr)

    except (TypeError, ValueError, OverflowError):
        raise ValueError(
            "Please provide valid numerical trip details."
        )

    if not 1 <= days <= 30:
        raise ValueError(
            "Trip duration must be between 1 and 30 days."
        )

    if not 1 <= travelers <= 20:
        raise ValueError(
            "Travelers must be between 1 and 20."
        )

    if not 1 <= rooms <= 10:
        raise ValueError(
            "Rooms must be between 1 and 10."
        )

    if budget_pkr <= 0:
        raise ValueError(
            "Please enter a valid total budget."
        )

    # -------------------------------------------------
    # 3. REGION AND ROOM CAPACITY
    # -------------------------------------------------

    actual_region = (
        selected.get("region")
        or region
        or "Pakistan"
    )

    nights = max(days - 1, 0)

    room_capacity = {
        "Single": 1,
        "Double": 2,
        "Twin": 2,
        "Family": 4
    }

    if room_type not in room_capacity:
        raise ValueError("Invalid room type.")

    minimum_rooms = ceil(
        travelers / room_capacity[room_type]
    )

    if rooms < minimum_rooms:
        raise ValueError(
            f"{travelers} travelers need at least "
            f"{minimum_rooms} {room_type} room(s)."
        )

    # -------------------------------------------------
    # 4. SELECTED DESTINATION ESTIMATE
    # -------------------------------------------------

    selected_estimate = round(
        float(selected.get("base_cost", 0))
        * (days / 5)
        * travelers
    )

    selected_item = {
        **selected,
        "estimated_cost": selected_estimate,
        "within_budget": selected_estimate <= budget_pkr,
        "is_selected_destination": True
    }

    # -------------------------------------------------
    # 5. DESTINATION RECOMMENDATION AGENT
    # -------------------------------------------------

    preferred = preferred_region or actual_region

    alt_result = recommend_destinations(
        budget_pkr=budget_pkr,
        days=days,
        travelers=travelers,
        preferred_region=preferred,
        travel_style=travel_style
    )

    alternatives = [
        x for x in alt_result.get("recommendations", [])
        if x.get("name", "").casefold() != destination.casefold()
    ]

    affordable_alternatives = [
        x for x in alternatives
        if x.get("within_budget", False)
    ]

    searched_all_regions = False

    if (
        not affordable_alternatives
        and str(preferred).lower() != "any"
    ):

        global_result = recommend_destinations(
            budget_pkr=budget_pkr,
            days=days,
            travelers=travelers,
            preferred_region="Any",
            travel_style=travel_style
        )

        global_alternatives = [
            x for x in global_result.get("recommendations", [])
            if x.get("name", "").casefold() != destination.casefold()
        ]

        if global_alternatives:

            alternatives = global_alternatives

            affordable_alternatives = [
                x for x in alternatives
                if x.get("within_budget", False)
            ]

            alt_result = global_result

            searched_all_regions = True

    destination_recommendations = dict(alt_result)

    destination_recommendations.update({
        "selected_destination": selected_item,
        "alternatives": alternatives,
        "recommendations": [selected_item] + alternatives,
        "total_found": len(alternatives) + 1,

        "budget_filter": {
            "user_budget": budget_pkr,
            "selected_destination_within_budget":
                selected_estimate <= budget_pkr,
            "affordable_alternatives_found":
                len(affordable_alternatives),
            "searched_all_regions": searched_all_regions,
            "message": (
                "Selected destination remains the main trip destination. "
                "Alternatives never replace it."
            )
        }
    })

    # -------------------------------------------------
    # 6. ACCOMMODATION AGENT
    # -------------------------------------------------

    accommodation_plan = recommend_accommodation(
        region=actual_region,
        accommodation_type=accommodation_type,
        tier=accommodation_tier,
        room_type=room_type,
        rooms=rooms,
        nights=nights
    )

    accommodation_cost = _money(
        accommodation_plan.get("total_estimated_cost")
    )

    accommodation_plan["cost_explanation"] = (
        f"Illustrative estimate for {rooms} {room_type} room(s) "
        f"over {nights} night(s). "
        "No property has been selected, and hotel availability, "
        "taxes, fees, and actual rates are not verified."
    )

    accommodation_plan["booking_status"] = (
        "Not booked or availability-verified"
    )

    # -------------------------------------------------
    # 7. TRANSPORTATION AGENT
    # -------------------------------------------------

    preference = str(
        transport_preference or "any"
    ).strip().lower()

    transportation_plan = recommend_transportation(
        region=actual_region,
        travelers=travelers,
        transport_preference=preference,
        include_local_transport=bool(include_local_transport),
        origin_country="Pakistan",
        destination=destination
    )

    transport_options = transportation_plan.get(
        "recommendations", []
    )

    if not transport_options:
        raise ValueError(
            "No transportation option is available."
        )

    if transportation_plan.get("requested_option_unavailable"):

        selected_transport = transport_options[0]

    elif preference == "any":

        selected_transport = transport_options[0]

    else:

        selected_transport = next(
            (
                option for option in transport_options
                if str(
                    option.get("transport_type", "")
                ).lower() == preference
            ),
            None
        )

        if selected_transport is None:
            raise ValueError(
                "Requested transportation option was not found."
            )

    transport_cost = _money(
        selected_transport.get("total_with_local_transport")
        if include_local_transport
        else selected_transport.get("estimated_cost")
    )

    transportation_plan["selected_option"] = selected_transport

    transportation_plan["selected_estimated_cost"] = transport_cost

    transportation_plan["local_transport_included"] = (
        bool(include_local_transport)
    )

    if preference == "any":
        transportation_plan["selection_note"] = (
            f"Selected {selected_transport.get('name')} "
            "as the default planning option."
        )

    elif transportation_plan.get("requested_option_unavailable"):
        pass

    else:
        transportation_plan["selection_note"] = (
            "Selected according to your transport preference."
        )

    # -------------------------------------------------
    # 8. MEAL PLANNING AGENT
    # -------------------------------------------------

    dietary_preferences = dietary_preferences or []

    meal_plan = calculate_meal_plan(
        region=actual_region,
        destination=destination,
        days=days,
        travelers=travelers,
        breakfast=breakfast,
        lunch=lunch,
        dinner=dinner,
        dietary_preferences=dietary_preferences
    )

    meal_cost = _money(
        meal_plan.get("total_meal_cost")
    )

    meal_plan["cost_explanation"] = (
        "Only Separate meals are costed. Included meals are "
        "treated as covered for this estimate, but no hotel or "
        "package has been checked to confirm that coverage. "
        "Skip meals are excluded."
    )

    meal_plan["included_meals_unverified"] = [
        meal
        for meal, choice in (
            ("breakfast", breakfast),
            ("lunch", lunch),
            ("dinner", dinner)
        )
        if str(choice).strip().casefold() == "included"
    ]

    meal_plan["coverage_status"] = (
        "Package coverage not verified"
    )

# -------------------------------------------------
# 9. ITINERARY PLANNING AGENT
# -------------------------------------------------

    daily_itinerary = generate_itinerary(
    destination=destination,
    days=days,
    travel_style=travel_style,
    departure_date=departure_date,
    special_requests=special_requests
)
    # -------------------------------------------------
    # 10. BUDGET PLANNING AGENT
    # -------------------------------------------------

    budget_plan = calculate_trip_budget(
        days=days,
        travelers=travelers,
        region=actual_region,
        accommodation_type=accommodation_type,
        accommodation_tier=accommodation_tier,
        room_type=room_type,
        rooms=rooms,
        breakfast=breakfast,
        lunch=lunch,
        dinner=dinner,
        include_transport=False,
        include_activities=True
    )

    activities_cost = _money(
        budget_plan.get("activities", {}).get(
            "estimated_cost", 0
        )
    )

    budget_plan.setdefault("accommodation", {}).update({
        "estimated_cost": accommodation_cost,
        "type": accommodation_type,
        "tier": accommodation_tier,
        "room_type": room_type,
        "rooms": rooms,
        "nights": nights
    })

    budget_plan.setdefault("meals", {}).update({
        "total_estimated_cost": meal_cost
    })

    budget_plan.setdefault("transportation", {}).update({
        "included": True,
        "estimated_cost": transport_cost,
        "preference": preference,
        "local_transport_included": bool(include_local_transport)
    })

    budget_plan.setdefault("activities", {}).update({
        "estimated_cost": activities_cost
    })

    # -------------------------------------------------
    # 11. FINAL BUDGET CALCULATION
    # -------------------------------------------------

    total = (
        accommodation_cost
        + meal_cost
        + transport_cost
        + activities_cost
    )

    difference = budget_pkr - total

    within_budget = total <= budget_pkr

    remaining = max(difference, 0)

    over = max(-difference, 0)

    status = (
        "Within budget"
        if within_budget
        else "Over budget"
    )

    warning = (
        None
        if within_budget
        else (
            f"Estimated trip cost is Rs. {total:,}, "
            f"Rs. {over:,} above your Rs. {budget_pkr:,} budget."
        )
    )

    # -------------------------------------------------
    # 12. BUDGET SUGGESTIONS
    # -------------------------------------------------

    suggestions = []

    if not within_budget:

        if accommodation_tier != "Budget":
            suggestions.append(
                "Consider Budget accommodation."
            )

        if accommodation_type != "Guest House":
            suggestions.append(
                "Compare guest houses with hotels."
            )

        if include_local_transport:
            suggestions.append(
                "Review local transport costs."
            )

        if "Separate" in [breakfast, lunch, dinner]:
            suggestions.append(
                "Review separate meal expenses."
            )

        suggestions.append(
            "Consider reducing trip duration or optional activities."
        )

        suggestions.append(
            "Compare alternatives without changing your selected destination."
        )

    # -------------------------------------------------
    # 13. UPDATE FINAL BUDGET PLAN
    # -------------------------------------------------

    budget_plan.update({
        "total_estimated_budget": total,
        "currency": "PKR",
        "user_budget": budget_pkr,
        "remaining_budget": remaining,
        "over_budget_amount": over,
        "within_budget": within_budget,
        "budget_status": status,
        "budget_warning": warning,
        "suggestions": suggestions
    })

    # -------------------------------------------------
    # 14. FINAL COORDINATOR RESPONSE
    # -------------------------------------------------

    return {

        "project": "WAYFARER",
        "status": "success",

        "trip_summary": {

            "destination": destination,
            "region": actual_region,
            "days": days,
            "nights": nights,
            "travelers": travelers,
            "travel_style": travel_style,
            "budget_pkr": budget_pkr,
            "departure_date": departure_date,
            "special_requests": special_requests or "",

            "destination_agent_estimate": {

                "estimated_cost": selected_estimate,

                "coverage": (
                    "The destination base-cost dataset does not "
                    "itemize which expense categories this figure covers."
                ),

                "comparison_note": (
                    "This is a broad destination-level planning indicator, "
                    "not an additional line item. The detailed budget is "
                    "calculated separately from accommodation, meals, "
                    "transport and activities. Because the base-cost "
                    "coverage is not itemized, these two figures are "
                    "not directly comparable and must not be added together."
                ),

                "notice": (
                    "Rough destination base-cost estimate; separate from "
                    "and not added to the detailed budget."
                )
            }
        },

        "automatic_decisions": {

            "accommodation_type": accommodation_type,
            "accommodation_tier": accommodation_tier,
            "room_type": room_type,
            "rooms": rooms,
            "minimum_rooms_required": minimum_rooms,
            "assumed_room_capacity": room_capacity[room_type],

            "breakfast": breakfast,
            "lunch": lunch,
            "dinner": dinner,

            "dietary_preferences": dietary_preferences,

            "transport_preference": preference,

            "include_local_transport": bool(include_local_transport)
        },

        "destination_recommendations": destination_recommendations,

        "accommodation_plan": accommodation_plan,

        "transportation_plan": transportation_plan,

        "meal_plan": meal_plan,

        "daily_itinerary": daily_itinerary,

        "budget_plan": budget_plan,

        "user_budget": budget_pkr,

        "estimated_total_budget": total,

        "remaining_budget": remaining,

        "over_budget_amount": over,

        "within_budget": within_budget,

        "budget_status": status,

        "budget_warning": warning,

        "suggestions": suggestions,

        "cost_comparison": {

            "destination_base_estimate": selected_estimate,

            "detailed_budget_total": total,

            "add_destination_estimate_to_total": False,

            "explanation": (
                "The destination base estimate is a separate broad "
                "indicator whose category coverage is not itemized. "
                "The detailed budget is the sum of the displayed "
                "accommodation, meal, transport and activity estimates. "
                "Do not add the destination estimate to the detailed total."
            )
        },

        "notice": (
            "All costs are illustrative, not live prices. "
            "Selected destination remains unchanged. "
            "The destination base-cost estimate is separate and must "
            "not be added to the detailed budget. "
            "Included meals are assumed for calculation only and are "
            "not package-verified. "
            "Accommodation is not booked; availability, taxes and "
            "actual rates are not verified. "
            "Transport allowances, route feasibility, fare coverage "
            "and attraction hours are not live verified."
        )
    }