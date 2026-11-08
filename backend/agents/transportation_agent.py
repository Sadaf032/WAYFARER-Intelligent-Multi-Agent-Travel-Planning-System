
TRANSPORT_OPTIONS = {
    "Pakistan": {
        "car": {
            "name": "Private Car",
            "cost_per_person": 5000,
            "description": "Flexible road travel for domestic journeys."
        },
        "bus": {
            "name": "Intercity Bus",
            "cost_per_person": 3500,
            "description": "Affordable transport between major cities."
        },
        "train": {
            "name": "Train",
            "cost_per_person": 2500,
            "description": "Budget-friendly railway travel."
        },
        "flight": {
            "name": "Domestic Flight",
            "cost_per_person": 18000,
            "description": "Faster travel between major cities."
        }
    },

    "International": {
        "flight": {
            "name": "International Flight",
            "cost_per_person": 65000,
            "description": (
                "Illustrative international air-travel allowance "
                "from Pakistan; route and fare coverage are not verified."
            )
        }
    }
}


def recommend_transportation(
    region="Pakistan",
    travelers=1,
    transport_preference="any",
    include_local_transport=True,
    origin_country="Pakistan",
    destination=None,
):
    """
    Return practical transport choices with clearly labelled estimates.

    International trips currently assume departure from Pakistan.
    Cross-border car, bus and train options are not offered because
    verified land-route data is not available.
    """

    # Validate travelers
    try:
        if isinstance(travelers, bool):
            raise ValueError

        travelers = int(travelers)

    except (TypeError, ValueError, OverflowError):
        raise ValueError("Travelers must be a valid whole number.")

    if not 1 <= travelers <= 20:
        raise ValueError("Travelers must be between 1 and 20.")

    # Validate region
    region_key = {
        "pakistan": "Pakistan",
        "international": "International"
    }.get(str(region).strip().lower())

    if not region_key:
        raise ValueError("Region must be Pakistan or International.")

    # Validate transport preference
    preference = str(
        transport_preference or "any"
    ).strip().lower()

    allowed = {"car", "bus", "train", "flight"}

    if preference != "any" and preference not in allowed:
        raise ValueError(
            "Preference must be any, car, bus, train or flight."
        )

    # Validate local transport option
    if not isinstance(include_local_transport, bool):
        raise ValueError(
            "include_local_transport must be True or False."
        )

    # Validate destination
    if destination is not None:
        if not isinstance(destination, str) or not destination.strip():
            raise ValueError("Destination must be a valid text value.")

    # Validate origin country
    if not isinstance(origin_country, str) or not origin_country.strip():
        raise ValueError("Origin country must be a valid text value.")

    requested_option_unavailable = False

    # International transportation
    if region_key == "International":

        chosen = [
            ("flight", TRANSPORT_OPTIONS["International"]["flight"])
        ]

        requested_option_unavailable = preference not in (
            "any",
            "flight"
        )

        if requested_option_unavailable:
            selection_note = (
                f"Your requested {preference} option is not offered "
                f"for the Pakistan-to-{destination or 'international destination'} "
                "cross-border leg. A flight is shown as a planning "
                "alternative; confirm the route and fare before booking."
            )
        else:
            selection_note = (
                "International air travel is used for the "
                "cross-border leg in this estimate."
            )

    # Domestic transportation
    else:

        options = TRANSPORT_OPTIONS["Pakistan"]

        if preference == "any":
            chosen = list(options.items())

        else:
            chosen = [
                (preference, options[preference])
            ]

        selection_note = (
            "Domestic option(s) shown according to your preference."
        )

    # Calculate local transport cost
    local_cost = (
        (1500 if region_key == "Pakistan" else 4000) * travelers
        if include_local_transport
        else 0
    )

    recommendations = []

    # Generate recommendations
    for key, option in chosen:

        cost = option["cost_per_person"] * travelers

        recommendations.append({
            "transport_type": key,
            "name": option["name"],
            "description": option["description"],
            "cost_per_person": option["cost_per_person"],
            "estimated_cost": cost,
            "travelers": travelers,
            "total_with_local_transport": cost + local_cost,

            "is_planning_alternative": (
                requested_option_unavailable
            ),

            "fare_coverage": (
                "International flight fare coverage (one-way or return) "
                "is not specified; confirm it before booking."
                if region_key == "International"
                else
                "Domestic fare coverage (one-way or return) "
                "is not specified; confirm it before booking."
            )
        })

    # Final response
    return {
        "agent": "Transportation Planning Agent",
        "region": region_key,
        "origin_country": origin_country.strip(),
        "destination": (
            destination.strip()
            if isinstance(destination, str)
            else destination
        ),
        "travelers": travelers,
        "requested_preference": preference,
        "requested_option_unavailable": requested_option_unavailable,

        "local_transport": {
            "included": include_local_transport,
            "estimated_cost": local_cost
        },

        "recommendations": recommendations,

        "selection_note": selection_note,

        "notice": (
            "Illustrative international flight allowance only; it is "
            "not a live fare, verified route, schedule, or booking. "
            "Confirm the departure/arrival airports and whether "
            "the fare is one-way or return."
            if region_key == "International"
            else
            "Illustrative domestic transport allowances only; these "
            "are not live fares, verified schedules, or bookings. "
            "Confirm the route and whether the fare is one-way or return."
        )
    }
