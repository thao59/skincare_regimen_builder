from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass 

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="info")
    username = models.CharField(max_length=150, null=True)
    age = models.IntegerField()
    skintype = models.CharField (max_length=50)
    skin_concern = models.JSONField(default=list)
    eye_concern = models.JSONField(null=True)
    pregnant = models.BooleanField(default = False)
    products_type = models.JSONField(null = True, blank=True)
    routine= models.CharField(max_length=200, null=True, blank=True)
    active_use = models.BooleanField(null=True, blank=True)
    active_ingre = models.JSONField(null=True, blank=True)
    advanced_active_use = models.CharField(max_length=150, null=True, blank=True)
    no_products = models.IntegerField(null = True, blank=True)

    def __str__(self):
        return f"User: {self.user}, Username: {self.username} Age: {self.age}, Pregnant: {self.pregnant}, Skin type: {self.skintype}, Skin concern: {self.skin_concern}, Eye concern: {self.eye_concern}, Routine: {self.routine}, Product types: {self.products_type}, Active use: {self.active_use}, Active Ingredient: {self.active_ingre}, Advanced active use: {self.advanced_active_use}, Number of products: {self.no_products} "
    
class UserImage(models.Model): 
    userinfo = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="image_profile")
    datetime = models.DateTimeField(auto_now_add=True, null=True)
    #install Pillow to use field ImageField
    image = models.ImageField(upload_to="photo/", blank=True, null=True)

    def __str__(self):
        return f"Info: {self.userinfo}, Date and time: {self.datetime}, Image: {self.image}"

class Products(models.Model):
    product_name = models.CharField(max_length= 200)
    product_brand = models.CharField(max_length=200)
    product_cat = models.CharField(max_length=200)
    product_main_ingre = models.JSONField()
    product_target = models.JSONField(null = True)
    skintypes = models.JSONField(null=True)
    product_price = models.DecimalField (null = True, max_digits = 6, decimal_places=2)
    product_link = models.URLField(max_length=500)
    product_img = models.ImageField(upload_to="product/")
    product_des = models.TextField(null=True)
    product_time = models.CharField(null=True)

    def __str__(self):
        return f"{self.product_brand} - {self.product_name}: {self.product_cat}, {self.product_price} - {self.product_time}"
    
class UserProduct(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "recommendation")
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name="recommended_to")

    def __str__(self):
        return f"User: {self.user} Rec: {self.product}"