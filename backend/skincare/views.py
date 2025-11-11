from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from rest_framework import status 
from .models import User, UserProfile, UserImage, Products
from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework.decorators import permission_classes 
from rest_framework.permissions import IsAuthenticated 
from .serializers import ImageSerializer, ProfileSerializer, ProductSerializer
import base64  

# Create your views here.
@api_view(["POST"])
def signup(request):

    #request.data is dict automatically parsed by DRF. 
    #catch missing keys 
    try: 
        username = request.data["username"]
        email = request.data["email"]
        password = request.data["password"]
        confirm_password = request.data["confirm_password"]
    except KeyError: 
        return Response({"error": "Missing key"}, status = status.HTTP_400_BAD_REQUEST)
    
    #catch empty keys 
    if not username or not email or not password or not confirm_password: 
        return Response({"error": "All fields are required"}, status = status.HTTP_400_BAD_REQUEST )
        
    if password != confirm_password:
        return Response({"error": "Passwords do not match"}, status = status.HTTP_400_BAD_REQUEST)
    
    #check if user already exists in the db. If yes,return error message. If no, create and save account to db 
    check_email = User.objects.filter(email=email).exists()
    if check_email:
        return Response({"error": "This email is associated with an account!"}, status = status.HTTP_400_BAD_REQUEST)

    check_username = User.objects.filter(username = username).exists()
    if check_username: 
        return Response({"error": "This username has been taken!"}, status = status.HTTP_400_BAD_REQUEST)
    
  
    create_account = User.objects.create_user(email=email, username=username, password=password)
    
    #create refresh/access token for new user 
    new_token = RefreshToken.for_user(create_account)
    get_refresh = str(new_token)
    get_access = str(new_token.access_token)
    return Response({"access" : get_access, "refresh": get_refresh}, status = status.HTTP_201_CREATED)


@api_view(["POST"])
def processdata(request):
    #extract all data from json. For required fields, check for valid value 
    user_name = request.data["name"]
    if not user_name:
        return Response({"error": "Missing value"}, status= status.HTTP_400_BAD_REQUEST)
    
    user_age = request.data["age"]
    if not user_age:
        return Response({"error": "Missing value"}, status = status.HTTP_400_BAD_REQUEST)
    
    user_skintype = request.data["skin_type"]
    if not user_skintype: 
        return Response({"error": "missing value"}, status = status.HTTP_400_BAD_REQUEST)
    
    user_skinconcern = request.data["skin_concern"]
    if not user_skinconcern:
        return Response({"error": "Missing value"}, status = status.HTTP_400_BAD_REQUEST)
    
    user_pregnant = request.data["pregnant"]
    if user_pregnant is None: 
        return Response({"error": "Missing value"}, status=status.HTTP_400_BAD_REQUEST)
    
    #dont need to check valid value for optional fields 
    user_eyeconcern = request.data["eye_concern"]
    user_products_type = request.data["products_type"]
    user_routine = request.data["routine"]
    user_active_use = request.data["active_use"]
    user_activeIngre = request.data["activeIngre"]
    user_advanced_use = request.data["advanced_user"]
    user_no_products = request.data["no_products"]

    #check if user uploads photo
    if "image_file" in request.FILES:
        get_image = request.FILES["image_file"]
    
        if not get_image: 
            return Response({"error": "image is failed to fetch"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            #ensure img < 5MB 
            if get_image.size > 5*1024*1024: 
                return Response({"error": "Image exceeds 5MB"}, status = status.HTTP_400_BAD_REQUEST)
            
            #if user is logged in
            if request.user_is.authenticated: 
                #get UserProfile instance
                user = request.user.info
                
                #save imgs to db 
                try:
                    save_image = UserImage.objects.create(userinfo = user, image = get_image)
                    print(f"Save image successfully: {save_image}")
                except Exception as e:
                    print(f"Image saved unsuccessfully, error: {e}")
                    return Response({"error": "Image saved unsuccessfully"})
            
            #if user is not logged in
            else: 
                #this step is for not logged in user (convert binary img to based 64 strings and send back to frontend for display)
                #detect image type 
                img_type = get_image.content_type 
                convert_img = base64.b64encode(get_image.read()).decode("utf-8")
                image_file = f"data: {img_type};base64,{convert_img}"

    #query product list according to category 
    cleanser_list = Products.objects.filter(product_cat = "cleanser")
    toner_list = Products.objects.filter(product_cat = "toner")
    serum_list = Products.objects.filter(product_cat = "serum")
    moisturiser_list = Products.objects.filter(product_cat = "moisturiser")
    sunscreen_list = Products.objects.filter(product_cat = "sunscreen")
    eye_list = Products.objects.filter(product_cat = "eye")
    oil_cleanser_list = Products.objects.filter(product_cat="oil cleanser")
    micellar_water_list = Products.objects.filter(product_cat = "micellar water")

    cleanser = []
    toner = []
    serum = []
    moisturiser = []
    sunscreen = []
    eye = []
    oil_cleanser = []
    micellar_water = []

    #if user is LOGGED IN
    if request.user_is.authenticated:
        #get user instance 
        get_user = request.user 

        #save data if new profile. If there's an existing profile, modify fields 
        profile, created = UserProfile.objects.update_or_create(
            user = get_user, 
            defaults = {
                "username" : user_name, 
                "age": user_age, 
                "skintype":  user_skintype, 
                "skin_concern": user_skinconcern, 
                "eye_concern": user_eyeconcern, 
                "pregnant": user_pregnant, 
                "products_type": user_products_type, 
                "routine": user_routine, 
                "active_use": user_active_use, 
                "active_ingre": user_activeIngre, 
                "advanced_active_use": user_advanced_use, 
                "no_products": user_no_products,
            })
        
        #loop through the list and append those catering to user's skin concern
        for row in cleanser_list:
            if profile.pregnant and "avoid pregnancy" in row.product_target:
                continue
            
            if profile.skintype in row.skintypes or any(item in row.product_target for item in profile.skin_concern) or "all skin types" in row.skintypes:
                add_product = {
                    "name": row.product_name, 
                    "brand": row.product_brand, 
                    "category": row.product_cat, 
                    "price": row.product_price, 
                    "link": row.product_link, 
                    "product_img": row.product_img, 
                }
                cleanser.append(add_product)
                print(f"cleanser list: {cleanser}")

    
        for row in toner_list: 
            if profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            if profile.skintype in row.skintypes or any(item in row.product_target for item in profile.skin_concern) or "all skin types" in row.skintypes:
                add_product = {
                    "name": row.product_name, 
                    "brand": row.product_brand, 
                    "category": row.product_cat, 
                    "price": row.product_price, 
                    "link": row.product_link, 
                    "product_img": row.product_img, 
                }
                toner.append(add_product)

        for row in serum_list: 
            if profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            if profile.skintype in row.skintypes or any(item in row.product_target for item in profile.skin_concern) or "all skin types" in row.skintypes:
                add_product = {
                    "name": row.product_name, 
                    "brand": row.product_brand, 
                    "category": row.product_cat, 
                    "price": row.product_price, 
                    "link": row.product_link, 
                    "product_img": row.product_img, 
                }
                serum.append(add_product)
        
        for row in moisturiser_list: 
            if profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            if profile.skintype in row.skintypes or any(item in row.product_target for item in profile.skin_concern) or "all skin types" in row.skintypes:
                add_product = {
                    "name": row.product_name, 
                    "brand": row.product_brand, 
                    "category": row.product_cat, 
                    "price": row.product_price, 
                    "link": row.product_link, 
                    "product_img": row.product_img, 
                }
                moisturiser.append(add_product)
        
        for row in sunscreen_list: 
            if profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            if profile.skintype in row.skintypes or any(item in row.product_target for item in profile.skin_concern) or "all skin types" in row.skintypes:
                add_product = {
                    "name": row.product_name, 
                    "brand": row.product_brand, 
                    "category": row.product_cat, 
                    "price": row.product_price, 
                    "link": row.product_link, 
                    "product_img": row.product_img, 
                }
                sunscreen.append(add_product)
        
        for row in eye_list: 
            if profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            if profile.skintype in row.skintypes or any (item in row.product_target for item in profile.eye_concern) or "all skin types" in row.skintypes: 
                add_product = {
                    "name": row.product_name, 
                    "brand": row.product_brand, 
                    "category": row.product_cat, 
                    "price": row.product_price, 
                    "link": row.product_link, 
                    "product_img": row.product_img, 
                }
                eye.append(add_product)
        
        if "acne" in profile.skin_conern:
            for row in micellar_water_list:
                if profile.pregnant and "avoid pregnancy" in row.product_target:
                    continue

                if profile.skintype in row.skintypes or any(item in row.product_target for item in profile.skin_concern) or "all skin types" in row.skintypes: 
                    add_product = {
                        "name": row.product_name, 
                        "brand": row.product_brand, 
                        "category": row.product_cat, 
                        "price": row.product_price, 
                        "link": row.product_link, 
                        "product_img": row.product_img, 
                    }
                    micellar_water.append(add_product)
        else: 
            for row in oil_cleanser_list:
                if profile.pregnant and "avoid pregnancy" in row.product_target:
                    continue

                if profile.skintype in row.skintypes or any(item in row.product_target for item in profile.skin_concern) or "all skin types" in row.skintypes: 
                    add_product = {
                        "name": row.product_name, 
                        "brand": row.product_brand, 
                        "category": row.product_cat, 
                        "price": row.product_price, 
                        "link": row.product_link, 
                        "product_img": row.product_img, 
                    } 
                    oil_cleanser.append(add_product)
        
   
        skininfo = ProfileSerializer(user)
                
        #query img objects
        get_img_obj = user.image_profile.order_by("-datetime").all()
        
        if get_img_obj: 
            images = ImageSerializer(get_img_obj, many=True)
            return Response ({"message": "success", "image": images.data, "skininfo": skininfo.data, "cleanser": cleanser, "toner": toner, "serum": serum, "moisturiser": moisturiser, "sunscreen": sunscreen, "eye": eye, "cleansing_oil": oil_cleanser, "micellar_water": micellar_water}, status=status.HTTP_200_OK)
        else:
            return Response ({"message": "success", "image": None, "skininfo": skininfo.data, "cleanser": cleanser, "toner": toner, "serum": serum, "moisturiser": moisturiser, "sunscreen": sunscreen, "eye": eye, "cleansing_oil": oil_cleanser, "micellar_water": micellar_water}, status=status.HTTP_200_OK)
    
    #if user is NOT LOGGED IN
    else:
        for row in cleanser_list:
            if user_pregnant and "avoid pregnancy" in row.product_target:
                continue
            
            if user_skintype in row.skintypes or any(item in row.product_target for item in user_skinconcern) or "all skin types" in row.skintypes:
                add_product = {
                    "name": row.product_name, 
                    "brand": row.product_brand, 
                    "category": row.product_cat, 
                    "price": row.product_price, 
                    "link": row.product_link, 
                    "product_img": row.product_img, 
                }
                cleanser.append(add_product)
                print(f"cleanser list: {cleanser}")

        for row in toner_list: 
            if user_pregnant and "avoid pregnancy" in row.product_target:
                continue

            if user_skintype in row.skintypes or any(item in row.product_target for item in user_skinconcern) or "all skin types" in row.skintypes: 
                add_product = {
                    "name": row.product_name, 
                    "brand": row.product_brand, 
                    "category": row.product_cat, 
                    "price": row.product_price, 
                    "link": row.product_link, 
                    "product_img": row.product_img, 
                }
                toner.append(add_product)

        for row in serum_list: 
            if user_pregnant and "avoid pregnancy" in row.product_target:
                continue

            if user_skintype in row.skintypes or any(item in row.product_target for item in user_skinconcern) or "all skin types" in row.skintypes:
                add_product = {
                    "name": row.product_name, 
                    "brand": row.product_brand, 
                    "category": row.product_cat, 
                    "price": row.product_price, 
                    "link": row.product_link, 
                    "product_img": row.product_img, 
                }
                serum.append(add_product)
        
        for row in moisturiser_list: 
            if user_pregnant and "avoid pregnancy" in row.product_target:
                continue

            if user_skintype in row.skintypes or any(item in row.product_target for item in user_skinconcern) or "all skin types" in row.skintypes:
                add_product = {
                    "name": row.product_name, 
                    "brand": row.product_brand, 
                    "category": row.product_cat, 
                    "price": row.product_price, 
                    "link": row.product_link, 
                    "product_img": row.product_img, 
                }
                moisturiser.append(add_product)
        
        for row in sunscreen_list: 
            if user_pregnant and "avoid pregnancy" in row.product_target:
                continue

            if user_skintype in row.skintypes or any(item in row.product_target for item in user_skinconcern) or "all skin types" in row.skintypes:
                add_product = {
                    "name": row.product_name, 
                    "brand": row.product_brand, 
                    "category": row.product_cat, 
                    "price": row.product_price, 
                    "link": row.product_link, 
                    "product_img": row.product_img, 
                }
                sunscreen.append(add_product)
        
        for row in eye_list: 
            if user_pregnant and "avoid pregnancy" in row.product_target:
                continue

            if user_skintype in row.skintypes or any( item in row.product_target for item in user_eyeconcern) or row.skintypes == "all skin types": 
                add_product = {
                    "name": row.product_name, 
                    "brand": row.product_brand, 
                    "category": row.product_cat, 
                    "price": row.product_price, 
                    "link": row.product_link, 
                    "product_img": row.product_img, 
                }
                eye.append(add_product)
        
        if "acne" in user_skinconcern:
            for row in micellar_water_list:
                if user_pregnant and "avoid pregnancy" in row.product_target:
                    continue

                if user_skintype in row.skintypes or any(item in row.product_target for item in user_skinconcern) or "all skin types" in row.skintypes:
                    add_product = {
                        "name": row.product_name, 
                        "brand": row.product_brand, 
                        "category": row.product_cat, 
                        "price": row.product_price, 
                        "link": row.product_link, 
                        "product_img": row.product_img, 
                    }
                    micellar_water.append(add_product)
        else: 
            for row in oil_cleanser_list:
                if user_pregnant and "avoid pregnancy" in row.product_target:
                    continue

                if user_skintype in row.skintypes or any(item in row.product_target for item in user_skinconcern) or "all skin types" in row.skintypes:
                    add_product = {
                        "name": row.product_name, 
                        "brand": row.product_brand, 
                        "category": row.product_cat, 
                        "price": row.product_price, 
                        "link": row.product_link, 
                        "product_img": row.product_img, 
                    } 
                    oil_cleanser.append(add_product)   
        if image_file: 
            return Response({"message": "success", "image": image_file, "skininfo": skininfo.data, "cleanser": cleanser, "toner": toner, "serum": serum, "moisturiser": moisturiser, "sunscreen": sunscreen, "eye": eye, "cleansing_oil": oil_cleanser, "micellar_water": micellar_water}, status = status.HTTP_200_OK)
        else: 
            return Response ({"message": "success", "image": None, "skininfo": skininfo.data, "cleanser": cleanser, "toner": toner, "serum": serum, "moisturiser": moisturiser, "sunscreen": sunscreen, "eye": eye, "cleansing_oil": oil_cleanser, "micellar_water": micellar_water}, status=status.HTTP_200_OK)

@api_view(["POST"])
def processimage(request): 

    #if user is logged in
    if request.user_is.authenticated: 
        #get username for display
        get_name = request.user.username


       
    


        
        




        

    #if user is not logged in 
    else:
        pass
        







    





        



        
    
          