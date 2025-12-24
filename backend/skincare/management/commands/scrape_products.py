from bs4 import BeautifulSoup
import requests
from django.core.management.base import BaseCommand 
import json
from skincare.models import Products

class Command(BaseCommand):
    help = "Scaping product information from website"

    def handle(self, *args, **options): 
        url="https://nudieglow.com/collections/skin-concern-sensitive-skin/products/klairs-midnight-blue-calming-cream"
        response = requests.get(url)

        get = BeautifulSoup(response.text, "html.parser")
        script_tag = get.find("script", {"id": "swym-snippet"})
        parts = script_tag.text.split(" window.SwymProductInfo.product = ")
        main = parts[1].split(',"tags"') 
        text = main[0] + "}"
        dict = json.loads(text)


        des = dict["description"]
        get_des = BeautifulSoup(des, "html.parser")
        des_text = get_des.text
        print(des_text)






        

        

        


