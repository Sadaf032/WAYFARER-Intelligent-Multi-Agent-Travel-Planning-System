
MEAL_RATES = {
    "Pakistan": {
        "Breakfast": 500,
        "Lunch": 800,
        "Dinner": 1000
    },
    "International": {
        "Breakfast": 1200,
        "Lunch": 1800,
        "Dinner": 2200
    }
}


# Curated local food suggestions.
# These are food ideas, not live restaurant/menu results.

FOOD_RECOMMENDATIONS = {
    "karachi": [
        {
            "name": "Halwa Puri",
            "meal": "Breakfast",
            "description": "A traditional breakfast served with chana and halwa.",
            "dietary_tags": ["vegetarian"],
            "local_specialty": True
        },
        {
            "name": "Sindhi Biryani",
            "meal": "Lunch",
            "description": "A spicy rice dish with Sindhi-style masala.",
            "dietary_tags": ["halal"],
            "local_specialty": True
        },
        {
            "name": "Karahi",
            "meal": "Dinner",
            "description": "A popular Pakistani curry prepared with aromatic spices.",
            "dietary_tags": ["halal"],
            "local_specialty": False
        },
        {
            "name": "Chana Chaat",
            "meal": "Lunch",
            "description": "A chickpea snack with spices, chutney and vegetables.",
            "dietary_tags": ["vegetarian", "vegan", "gluten-free"],
            "local_specialty": False
        }
    ],

    "lahore": [
        {
            "name": "Lahori Chana",
            "meal": "Breakfast",
            "description": "Spicy chickpeas commonly enjoyed with breakfast.",
            "dietary_tags": ["vegetarian", "vegan"],
            "local_specialty": True
        },
        {
            "name": "Lahori Chargha",
            "meal": "Dinner",
            "description": "Whole chicken marinated with traditional spices.",
            "dietary_tags": ["halal", "gluten-free"],
            "local_specialty": True
        },
        {
            "name": "Nihari",
            "meal": "Breakfast",
            "description": "A slow-cooked traditional meat stew.",
            "dietary_tags": ["halal"],
            "local_specialty": True
        },
        {
            "name": "Saag",
            "meal": "Lunch",
            "description": "A traditional leafy-green curry.",
            "dietary_tags": ["vegetarian", "vegan"],
            "local_specialty": False
        }
    ],

    "islamabad": [
        {
            "name": "Chapli Kebab",
            "meal": "Lunch",
            "description": "A seasoned minced-meat patty popular in the region.",
            "dietary_tags": ["halal"],
            "local_specialty": True
        },
        {
            "name": "Chicken Karahi",
            "meal": "Dinner",
            "description": "Chicken cooked in a spicy tomato-based gravy.",
            "dietary_tags": ["halal"],
            "local_specialty": False
        },
        {
            "name": "Aloo Paratha",
            "meal": "Breakfast",
            "description": "Flatbread stuffed with seasoned potatoes.",
            "dietary_tags": ["vegetarian"],
            "local_specialty": False
        }
    ],

    "hyderabad": [
        {
            "name": "Sindhi Biryani",
            "meal": "Lunch",
            "description": "A famous Sindhi rice dish with aromatic spices.",
            "dietary_tags": ["halal"],
            "local_specialty": True
        },
        {
            "name": "Sai Bhaji",
            "meal": "Lunch",
            "description": "A traditional Sindhi dish made with greens and lentils.",
            "dietary_tags": ["vegetarian", "vegan"],
            "local_specialty": True
        },
        {
            "name": "Koki",
            "meal": "Breakfast",
            "description": "A traditional Sindhi flatbread with spices.",
            "dietary_tags": ["vegetarian"],
            "local_specialty": True
        }
    ],

    "peshawar": [
        {
            "name": "Chapli Kebab",
            "meal": "Lunch",
            "description": "A well-known Pashtun minced-meat specialty.",
            "dietary_tags": ["halal"],
            "local_specialty": True
        },
        {
            "name": "Kabuli Pulao",
            "meal": "Dinner",
            "description": "Rice cooked with meat, carrots and raisins.",
            "dietary_tags": ["halal"],
            "local_specialty": True
        }
    ],

    "default": [
        {
            "name": "Aloo Paratha",
            "meal": "Breakfast",
            "description": "Potato-stuffed flatbread.",
            "dietary_tags": ["vegetarian"],
            "local_specialty": False
        },
        {
            "name": "Daal Chawal",
            "meal": "Lunch",
            "description": "Lentils served with rice.",
            "dietary_tags": ["vegetarian", "vegan", "gluten-free"],
            "local_specialty": False
        },
        {
            "name": "Chicken Karahi",
            "meal": "Dinner",
            "description": "A traditional chicken curry.",
            "dietary_tags": ["halal"],
            "local_specialty": False
        }
    ]
}


VALID_DIETARY_PREFERENCES = {
    "halal",
    "vegetarian",
    "vegan",
    "gluten-free"
}


def calculate_meal_plan(
    region="Pakistan",
    days=5,
    travelers=2,
    breakfast="Included",
    lunch="Separate",
    dinner="Separate",
    destination="",
    dietary_preferences=None
):
    region_key = region.strip().title()

    if region_key not in MEAL_RATES:
        raise ValueError("Region must be Pakistan or International.")

    if not 1 <= days <= 30:
        raise ValueError("Days must be between 1 and 30.")

    if not 1 <= travelers <= 20:
        raise ValueError("Travelers must be between 1 and 20.")

    destination = destination.strip()

    preferences = {
        "Breakfast": breakfast,
        "Lunch": lunch,
        "Dinner": dinner
    }

    meal_details = {}
    total_cost = 0

    for meal, preference in preferences.items():
        if not isinstance(preference, str):
            raise ValueError(f"{meal} preference must be text.")

        preference = preference.strip().title()

        if preference not in ["Included", "Separate", "Skip"]:
            raise ValueError(
                f"{meal} must be Included, Separate, or Skip."
            )

        if preference == "Separate":
            per_person_cost = MEAL_RATES[region_key][meal]
            meal_cost = per_person_cost * days * travelers
        else:
            per_person_cost = 0
            meal_cost = 0

        meal_details[meal.lower()] = {
            "preference": preference,
            "cost_per_person_per_day": per_person_cost,
            "total_cost": meal_cost
        }

        total_cost += meal_cost

    # Validate dietary preferences
    if dietary_preferences is None:
        dietary_preferences = []

    selected_diets = [
        item.strip().lower()
        for item in dietary_preferences
        if isinstance(item, str)
    ]

    invalid_diets = set(selected_diets) - VALID_DIETARY_PREFERENCES

    if invalid_diets:
        raise ValueError(
            f"Unsupported dietary preferences: {', '.join(invalid_diets)}"
        )

    # Find destination-specific food suggestions
    destination_key = destination.lower()

    food_list = FOOD_RECOMMENDATIONS.get(
        destination_key,
        FOOD_RECOMMENDATIONS["default"]
    )

    # Filter recommendations according to dietary preferences
    if selected_diets:
        food_list = [
            food for food in food_list
            if all(
                diet in food["dietary_tags"]
                for diet in selected_diets
            )
        ]

    # Group food recommendations by meal
    recommended_meals = {
        "breakfast": [],
        "lunch": [],
        "dinner": []
    }

    for food in food_list:
        meal_key = food["meal"].lower()
        recommended_meals[meal_key].append(food)

    return {
        "agent": "Intelligent Meal Planning Agent",
        "destination": destination or "Not specified",
        "region": region_key,
        "days": days,
        "travelers": travelers,
        "dietary_preferences": selected_diets,
        "meals": meal_details,
        "recommendations": recommended_meals,
        "total_meal_cost": total_cost,
        "currency": "PKR",
        "source": "WAYFARER curated food suggestions",
        "notice": (
            "Meal costs are illustrative estimates. "
            "Food suggestions are curated ideas, not verified live menus. "
            "Check ingredients and preparation with the restaurant, "
            "especially for allergies and dietary restrictions."
        )
    }
