from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes 
from rest_framework.permissions import IsAuthenticated 
from rest_framework.response import Response 
from ..models import UserProfile, UserProduct, UserImage
from rest_framework import status 
from ..serializers import ImageSerializer, ProfileSerializer, UserProductSerializer
from ..services import Recommendation

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

    #no check valid value for optional fields 
    user_eyeconcern = request.data["eye_concern"]
    user_products_type = request.data["products_type"]
    user_routine = request.data["routine"]
    user_active_use = request.data["active_use"]
    user_activeIngre = request.data["activeIngre"]
    user_advanced_use = request.data["advanced_user"]
    user_no_products = request.data["no_products"]

    get_image = None 

        #check if user uploads photo
    if "image_file" in request.FILES:
        get_image = request.FILES["image_file"]
    
        if not get_image: 
            return Response({"error": "image is failed to fetch"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            #ensure img < 5MB 
            if get_image.size > 5*1024*1024: 
                return Response({"error": "Image exceeds 5MB"}, status = status.HTTP_400_BAD_REQUEST)

    get_user = None
    get_image = None 

    if request.user.is_authenticated:
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
            
        if get_image: 
            try:
                save_image = UserImage.objects.create(userinfo = profile, image = get_image)
                print(f"Save image successfully: {save_image}")
            except Exception as e:
                print(f"Image saved unsuccessfully, error: {e}")
                return Response({"error": "Image saved unsuccessfully"})
        
        #detele the old recommendation and only saving the latest
        UserProduct.objects.filter(user = get_user).delete()

        get_rec = Recommendation()
        products_rec = get_rec.get_login_rec(get_user, profile) 
        user_skin_profile = ProfileSerializer(profile)
        return Response ({"product_recs" : products_rec.data, "user_skin_profile": user_skin_profile.data}, status=status.HTTP_200_OK)
    
    else: 
        #if USER IS NOT LOGGED IN
        user_profile = {"username": user_name, "age": user_age, "skintype": user_skintype, "skin_concern": user_skinconcern, "pregnant": user_pregnant, "eye_concern": user_eyeconcern, "products_type":  user_products_type, "routine": user_routine, "active_use": user_active_use, "active_ingre": user_activeIngre, "advanced_active_use": user_advanced_use, "no_products": user_no_products}
        
        #create temp id for user
        if not request.session.session_key:
            request.session.create()

        request.session["skinprofile"] = user_profile
        request.session.modified = True
        
        create = Recommendation()
        products_rec = create.get_rec(user_profile)

        #float all products'price before saving to session as JSON cant serialise decimals 
        for row in products_rec["off_cleanser"]:
            row["product_price"] = float(row["product_price"])
        
        for row in products_rec["off_toner"]:
            row["product_price"] = float(row["product_price"])
        
        for row in products_rec["off_serum"]:
            row["product_price"] = float(row["product_price"])

        for row in products_rec["off_moisturiser"]:
            row["product_price"] = float(row["product_price"])
        
        for row in products_rec["off_sunscreen"]:
            row["product_price"] = float(row["product_price"])
        
        for row in products_rec["off_eye"]:
            row["product_price"] = float(row["product_price"])
        
        for row in products_rec["off_oil_cleanser"]:
            row["product_price"] = float(row["product_price"])

        for row in products_rec["off_micellar_water"]:
            row["product_price"] = float(row["product_price"])

        request.session["product_rec"]= products_rec
        return Response ({"product_recs": products_rec, "user_skin_profile": user_profile}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getImage(request):
    user_info = None
    info_dict = None
    image_dict = None
    username = None
    product_recs_dict = None

    #get current user object
    user = request.user 
    username = user.username
    print(f"user object: {user}")
    try:
        user_info = user.info
        if user_info: 
            info_dict = ProfileSerializer(user_info)
            user_photo = user_info.image_profile.all()
            if user_photo.exists():
                image_dict = ImageSerializer(user_photo, many=True)
            else:
                print("No photo object")
        else: 
            print("No profile object")
    except Exception as e:
        print(f"error: {e}")

    try: 
        get_product_recs = UserProduct.objects.filter(user=user)
        if get_product_recs.exists(): 
            product_recs_dict = UserProductSerializer(get_product_recs, many=True)
        else: 
            print("There's no product recs")
    except Exception as e:
        print(f"error: {e}")
    
    if info_dict or image_dict or product_recs_dict:
        return Response({"image": image_dict.data if image_dict else [], "skininfo": info_dict.data if info_dict else {}, "product_recs": product_recs_dict.data if product_recs_dict else {}}, status=status.HTTP_200_OK)
    else:
        if username:
            return Response({"name": username}, status = status.HTTP_200_OK)
        else:
            return Response({"error": "No username saved"}, status=status.HTTP_400_BAD_REQUEST)