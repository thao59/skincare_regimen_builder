from rest_framework.decorators import api_view
from ..models import UserProfile, UserProduct
from rest_framework.response import Response 
from rest_framework import status 
from rest_framework.decorators import permission_classes 
from rest_framework.permissions import IsAuthenticated 
from django.core.mail import send_mail 

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sendEmail (request): 
    #query user's profile and product recs 

    user = request.user
    get_profile = UserProfile.objects.get(user=user)
    get_recs = UserProduct.objects.filter(user=user)

    message = f"Name: {get_profile.username }\n Age: {get_profile.age }\n Skin type: {get_profile.skintype }\n Skin concern: {", ".join(get_profile.skin_concern)}\n"

    if get_profile.eye_concern: 
        message += f"Eye concern: {", ".join(get_profile.eye_concern)}\n"
    
    if get_profile.pregnant: 
        message += "Pregnant: Yes \n"
    else: 
        message += "Pregnant: No \n"

    if get_profile.products_type: 
        message += f"Current routine: {", ".join(get_profile.products_type)}\n"
    elif get_profile.routine: 
        message += f"Current routine: {"Don't have a routine"}\n"
        
    if get_profile.active_use is not None: 
        if get_profile.active_use: 
            message += "Use active in routine: Yes \n"
        else:
            message += "Use active in routine: No \n"
    
    if get_profile.active_ingre: 
        message += f"Currently use active: {", ".join(get_profile.active_ingre) }\n"

    if get_profile.advanced_active_use: 
        message += f"Experienced level with active: {get_profile.advanced_active_use}\n"
    
    message += f"Preferred number of products in routine: {get_profile.no_products}\n"

    message += f"\n Recommended products: \n"

    for row in get_recs: 
        if row.product.product_cat == "cleanser": 
            message += f"{row.product.product_brand} {row.product.product_name} - Where to buy: {row.product.product_link.split("?")[0]}\n"
        if row.product.product_cat == "toner": 
            message += f"{row.product.product_brand} {row.product.product_name} - Where to buy: {row.product.product_link.split("?")[0]}\n"
        if row.product.product_cat == "serum":
            message += f"{row.product.product_brand} {row.product.product_name} - Where to buy: {row.product.product_link.split("?")[0]}\n"
        if row.product.product_cat == "moisturiser":
            message += f"{row.product.product_brand} {row.product.product_name} - Where to buy: {row.product.product_link.split("?")[0]}\n"
        if row.product.product_cat == "eye": 
            message += f"{row.product.product_brand} {row.product.product_name} - Where to buy: {row.product.product_link.split("?")[0]}\n"
        if row.product.product_cat == "sunscreen": 
            message += f"{row.product.product_brand} {row.product.product_name} - Where to buy: {row.product.product_link.split("?")[0]}\n"
        if row.product.product_cat == "oilcleanser": 
            message += f"{row.product.product_brand} {row.product.product_name} - Where to buy: {row.product.product_link.split("?")[0]}\n"
        if row.product.product_cat == "micellarwater": 
            message += f"{row.product.product_brand} {row.product.product_name} - Where to buy: {row.product.product_link.split("?")[0]}\n"
                        
    send_mail(
        subject="Your Skincare Recommendation",
        message=message, 
        from_email=None,
        recipient_list=[user.email],
        fail_silently =False,
    )

    return Response ({"message": "success"}, status=status.HTTP_200_OK)



