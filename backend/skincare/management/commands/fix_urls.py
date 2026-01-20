from bs4 import BeautifulSoup
import requests
from django.core.management.base import BaseCommand 
import json
from skincare.models import Products

class Command(BaseCommand):  
    def handle(self, *args, **options): 
        products = Products.objects.all()
        for row in products: 
            if "mecca.com" in row.product_link: 
                response = requests.get(row.product_link)
                soup = BeautifulSoup(response.content, 'html.parser')
                element = soup.find ("script", {"id": "product-details-schema"})
                text = element.get_text()
                text = json.loads(text)
                product_name = text["name"]
                image = text["image"][0]
                if row.product_name == product_name:
                    row.product_img = image
                    row.save()


        
