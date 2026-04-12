APP_CATEGORY_MAP = {
    "pothole": "Road",
    "road_crack": "Road",
    "Damaged_Concrete_Structures": "Road",
    "Damaged_Road_Signs": "Road",
    "Garbage": "Garbage",
    "Dead_Animal_Pollution": "Garbage",
    "Damaged_Electric_Poles": "Lighting",
    "Fallen_Trees": "Other",
    "Graffiti": "Other",
}


def map_label_to_category(label: str) -> str:
    return APP_CATEGORY_MAP.get(label, "Other")


def category_priority(category: str) -> str:
    priorities = {
        "Road": "High",
        "Water": "High",
        "Drainage": "High",
        "Lighting": "Medium",
        "Garbage": "Medium",
        "Other": "Medium",
    }
    return priorities.get(category, "Medium")
