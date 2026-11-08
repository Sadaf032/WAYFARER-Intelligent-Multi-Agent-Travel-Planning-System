ACCOMMODATION_OPTIONS = {
    "Pakistan": {
        "Budget": 4500,
        "Standard": 8000,
        "Premium": 16000
    },
    "International": {
        "Budget": 12000,
        "Standard": 22000,
        "Premium": 45000
    }
}

PROPERTY_MULTIPLIERS = {
    "Hotel": 1.0,
    "Guest House": 0.8,
    "Resort": 1.35
}

ROOM_MULTIPLIERS = {
    "Single": 0.8,
    "Double": 1.0,
    "Twin": 1.0,
    "Family": 1.65
}


def recommend_accommodation(
    region: str = "Pakistan",
    accommodation_type: str = "Hotel",
    tier: str = "Standard",
    room_type: str = "Double",
    rooms: int = 1,
    nights: int = 4
):
    """Calculate illustrative accommodation costs."""

    # Region validation
    if (
        not isinstance(region, str)
        or region.strip().lower() not in [
            "pakistan",
            "international"
        ]
    ):
        raise ValueError(
            "Region must be Pakistan or International."
        )

    region_key = (
        "Pakistan"
        if region.strip().lower() == "pakistan"
        else "International"
    )

    # Accommodation type validation
    if accommodation_type not in PROPERTY_MULTIPLIERS:
        raise ValueError(
            "Invalid accommodation type."
        )

    # Tier validation
    if tier not in ACCOMMODATION_OPTIONS[region_key]:
        raise ValueError(
            "Invalid accommodation tier."
        )

    # Room validation
    if room_type not in ROOM_MULTIPLIERS:
        raise ValueError(
            "Invalid room type."
        )

    if isinstance(rooms, bool) or not isinstance(rooms, int):
        raise ValueError(
            "Rooms must be a valid integer."
        )

    if not 1 <= rooms <= 10:
        raise ValueError(
            "Rooms must be between 1 and 10."
        )

    if isinstance(nights, bool) or not isinstance(nights, int):
        raise ValueError(
            "Nights must be a valid integer."
        )

    if not 0 <= nights <= 30:
        raise ValueError(
            "Nights must be between 0 and 30."
        )

    # Calculate accommodation cost
    base_rate = ACCOMMODATION_OPTIONS[region_key][tier]

    nightly_rate = round(
        base_rate
        * PROPERTY_MULTIPLIERS[accommodation_type]
        * ROOM_MULTIPLIERS[room_type]
    )

    total_cost = nightly_rate * rooms * nights

    return {
        "agent": "Accommodation Planning Agent",
        "currency": "PKR",
        "region": region_key,
        "property_type": accommodation_type,
        "tier": tier,
        "room_type": room_type,
        "rooms": rooms,
        "nights": nights,
        "estimated_price_per_night": nightly_rate,
        "total_estimated_cost": total_cost,
        "availability": "Not live verified",
        "notice": (
            "Illustrative accommodation estimates only. "
            "No actual hotel booking or availability has been confirmed."
        )
    }