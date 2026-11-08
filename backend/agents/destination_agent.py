
DESTINATIONS = [
    {
        "name": "Hunza Valley",
        "country": "Pakistan",
        "region": "Pakistan",
        "base_cost": 45000,
        "styles": ["Adventure", "Nature", "Relaxation"],
        "description": "Explore mountains, Attabad Lake and beautiful valleys."
    },
    {
        "name": "Skardu",
        "country": "Pakistan",
        "region": "Pakistan",
        "base_cost": 55000,
        "styles": ["Adventure", "Nature"],
        "description": "Discover lakes, mountains and the beauty of northern Pakistan."
    },
    {
        "name": "Swat Valley",
        "country": "Pakistan",
        "region": "Pakistan",
        "base_cost": 30000,
        "styles": ["Nature", "Relaxation", "Adventure"],
        "description": "Enjoy green valleys, rivers and mountain scenery."
    },
    {
        "name": "Murree",
        "country": "Pakistan",
        "region": "Pakistan",
        "base_cost": 25000,
        "styles": ["Relaxation", "Family"],
        "description": "A popular hill station with scenic views and cool weather."
    },
    {
        "name": "Istanbul",
        "country": "Turkey",
        "region": "International",
        "base_cost": 190000,
        "styles": ["Culture", "History", "Family"],
        "description": "Explore historic architecture, markets and Bosphorus views."
    },
    {
        "name": "Dubai",
        "country": "UAE",
        "region": "International",
        "base_cost": 180000,
        "styles": ["Shopping", "Luxury", "Family"],
        "description": "Experience modern attractions, shopping and desert activities."
    },
    {
        "name": "Bangkok",
        "country": "Thailand",
        "region": "International",
        "base_cost": 190000,
        "styles": ["Culture", "Food", "Shopping"],
        "description": "Discover temples, street food and vibrant city life."
    },
    {
        "name": "Kuala Lumpur",
        "country": "Malaysia",
        "region": "International",
        "base_cost": 170000,
        "styles": ["Family", "Shopping", "Culture"],
        "description": "Explore modern landmarks, food and cultural attractions."
    },
    {
        "name": "Beijing",
        "country": "China",
        "region": "International",
        "base_cost": 230000,
        "styles": ["History", "Culture", "Adventure"],
        "description": "Visit historic landmarks and experience Chinese culture."
    },
    {
        "name": "Seoul",
        "country": "South Korea",
        "region": "International",
        "base_cost": 280000,
        "styles": ["Culture", "Shopping", "Food"],
        "description": "Explore Korean culture, technology and city attractions."
    },
    {
        "name": "Rome",
        "country": "Italy",
        "region": "International",
        "base_cost": 260000,
        "styles": ["History", "Culture", "Food"],
        "description": "Discover ancient architecture, museums and Italian cuisine."
    },
    {
        "name": "Paris",
        "country": "France",
        "region": "International",
        "base_cost": 280000,
        "styles": ["Romantic", "Culture", "Luxury"],
        "description": "Explore iconic landmarks, art and French culture."
    }
]


def recommend_destinations(
    budget_pkr: int,
    days: int,
    travelers: int = 1,
    preferred_region: str = "Any",
    travel_style: str = "Adventure",
    selected_destination: str = None
):
    """
    Selected destination is kept separate from alternatives.
    Costs are illustrative estimates, not live booking prices.
    """

    recommendations = []

    selected = None

    if selected_destination:
        selected = next(
            (
                item for item in DESTINATIONS
                if item["name"].lower() == selected_destination.strip().lower()
            ),
            None
        )

        if selected is None:
            raise ValueError(
                f"Unsupported destination: {selected_destination}"
            )

    for destination in DESTINATIONS:

        if selected and destination["name"] == selected["name"]:
            continue

        if (
            preferred_region.lower() != "any"
            and destination["region"].lower() != preferred_region.lower()
        ):
            continue

        estimated_cost = round(
            destination["base_cost"] * (days / 5) * travelers
        )

        style_match = (
            travel_style.lower() in
            [style.lower() for style in destination["styles"]]
        )

        recommendations.append({
            **destination,
            "estimated_cost": estimated_cost,
            "within_budget": estimated_cost <= budget_pkr,
            "style_match": style_match
        })

    recommendations.sort(
        key=lambda item: (
            not item["within_budget"],
            not item["style_match"],
            abs(budget_pkr - item["estimated_cost"])
        )
    )

    selected_result = None

    if selected:
        selected_cost = round(
            selected["base_cost"] * (days / 5) * travelers
        )

        selected_result = {
            **selected,
            "estimated_cost": selected_cost,
            "within_budget": selected_cost <= budget_pkr,
            "style_match": (
                travel_style.lower() in
                [style.lower() for style in selected["styles"]]
            )
        }

    return {
        "agent": "Destination Recommendation Agent",
        "selected_destination": selected_result,
        "selected_destination_within_budget": (
            selected_result["within_budget"] if selected_result else None
        ),
        "total_found": len(recommendations),
        "recommendations": recommendations[:5],
        "notice": (
            "The selected destination is kept separate from alternative "
            "destinations. All costs are illustrative estimates, not live prices."
        )
    }
