
def calculate_trip_budget(
    days: int,
    travelers: int,
    region: str = "Pakistan",
    accommodation_type: str = "Hotel",
    accommodation_tier: str = "Standard",
    room_type: str = "Double",
    rooms: int = 1,
    breakfast: str = "Included",
    lunch: str = "Separate",
    dinner: str = "Separate",
    include_transport: bool = True,
    include_activities: bool = True
):
    """Calculate illustrative trip budget in PKR."""

    if not 1 <= days <= 30:
        raise ValueError("Days must be between 1 and 30.")

    if not 1 <= travelers <= 20:
        raise ValueError("Travelers must be between 1 and 20.")

    if not 1 <= rooms <= 10:
        raise ValueError("Rooms must be between 1 and 10.")

    region = region.strip().lower()

    if region not in ["pakistan", "international"]:
        raise ValueError("Region must be Pakistan or International.")

    is_pakistan = region == "pakistan"

    # A 5-day trip normally means 4 overnight stays.
    nights = max(days - 1, 0)

    accommodation_rates = {
        "Budget": 4500 if is_pakistan else 12000,
        "Standard": 8000 if is_pakistan else 22000,
        "Premium": 16000 if is_pakistan else 45000
    }

    accommodation_multipliers = {
        "Hotel": 1.0,
        "Guest House": 0.8,
        "Resort": 1.35
    }

    room_multipliers = {
        "Single": 0.8,
        "Double": 1.0,
        "Twin": 1.0,
        "Family": 1.65
    }

    if accommodation_tier not in accommodation_rates:
        raise ValueError("Invalid accommodation tier.")

    if accommodation_type not in accommodation_multipliers:
        raise ValueError("Invalid accommodation type.")

    if room_type not in room_multipliers:
        raise ValueError("Invalid room type.")

    nightly_rate = round(
        accommodation_rates[accommodation_tier]
        * accommodation_multipliers[accommodation_type]
        * room_multipliers[room_type]
    )

    accommodation_cost = nightly_rate * nights * rooms

    # Meal rates per person per day
    meal_rates = {
        "breakfast": 500 if is_pakistan else 1200,
        "lunch": 800 if is_pakistan else 1800,
        "dinner": 1000 if is_pakistan else 2200
    }

    meal_choices = {
        "breakfast": breakfast,
        "lunch": lunch,
        "dinner": dinner
    }

    meal_costs = {}

    for meal, choice in meal_choices.items():

        if choice not in ["Included", "Separate", "Skip"]:
            raise ValueError(
                f"Invalid choice for {meal}."
            )

        meal_costs[meal] = (
            meal_rates[meal] * travelers * days
            if choice == "Separate"
            else 0
        )

    total_meal_cost = sum(meal_costs.values())

    # Transportation
    transport_per_person = 2500 if is_pakistan else 6000

    transportation_cost = (
        transport_per_person * travelers * days
        if include_transport else 0
    )

    # Activities
    activities_per_person = 1500 if is_pakistan else 4000

    activities_cost = (
        activities_per_person * travelers * days
        if include_activities else 0
    )

    total_estimated_budget = (
        accommodation_cost
        + total_meal_cost
        + transportation_cost
        + activities_cost
    )

    return {
        "agent": "Budget Planning Agent",
        "currency": "PKR",

        "trip_details": {
            "days": days,
            "nights": nights,
            "travelers": travelers,
            "region": region.title()
        },

        "accommodation": {
            "type": accommodation_type,
            "tier": accommodation_tier,
            "room_type": room_type,
            "rooms": rooms,
            "nights": nights,
            "estimated_price_per_night": nightly_rate,
            "estimated_cost": accommodation_cost
        },

        "meals": {
            "breakfast": {
                "selection": breakfast,
                "estimated_cost": meal_costs["breakfast"]
            },
            "lunch": {
                "selection": lunch,
                "estimated_cost": meal_costs["lunch"]
            },
            "dinner": {
                "selection": dinner,
                "estimated_cost": meal_costs["dinner"]
            },
            "total_estimated_cost": total_meal_cost
        },

        "transportation": {
            "included": include_transport,
            "estimated_cost": transportation_cost
        },

        "activities": {
            "included": include_activities,
            "estimated_cost": activities_cost
        },

        "total_estimated_budget": total_estimated_budget,

        "notice": (
            "Illustrative estimates only. "
            "Prices and availability are not live verified."
        )
    }
