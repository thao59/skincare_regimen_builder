from rest_framework import serializers 
from .models import UserImage, UserProfile, Products, UserProduct

class ImageSerializer(serializers.ModelSerializer):
    class Meta: 
        model = UserImage
        fields = ["id", "image", "datetime"]

class ProfileSerializer(serializers.ModelSerializer):
    class Meta: 
        model = UserProfile
        fields = ["username", "age", "skintype", "skin_concern", "eye_concern", "pregnant", "products_type", "routine", "active_use", "active_ingre", "advanced_active_use", "no_products"]

class ProductSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Products 
        fields = ["product_name", "product_brand", "product_cat", "product_target", "product_price", "product_link", "product_img"]

class UserProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = UserProduct
        fields =["id", "product"] 
