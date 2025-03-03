import json

def get_yelp_categories():
    with open("app/constants/categories.json", "r") as f:
        categories = json.load(f)

        categories = categories["categories"]

        # Filter categories related to restaurants
        restaurant_categories = [
            category
            for category in categories
            if "restaurants" in category["parent_aliases"]
            or category["alias"] == "restaurants"
        ]

        # Sort categories alphabetically by title
        sorted_categories = sorted(restaurant_categories, key=lambda x: x["title"])

        # List of categories
        categories_list = [category["alias"] for category in sorted_categories]

        return categories_list
