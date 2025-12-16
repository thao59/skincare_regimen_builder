from bs4 import BeautifulSoup
import requests
from django.core.management.base import BaseCommand 
import json
from skincare.models import Products

class Command(BaseCommand):
    help = "Scaping product information from website"

    def handle(self, *args, **options): 
        url="https://www.mecca.com/en-au/glow-recipe/watermelon-glow-pha-bha-pore-tight-toner-150ml-limited-edition-I-068777/?cgpath=skincare-facialtoners"
        response = requests.get(url)

        get = BeautifulSoup(response.text, "html.parser")

        script_tag = get.find("script", {"id": "product-details-schema"})
        if script_tag:
            product_data = json.loads(script_tag.text)

            p_name = product_data.get("name")
            p_brand = product_data.get("brand", {}).get("name")
            p_price = product_data.get("offers", {}).get("price")
            if "$" in p_price:
                p_price = p_price.replace("$", "").strip()
            if "-" in p_price: 
                p_price = p_price.split("-")[0].strip()

            p_des = product_data.get("description")
            if "." in p_des: 
                p_des = p_des.split(".")[0] + "."
            img = product_data.get("image")
            if img: 
                image = img[0]
            else:
                image = None

            print(f"product name: {p_name}")
            print(f"product brand: {p_brand}")
            print(f"product price: {p_price}")
            print(f"product des: {p_des}")
            print(f"product img url: {image}")

            get_text = get.get_text()

            skintypes = []
            targets = set()
            ingre = []

            urll = url.lower()
            category = None
            if "suncreen" in urll:
                category = "sunscreen"
            elif "cleanser" in urll:
                category = "cleanser"
            elif "toner" in urll:
                category = "toner"
            elif "eye" in urll:
                category = "eye"
            elif "serum" in urll:
                category = "serum"
            elif "moituriser" in urll or "cream" in urll:
                category = "moisturiser"
            elif "micellarwater" in urll or "micellarcleanser" in urll:
                category = "micellar water"
            elif "oilbalmcleansers" in urll:
                category = "oil cleanser"   
            print(f"category: {category}")

            find = get.select("li.css-1n57mq5")
            for item in find:
                content = item.text.lower()
                if content == "all":
                    skintypes.append("all skin types")
                else:
                    if "breakouts" in content or "blemishes" in content:
                        targets.add("acne")
                    elif "dehydration" in content: 
                        targets.add("dehydrated")
                    elif "dry" in content: 
                        targets.add("dryness")
                    elif "fine lines" in content or "ageing" in content:
                        targets.add("aging")
                    elif "uneven texture" in content:
                        targets.add("texture")
                    else:
                        targets.add(content)
            targets = list(targets)
            print(f"skintypes: {skintypes}")
            print(f"product target: {targets}")

            get_div = get.select("div.css-y66j4m p.css-ft3nhk")
            for row in get_div:
                if ":" in row.text: 
                    text = row.text.split(":")[0]
                    ingre.append(text)
            print(ingre)
            if category == "micellar water" or category == "oil cleanser":
                product_time = "pm"
            else: 
                if (("day" in get_text.lower() or "morning" in get_text.lower()) and ("night" in get_text.lower() or "evening" in get_text.lower())) or ("A.M." in get_text and "P.M." in get_text) or ("AM and PM" in get_text):
                    product_time = "am_pm"
                elif "day" in get_text.lower():
                    product_time = "am"
                elif "night" in get_text.lower() or "evening" in get_text.lower():
                    product_time = "pm"
            print("product time: ",product_time)

            add_product = Products.objects.create(product_name=p_name, product_brand=p_brand, product_cat=category, product_main_ingre=ingre, product_target=targets, skintypes=skintypes, product_price=p_price, product_link=url, product_img=image, product_des=p_des, product_time = product_time)
            print("new_product: ", add_product)
        else:
            print("No JSON data found")

