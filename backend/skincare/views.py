from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from rest_framework import status 
from .models import User, UserProfile, UserImage, Products, UserProduct
from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework.decorators import permission_classes 
from rest_framework.permissions import IsAuthenticated 
from .serializers import ImageSerializer, ProfileSerializer, ProductSerializer, UserProductSerializer
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

    img_file = None

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
            if request.user.is_authenticated: 
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
                img_file = f"data: {img_type};base64,{convert_img}"
                print(f"image file: {img_file}")

    #query product list according to category 
    cleanser_list = Products.objects.filter(product_cat = "cleanser")
    toner_list = Products.objects.filter(product_cat = "toner")
    serum_list = Products.objects.filter(product_cat = "serum")
    moisturiser_list = Products.objects.filter(product_cat = "moisturiser")
    physical_sunscreen_list = Products.objects.filter(product_cat = "physical sunscreen")
    chemical_sunscreen_list = Products.objects.filter(product_cat = "chemical sunscreen")
    eye_list = Products.objects.filter(product_cat = "eye")
    oil_cleanser_list = Products.objects.filter(product_cat="oil cleanser")
    micellar_water_list = Products.objects.filter(product_cat = "micellar water")

    cleanser = {"high_score": [], "mid_score": [], "low_score": []}
    toner = {"high_score": [], "mid_score": [], "low_score": []}
    serum = {"high_score": [], "mid_score": [], "low_score": []}
    moisturiser = {"high_score": [], "mid_score": [], "low_score": []}
    sunscreen = {"high_score": [], "mid_score": [], "low_score": []}
    eye = {"high_score": [], "mid_score": [], "low_score": []}
    oil_cleanser = {"high_score": [], "mid_score": [], "low_score": []}
    micellar_water = {"high_score": [], "mid_score": [], "low_score": []}

    #if USER IS LOGGED IN
    if request.user.is_authenticated:
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
        #detele the old recommendation and only saving the latest
        UserProduct.objects.filter(user = request.user).delete()

        #loop through the list and append those catering to user's skin concern
        for row in cleanser_list:
            # if user is pregnant and product is marked avoid pregnancy then skip that product
            if profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if profile.skintype in row.skintypes: 
                score += 1
            if any(item in row.product_target for item in profile.skin_concern):
                score += 1
            if "all skin types" in row.skintypes:
                score += 1
            
            # rank products according to scores 
            if score == 3:
                cleanser["high_score"].append(row)
            elif score == 2:
                cleanser["mid_score"].append(row)
            elif score == 1:
                cleanser["low_score"].append(row)

        #initiate product count
        count = 0

        #loop through cleanser list and save products with the highest scores to the db
        #if less than 4 products saved to db, continue to loop through each cat until 4 products are saved 
        if cleanser["high_score"]: 
            for row in cleanser["high_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        if count < 4 and cleanser["mid_score"]: 
            for row in cleanser["mid_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        if count < 4 and cleanser["low_score"]: 
            for row in cleanser["low_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        for row in toner_list: 
            # if user is pregnant and product is marked avoid pregnancy then skip that product
            if profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if profile.skintype in row.skintypes: 
                score += 1
            if any(item in row.product_target for item in profile.skin_concern):
                score += 1
            if "all skin types" in row.skintypes:
                score += 1
            
            # rank products according to scores 
            if score == 3:
                toner["high_score"].append(row)
            elif score == 2:
                toner["mid_score"].append(row)
            elif score == 1:
                toner["low_score"].append(row)

        #initiate product count
        count = 0

        #loop through cleanser list and save products with the highest scores to the db
        #if less than 4 products saved to db, continue to loop through each cat until 4 products are saved 
        if toner["high_score"]: 
            for row in toner["high_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        if count < 4 and toner["mid_score"]: 
            for row in toner["mid_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        if count < 4 and toner["low_score"]: 
            for row in toner["low_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        for row in serum_list: 
            # if user is pregnant and product is marked avoid pregnancy then skip that product
            if profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if profile.skintype in row.skintypes: 
                score += 1
            if any(item in row.product_target for item in profile.skin_concern):
                score += 1
            if "all skin types" in row.skintypes:
                score += 1
            
            # rank products according to scores 
            if score == 3:
                serum["high_score"].append(row)
            elif score == 2:
                serum["mid_score"].append(row)
            elif score == 1:
                serum["low_score"].append(row)

        #initiate product count
        count = 0

        #loop through cleanser list and save products with the highest scores to the db
        #if less than 4 products saved to db, continue to loop through each cat until 4 products are saved 
        if serum["high_score"]: 
            for row in serum["high_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        if count < 4 and serum["mid_score"]: 
            for row in serum["mid_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        if count < 4 and serum["low_score"]: 
            for row in serum["low_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break
        
        for row in moisturiser_list: 
            # if user is pregnant and product is marked avoid pregnancy then skip that product
            if profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if profile.skintype in row.skintypes: 
                score += 1
            if any(item in row.product_target for item in profile.skin_concern):
                score += 1
            if "all skin types" in row.skintypes:
                score += 1
            
            # rank products according to scores 
            if score == 3:
                moisturiser["high_score"].append(row)
            elif score == 2:
                moisturiser["mid_score"].append(row)
            elif score == 1:
                moisturiser["low_score"].append(row)

        #initiate product count
        count = 0

        #loop through cleanser list and save products with the highest scores to the db
        #if less than 4 products saved to db, continue to loop through each cat until 4 products are saved 
        if moisturiser["high_score"]: 
            for row in moisturiser["high_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        if count < 4 and moisturiser["mid_score"]: 
            for row in moisturiser["mid_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        if count < 4 and moisturiser["low_score"]: 
            for row in moisturiser["low_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        #if acne is the concern, only loop through physcial sunscreen list
        if "acne" in profile.skin_concern or "sensitive" in profile.skin_concern:   
            for row in physical_sunscreen_list: 
                if profile.pregnant and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if profile.skintype in row.skintypes: 
                    score += 1
                if any(item in row.product_target for item in profile.skin_concern):
                    score += 1
                if "all skin types" in row.skintypes:
                    score += 1
                
                # rank products according to scores 
                if score == 3:
                    sunscreen["high_score"].append(row)
                elif score == 2:
                    sunscreen["mid_score"].append(row)
                elif score == 1:
                    sunscreen["low_score"].append(row)

            #initiate product count
            count = 0

            #loop through cleanser list and save products with the highest scores to the db
            #if less than 4 products saved to db, continue to loop through each cat until 4 products are saved 
            if sunscreen["high_score"]: 
                for row in sunscreen["high_score"]:
                    if count < 4: 
                        UserProduct.objects.create(user=request.user, product=row)
                        count += 1
                    else:
                        break

            if count < 4 and sunscreen["mid_score"]: 
                for row in sunscreen["mid_score"]:
                    if count < 4: 
                        UserProduct.objects.create(user=request.user, product=row)
                        count += 1
                    else:
                        break

            if count < 4 and sunscreen["low_score"]: 
                for row in sunscreen["low_score"]:
                    if count < 4: 
                        UserProduct.objects.create(user=request.user, product=row)
                        count += 1
                    else:
                        break
        else: 
            for row in chemical_sunscreen_list: 
                if profile.pregnant and "avoid pregnancy" in row.product_target:
                    continue  

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if profile.skintype in row.skintypes: 
                    score += 1
                if any(item in row.product_target for item in profile.skin_concern):
                    score += 1
                if "all skin types" in row.skintypes:
                    score += 1
                
                # rank products according to scores 
                if score == 3:
                    sunscreen["high_score"].append(row)
                elif score == 2:
                    sunscreen["mid_score"].append(row)
                elif score == 1:
                    sunscreen["low_score"].append(row)

            #initiate product count
            count = 0

            #loop through cleanser list and save products with the highest scores to the db
            #if less than 4 products saved to db, continue to loop through each cat until 4 products are saved 
            if sunscreen["high_score"]: 
                for row in sunscreen["high_score"]:
                    if count < 4: 
                        UserProduct.objects.create(user=request.user, product=row)
                        count += 1
                    else:
                        break

            if count < 4 and sunscreen["mid_score"]: 
                for row in sunscreen["mid_score"]:
                    if count < 4: 
                        UserProduct.objects.create(user=request.user, product=row)
                        count += 1
                    else:
                        break

            if count < 4 and sunscreen["low_score"]: 
                for row in sunscreen["low_score"]:
                    if count < 4: 
                        UserProduct.objects.create(user=request.user, product=row)
                        count += 1
                    else:
                        break

        
        for row in eye_list: 
            if profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if profile.skintype in row.skintypes: 
                score += 1
            if any(item in row.product_target for item in profile.skin_concern):
                score += 1
            if "all skin types" in row.skintypes:
                score += 1
            
            # rank products according to scores 
            if score == 3:
                eye["high_score"].append(row)
            elif score == 2:
                eye["mid_score"].append(row)
            elif score == 1:
                eye["low_score"].append(row)

        #initiate product count
        count = 0

        #loop through cleanser list and save products with the highest scores to the db
        #if less than 4 products saved to db, continue to loop through each cat until 4 products are saved 
        if eye["high_score"]: 
            for row in eye["high_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        if count < 4 and eye["mid_score"]: 
            for row in eye["mid_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break

        if count < 4 and eye["low_score"]: 
            for row in eye["low_score"]:
                if count < 4: 
                    UserProduct.objects.create(user=request.user, product=row)
                    count += 1
                else:
                    break
    
        #if acne is the concern only loop thro micellar water list
        if "acne" in profile.skin_concern:
            for row in micellar_water_list:
                if profile.pregnant and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if profile.skintype in row.skintypes: 
                    score += 1
                if any(item in row.product_target for item in profile.skin_concern):
                    score += 1
                if "all skin types" in row.skintypes:
                    score += 1
                
                # rank products according to scores 
                if score == 3:
                    micellar_water["high_score"].append(row)
                elif score == 2:
                    micellar_water["mid_score"].append(row)
                elif score == 1:
                    micellar_water["low_score"].append(row)

            #initiate product count
            count = 0

            #loop through cleanser list and save products with the highest scores to the db
            #if less than 4 products saved to db, continue to loop through each cat until 4 products are saved 
            if micellar_water["high_score"]: 
                for row in micellar_water["high_score"]:
                    if count < 4: 
                        UserProduct.objects.create(user=request.user, product=row)
                        count += 1
                    else:
                        break

            if count < 4 and micellar_water["mid_score"]: 
                for row in micellar_water["mid_score"]:
                    if count < 4: 
                        UserProduct.objects.create(user=request.user, product=row)
                        count += 1
                    else:
                        break

            if count < 4 and micellar_water["low_score"]: 
                for row in micellar_water["low_score"]:
                    if count < 4: 
                        UserProduct.objects.create(user=request.user, product=row)
                        count += 1
                    else:
                        break
        else: 
            for row in oil_cleanser_list:
                if profile.pregnant and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if profile.skintype in row.skintypes: 
                    score += 1
                if any(item in row.product_target for item in profile.skin_concern):
                    score += 1
                if "all skin types" in row.skintypes:
                    score += 1
                
                # rank products according to scores 
                if score == 3:
                    oil_cleanser["high_score"].append(row)
                elif score == 2:
                    oil_cleanser["mid_score"].append(row)
                elif score == 1:
                    oil_cleanser["low_score"].append(row)

            #initiate product count
            count = 0

            #loop through cleanser list and save products with the highest scores to the db
            #if less than 4 products saved to db, continue to loop through each cat until 4 products are saved 
            if oil_cleanser["high_score"]: 
                for row in oil_cleanser["high_score"]:
                    if count < 4: 
                        UserProduct.objects.create(user=request.user, product=row)
                        count += 1
                    else:
                        break

            if count < 4 and oil_cleanser["mid_score"]: 
                for row in oil_cleanser["mid_score"]:
                    if count < 4: 
                        UserProduct.objects.create(user=request.user, product=row)
                        count += 1
                    else:
                        break

            if count < 4 and oil_cleanser["low_score"]: 
                for row in oil_cleanser["low_score"]:
                    if count < 4: 
                        UserProduct.objects.create(user=request.user, product=row)
                        count += 1
                    else:
                        break
                
        #query img objects
        get_img_obj = user.image_profile.order_by("-datetime").all()

        #query products rec from db after filter and saving from above
        get_product_recs = UserProduct.objects.filter(user=request.user)
        product_recs_dict = UserProductSerializer(get_product_recs, many=True)

        #query user's skin profile
        skin_profile = UserProfile.objects.get(user=request.user)
        user_skin_profile = ProfileSerializer(skin_profile)
        
        if get_img_obj: 
            images = ImageSerializer(get_img_obj, many=True)
            return Response ({"message": "success", "image": images.data, "product_recs": product_recs_dict.data, "user_skin_profile": user_skin_profile}, status=status.HTTP_200_OK)
        else:
            return Response ({"message": "success", "image": None, "product_recs" : product_recs_dict.data, "user_skin_profile": user_skin_profile}, status=status.HTTP_200_OK)
    
    #if USER IS NOT LOGGED IN
    else:
        #reset count before looping through every product list
        count = 0
        for row in cleanser_list:
            if user_pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #if less than 4 products are saved in the dict
            if count < 4: 
                #for every criteria met, plus 1 to score
                if user_skintype in row.skintypes: 
                    score += 1
                if any(item in row.product_target for item in user_skinconcern):
                    score += 1
                if "all skin types" in row.skintypes:
                    score += 1

                #build a product dict 
                add_product = {
                    "product_name": row.product_name, 
                    "product_brand": row.product_brand, 
                    "product_category": row.product_cat, 
                    "product_price": row.product_price, 
                    "product_link": row.product_link, 
                    "product_img": row.product_img.url, 
                    "product_target": row.product_target,
                    "product_des": row.product_des,
                    }

                # rank and append products according to scores 
                if score == 3:
                    cleanser["high_score"].append(add_product)
                elif score == 2:
                    cleanser["mid_score"].append(add_product)
                elif score == 1:
                    cleanser["low_score"].append(add_product)
                
                #increase count 
                count += 1
            else:
                break

        #reset count before looping through every product list
        count = 0
        for row in toner_list: 
            if user_pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #if less than 4 products are saved in the dict
            if count < 4: 
                #for every criteria met, plus 1 to score
                if user_skintype in row.skintypes: 
                    score += 1
                if any(item in row.product_target for item in user_skinconcern):
                    score += 1
                if "all skin types" in row.skintypes:
                    score += 1

                #build a product dict 
                add_product = {
                    "product_name": row.product_name, 
                    "product_brand": row.product_brand, 
                    "product_category": row.product_cat, 
                    "product_price": row.product_price, 
                    "product_link": row.product_link, 
                    "product_img": row.product_img.url, 
                    "product_target": row.product_target,
                    "product_des": row.product_des,
                    }

                # rank and append products according to scores 
                if score == 3:
                    toner["high_score"].append(add_product)
                elif score == 2:
                    toner["mid_score"].append(add_product)
                elif score == 1:
                    toner["low_score"].append(add_product)
                
                #increase count 
                count += 1
            else:
                break

        #reset count before looping through every product list
        count = 0
        for row in serum_list: 
            if user_pregnant and "avoid pregnancy" in row.product_target:
                continue
            #reset score for every product
            score = 0

            #if less than 4 products are saved in the dict
            if count < 4: 
                #for every criteria met, plus 1 to score
                if user_skintype in row.skintypes: 
                    score += 1
                if any(item in row.product_target for item in user_skinconcern):
                    score += 1
                if "all skin types" in row.skintypes:
                    score += 1

                #build a product dict 
                add_product = {
                    "product_name": row.product_name, 
                    "product_brand": row.product_brand, 
                    "product_category": row.product_cat, 
                    "product_price": row.product_price, 
                    "product_link": row.product_link, 
                    "product_img": row.product_img.url, 
                    "product_target": row.product_target,
                    "product_des": row.product_des,
                    }

                # rank and append products according to scores 
                if score == 3:
                    serum["high_score"].append(add_product)
                elif score == 2:
                    serum["mid_score"].append(add_product)
                elif score == 1:
                    serum["low_score"].append(add_product)
                #increase count 
                count += 1

            else:
                break

            
        #reset count before looping through every product list
        count = 0
        for row in moisturiser_list: 
            if user_pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #if less than 4 products are saved in the dict
            if count < 4: 
                #for every criteria met, plus 1 to score
                if user_skintype in row.skintypes: 
                    score += 1
                if any(item in row.product_target for item in user_skinconcern):
                    score += 1
                if "all skin types" in row.skintypes:
                    score += 1

                #build a product dict 
                add_product = {
                    "product_name": row.product_name, 
                    "product_brand": row.product_brand, 
                    "product_category": row.product_cat, 
                    "product_price": row.product_price, 
                    "product_link": row.product_link, 
                    "product_img": row.product_img.url, 
                    "product_target": row.product_target,
                    "product_des": row.product_des,
                    }

                # rank and append products according to scores 
                if score == 3:
                    moisturiser["high_score"].append(add_product)
                elif score == 2:
                    moisturiser["mid_score"].append(add_product)
                elif score == 1:
                    moisturiser["low_score"].append(add_product)

                #increase count 
                count += 1
            else:
                break
        
        #reset count before looping through every product list
        count = 0
        if "acne" in user_skinconcern or "sensitive" in user_skinconcern:
            for row in physical_sunscreen_list: 
                if user_pregnant and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #if less than 4 products are saved in the dict
                if count < 4: 
                    #for every criteria met, plus 1 to score
                    if user_skintype in row.skintypes: 
                        score += 1
                    if any(item in row.product_target for item in user_skinconcern):
                        score += 1
                    if "all skin types" in row.skintypes:
                        score += 1

                    #build a product dict 
                    add_product = {
                        "product_name": row.product_name, 
                        "product_brand": row.product_brand, 
                        "product_category": row.product_cat, 
                        "product_price": row.product_price, 
                        "product_link": row.product_link, 
                        "product_img": row.product_img.url, 
                        "product_target": row.product_target,
                        "product_des": row.product_des,
                        }

                    # rank and append products according to scores 
                    if score == 3:
                        sunscreen["high_score"].append(add_product)
                    elif score == 2:
                        sunscreen["mid_score"].append(add_product)
                    elif score == 1:
                        sunscreen["low_score"].append(add_product)
                    
                    #increase count 
                    count += 1
                
                else:
                    break

        else:
            for row in chemical_sunscreen_list: 
                if user_pregnant and "avoid pregnancy" in row.product_target:
                    continue

                 #reset score for every product
                score = 0

                #if less than 4 products are saved in the dict
                if count < 4: 
                    #for every criteria met, plus 1 to score
                    if user_skintype in row.skintypes: 
                        score += 1
                    if any(item in row.product_target for item in user_skinconcern):
                        score += 1
                    if "all skin types" in row.skintypes:
                        score += 1

                    #build a product dict 
                    add_product = {
                        "product_name": row.product_name, 
                        "product_brand": row.product_brand, 
                        "product_category": row.product_cat, 
                        "product_price": row.product_price, 
                        "product_link": row.product_link, 
                        "product_img": row.product_img.url, 
                        "product_target": row.product_target,
                        "product_des": row.product_des,
                        }

                    # rank and append products according to scores 
                    if score == 3:
                        sunscreen["high_score"].append(add_product)
                    elif score == 2:
                        sunscreen["mid_score"].append(add_product)
                    elif score == 1:
                        sunscreen["low_score"].append(add_product)
                    
                    #increase count 
                    count += 1
                
                else:
                    break
        
        #reset count before looping through every product list
        count = 0
        for row in eye_list: 
            if user_pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #if less than 4 products are saved in the dict
            if count < 4: 
                #for every criteria met, plus 1 to score
                if user_skintype in row.skintypes: 
                    score += 1
                if any(item in row.product_target for item in user_skinconcern):
                    score += 1
                if "all skin types" in row.skintypes:
                    score += 1

                #build a product dict 
                add_product = {
                    "product_name": row.product_name, 
                    "product_brand": row.product_brand, 
                    "product_category": row.product_cat, 
                    "product_price": row.product_price, 
                    "product_link": row.product_link, 
                    "product_img": row.product_img.url, 
                    "product_target": row.product_target,
                    "product_des": row.product_des,
                    }

                # rank and append products according to scores 
                if score == 3:
                    eye["high_score"].append(add_product)
                elif score == 2:
                    eye["mid_score"].append(add_product)
                elif score == 1:
                    eye["low_score"].append(add_product)

                #increase count 
                count += 1

            else:
                break
        
        #reset count before looping through every product list
        count = 0
        if "acne" in user_skinconcern:
            for row in micellar_water_list:
                if user_pregnant and "avoid pregnancy" in row.product_target:
                    continue
                
                #reset score for every product
                score = 0

                #if less than 4 products are saved in the dict
                if count < 4: 
                    #for every criteria met, plus 1 to score
                    if user_skintype in row.skintypes: 
                        score += 1
                    if any(item in row.product_target for item in user_skinconcern):
                        score += 1
                    if "all skin types" in row.skintypes:
                        score += 1

                    #build a product dict 
                    add_product = {
                        "product_name": row.product_name, 
                        "product_brand": row.product_brand, 
                        "product_category": row.product_cat, 
                        "product_price": row.product_price, 
                        "product_link": row.product_link, 
                        "product_img": row.product_img.url, 
                        "product_target": row.product_target,
                        "product_des": row.product_des,
                        }

                    # rank and append products according to scores 
                    if score == 3:
                        micellar_water["high_score"].append(add_product)
                    elif score == 2:
                        micellar_water["mid_score"].append(add_product)
                    elif score == 1:
                        micellar_water["low_score"].append(add_product)
                    
                    #increase count 
                    count += 1

                else:
                    break
        else: 
            for row in oil_cleanser_list:
                if user_pregnant and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #if less than 4 products are saved in the dict
                if count < 4: 
                    #for every criteria met, plus 1 to score
                    if user_skintype in row.skintypes: 
                        score += 1
                    if any(item in row.product_target for item in user_skinconcern):
                        score += 1
                    if "all skin types" in row.skintypes:
                        score += 1

                    #build a product dict 
                    add_product = {
                        "product_name": row.product_name, 
                        "product_brand": row.product_brand, 
                        "product_category": row.product_cat, 
                        "product_price": row.product_price, 
                        "product_link": row.product_link, 
                        "product_img": row.product_img.url, 
                        "product_target": row.product_target,
                        "product_des": row.product_des,
                        }

                    # rank and append products according to scores 
                    if score == 3:
                        oil_cleanser["high_score"].append(add_product)
                    elif score == 2:
                        oil_cleanser["mid_score"].append(add_product)
                    elif score == 1:
                        oil_cleanser["low_score"].append(add_product)
                    
                    #increase count 
                    count += 1
                
                else:
                    break  
        
        #create dict to store user's skin profile 
        skin_profile = {"username": "", "skin_concern": []}

        skin_profile["username"] = user_name
        skin_profile["skin_concern"] = user_skinconcern

        print(f"skin concern: {skin_profile["skin_concern"]}")

                
        if img_file: 
            return Response({"message": "success", "image": img_file, "cleanser": cleanser, "toner": toner, "serum": serum, "moisturiser": moisturiser, "sunscreen": sunscreen, "eye": eye, "cleansing_oil": oil_cleanser, "micellar_water": micellar_water, "user_skin_profile": skin_profile}, status = status.HTTP_200_OK)
        else: 
            return Response ({"message": "success", "image": img_file, "cleanser": cleanser, "toner": toner, "serum": serum, "moisturiser": moisturiser, "sunscreen": sunscreen, "eye": eye, "cleansing_oil": oil_cleanser, "micellar_water": micellar_water, "user_skin_profile": skin_profile}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getImage(request):
    user = request.user.info
    user_photo = user.image_profile
    image_dict = ImageSerializer(user_photo)
    info_dict = ProfileSerializer(user)
    get_product_recs = UserProduct.objects.filter(user=request.user)
    product_recs_dict = UserProductSerializer(get_product_recs, many=True)
    
    return Response({"message": "success", "image": image_dict.data, "skininfo": info_dict, "product_recs": product_recs_dict.data}, status=status.HTTP_200_OK)









    





        



        
    
          