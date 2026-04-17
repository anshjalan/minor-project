APP_CATEGORY_MAP = {
    "pothole": "Pothole",
    "road_crack": "Road Crack",
    "Damaged_Concrete_Structures": "Damaged Concrete Structures",
    "Damaged_Road_Signs": "Damaged Road Signs",
    "Garbage": "Garbage",
    "Dead_Animal_Pollution": "Dead Animal Pollution",
    "Damaged_Electric_Poles": "Damaged Electric Poles",
    "Fallen_Trees": "Fallen Trees",
    "Graffiti": "Graffiti",
}


def map_label_to_category(label: str) -> str:
    return APP_CATEGORY_MAP.get(label, "Other")


def category_priority(category: str) -> str:
    priorities = {
        "Road Crack": "High",
        "Pothole": "High",
        "Damaged Concrete Structures": "High",
        "Damaged Electric Poles": "High",
        "Dead Animal Pollution": "High",
        "Garbage": "Medium",
        "Damaged Road Signs": "Medium",
        "Fallen Trees": "Medium",
        "Graffiti": "Low",
    }
    return priorities.get(category, "Medium")
