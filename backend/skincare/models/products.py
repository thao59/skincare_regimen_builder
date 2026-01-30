from django.db import models 

class Products(models.Model):
    product_name = models.CharField(max_length= 200)
    product_brand = models.CharField(max_length=200)
    product_cat = models.CharField(max_length=200)
    product_main_ingre = models.JSONField()
    product_target = models.JSONField(null = True)
    skintypes = models.JSONField(null=True)
    product_price = models.DecimalField (null = True, max_digits = 6, decimal_places=2)
    product_link = models.URLField(max_length=500)
    product_img = models.URLField(max_length=500)
    product_des = models.TextField(null=True)
    product_time = models.CharField(null=True)

    def __str__(self):
        return f"{self.product_brand} - {self.product_name}: {self.product_cat}, {self.product_price} - {self.product_time}"
    