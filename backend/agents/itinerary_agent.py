
from datetime import date, timedelta


DESTINATION_ACTIVITIES = {
    "Hunza Valley": [
        ["Visit Karimabad", "Explore Baltit Fort"],
        ["Visit Attabad Lake", "Enjoy the mountain views"],
        ["Explore Passu Cones", "Visit Passu Village"],
        ["Visit Altit Fort", "Explore the local market"],
        ["Enjoy a scenic day in Hunza"]
    ],
    "Skardu": [
        ["Visit Shangrila Resort", "Explore Upper Kachura Lake"],
        ["Visit Shigar Fort", "Explore Shigar Valley"],
        ["Visit Satpara Lake", "Enjoy scenic views"],
        ["Explore local markets", "Visit a nearby viewpoint"],
        ["Enjoy a relaxed day in Skardu"]
    ],
    "Swat Valley": [
        ["Explore Mingora", "Visit local markets"],
        ["Visit Malam Jabba", "Enjoy mountain views"],
        ["Explore Bahrain Valley", "Visit the riverside"],
        ["Visit Kalam Valley", "Enjoy nature"],
        ["Explore nearby scenic locations"]
    ],
    "Murree": [
        ["Visit Mall Road", "Explore Kashmir Point"],
        ["Visit Patriata", "Enjoy scenic views"],
        ["Explore Pindi Point", "Visit local markets"],
        ["Enjoy a nature walk", "Explore nearby viewpoints"],
        ["Spend a relaxed day in Murree"]
    ],
    "Dubai": [
        ["Visit Burj Khalifa", "Explore Dubai Mall"],
        ["Visit Palm Jumeirah", "Explore Dubai Marina"],
        ["Visit Dubai Frame", "Explore Old Dubai"],
        ["Visit Jumeirah Beach", "Explore local markets"],
        ["Enjoy a city sightseeing day"]
    ],
    "Istanbul": [
        ["Visit Hagia Sophia", "Explore Blue Mosque"],
        ["Visit Topkapi Palace", "Explore Sultanahmet"],
        ["Visit Grand Bazaar", "Explore local streets"],
        ["Enjoy Bosphorus sightseeing"],
        ["Explore Istanbul's cultural areas"]
    ],
    "Bangkok": [
        ["Visit Grand Palace", "Explore Wat Pho"],
        ["Visit Wat Arun", "Explore riverside areas"],
        ["Explore local markets", "Discover Thai culture"],
        ["Visit city attractions"],
        ["Enjoy local food experiences"]
    ],
    "Kuala Lumpur": [
        ["Visit Petronas Towers", "Explore KLCC Park"],
        ["Visit Batu Caves"],
        ["Explore Central Market", "Visit Chinatown"],
        ["Visit Merdeka Square"],
        ["Explore Kuala Lumpur city"]
    ],
    "Beijing": [
        ["Visit the Forbidden City"],
        ["Explore the Great Wall"],
        ["Visit Temple of Heaven"],
        ["Explore local markets"],
        ["Discover Beijing culture"]
    ],
    "Seoul": [
        ["Visit Gyeongbokgung Palace"],
        ["Explore Myeongdong"],
        ["Visit N Seoul Tower"],
        ["Explore Bukchon Hanok Village"],
        ["Discover Seoul city"]
    ],
    "Rome": [
        ["Visit Colosseum", "Explore Roman Forum"],
        ["Visit Trevi Fountain"],
        ["Explore Vatican City"],
        ["Visit Pantheon"],
        ["Explore local Italian markets"]
    ],
    "Paris": [
        ["Visit Eiffel Tower"],
        ["Explore Louvre Museum"],
        ["Visit Notre-Dame area"],
        ["Explore Champs-Élysées"],
        ["Enjoy Paris sightseeing"]
    ]
}


STYLE_ACTIVITIES = {
    "adventure": [
        "Enjoy an outdoor adventure",
        "Explore an exciting activity"
    ],
    "family": [
        "Enjoy a family-friendly attraction",
        "Spend quality time with family"
    ],
    "relaxation": [
        "Enjoy a relaxing break",
        "Spend time in a peaceful location"
    ],
    "culture": [
        "Explore local culture",
        "Discover traditional places"
    ],
    "nature": [
        "Enjoy natural scenery",
        "Explore a scenic outdoor location"
    ],
    "food": [
        "Try local food",
        "Explore traditional restaurants"
    ],
    "shopping": [
        "Explore shopping areas",
        "Visit local markets"
    ],
    "history": [
        "Explore historical landmarks",
        "Visit a heritage attraction"
    ],
    "romantic": [
        "Enjoy a scenic couple-friendly outing",
        "Explore a peaceful location"
    ],
    "luxury": [
        "Enjoy a premium sightseeing experience",
        "Explore an upscale area"
    ]
}


def _destination_plan(destination):
    for name, activities in DESTINATION_ACTIVITIES.items():
        if name.lower() == str(destination).strip().lower():
            return activities

    return []


def _extended_destination_plan(destination):
    return []


def _make_extended_day(destination, index):
    return [
        f"Explore more attractions around {destination}",
        "Enjoy free time and local sightseeing"
    ]


def generate_itinerary(
    destination,
    days,
    travel_style="Adventure",
    departure_date=None,
    special_requests=""
):
    try:
        days = int(days)
    except (TypeError, ValueError, OverflowError):
        raise ValueError("Days must be a valid number.")

    if not 1 <= days <= 30:
        raise ValueError("Days must be between 1 and 30.")

    destination = str(destination or "").strip()

    if not destination:
        raise ValueError("Destination is required.")

    special_requests = str(special_requests or "").strip()

    if len(special_requests) > 500:
        raise ValueError("Special requests cannot exceed 500 characters.")

    start_date = None

    if departure_date:
        try:
            start_date = date.fromisoformat(
                str(departure_date)[:10]
            )
        except (ValueError, TypeError):
            raise ValueError("Date must use YYYY-MM-DD format.")

    style = str(travel_style or "Adventure").strip().lower()

    style_activities = STYLE_ACTIVITIES.get(
        style,
        STYLE_ACTIVITIES["adventure"]
    )

    destination_days = _destination_plan(destination)

    if not destination_days:
        destination_days = [
            [
                "Explore the main city area",
                "Visit a popular local attraction"
            ],
            [
                "Discover local culture",
                "Explore a traditional market"
            ],
            [
                "Visit a scenic location",
                "Enjoy a relaxing break"
            ]
        ]

    itinerary = []

    for index in range(days):

        if index < len(destination_days):
            activities = list(destination_days[index])
        else:
            activities = _make_extended_day(
                destination,
                index - len(destination_days)
            )

        style_activity = style_activities[
            index % len(style_activities)
        ]

        activities.append(style_activity)

        if index == 0:
            activities.insert(
                0,
                f"Arrival in {destination}"
            )

        if index == days - 1:
            activities.append(
                f"Departure from {destination}"
            )

        day_data = {
            "day": index + 1,
            "title": f"Day {index + 1} in {destination}",
            "activities": activities,
            "travel_style": travel_style
        }

        if start_date:
            current_date = start_date + timedelta(days=index)

            day_data["date"] = current_date.isoformat()
            day_data["date_label"] = current_date.strftime(
                "%A, %d %B %Y"
            )
            day_data["display_date"] = current_date.strftime(
                "%d %B %Y"
            )

        itinerary.append(day_data)

    return {
        "agent": "Itinerary Planning Agent",
        "destination": destination,
        "total_days": days,
        "travel_style": travel_style,
        "departure_date": (
            start_date.isoformat() if start_date else None
        ),
        "special_requests": special_requests,
        "itinerary": itinerary,
        "notice": (
            "This is a suggested itinerary. Attraction availability, "
            "opening hours, ticket prices and travel conditions "
            "are not live verified."
        )
    }
