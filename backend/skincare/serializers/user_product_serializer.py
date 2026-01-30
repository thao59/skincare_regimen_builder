from rest_framework import serializers 
from ..models import UserProduct
from .product_serializer import ProductSerializer

class UserProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = UserProduct
        fields =["id", "product"] 