from rest_framework import serializers 
from ..models import Products

class ProductSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Products 
        fields = ["product_name", "product_brand", "product_cat", "product_target", "skintypes", "product_price", "product_link", "product_img", "product_des", "product_time"]
