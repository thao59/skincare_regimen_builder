from anthropic import Anthropic 
from django.conf import settings 
from .models import Products, UserProduct
from .serializers import UserProductSerializer

class ClaudeService:
    def __init__ (self):
        self.client = Anthropic(api_key = settings.ANTHROPIC_API_KEY)
        self.model = "claude-sonnet-4-20250514"

    def get_response(self, user_message):
        prompt = f"""You are a skincare expert. Be concise, short, and informative when answering user's question regarding skincare needs"""
        response = self.client.messages.create (
            model=self.model, 
            max_tokens = 1000, 
            system = prompt,
            messages = [
                {"role": "user", "content": user_message}
            ]
        )
        return response.content[0].text
    
    def get_personalised_response(self, user_message, user_profile, user_product_rec):
        if user_profile["no_products"] == 3:
            instruction = "Only recommend cleanser, moisturiser and sunscreen"
        elif user_profile["no_products"] == 5:
            instruction = "Recommend any products except toner products and eye products"
        else:
            instruction = "Recommend all products"

        prompt = f"""You are a skincare expert. Provide personalised advice based on user's profile.
        {instruction}
        User's profile: {user_profile}
        User's product recommendation: {user_product_rec}
        Only answer question when asked. Be short all the time
        When answering questions: 
        - Use Australian spelling 
        - Taking their skin profile and product recommendation into account 
        - Explain the reasons behind recommend these products 
        - Be concise, short and informative """
        response = self.client.messages.create(
            model = self.model, 
            max_tokens = 1000, 
            system = prompt, 
            messages = [{"role": "user", "content": user_message}]
        )
        return response.content[0].text
    
class Recommendation: 
    def __init__ (self):
        self.cleanser_list = Products.objects.filter(product_cat = "cleanser")
        self.toner_list = Products.objects.filter(product_cat = "toner")
        self.serum_list = Products.objects.filter(product_cat = "serum")
        self.moisturiser_list = Products.objects.filter(product_cat = "moisturiser")
        self.physical_sunscreen_list = Products.objects.filter(product_cat = "physical sunscreen")
        self.chemical_sunscreen_list = Products.objects.filter(product_cat = "chemical sunscreen")
        self.eye_list = Products.objects.filter(product_cat = "eye")
        self.oil_cleanser_list = Products.objects.filter(product_cat="oil cleanser")
        self.micellar_water_list = Products.objects.filter(product_cat = "micellar water")

        self.cleanser = {"high_score": [], "mid_score": []}
        self.toner = {"high_score": [], "mid_score": []}
        self.serum = {"high_score": [], "mid_score": []}
        self.moisturiser = {"high_score": [], "mid_score": []}
        self.sunscreen = {"high_score": [], "mid_score": []}
        self.eye = {"high_score": [], "mid_score": []}
        self.oil_cleanser = {"high_score": [], "mid_score": []}
        self.micellar_water = {"high_score": [], "mid_score": []}

    def get_login_rec (self, user, user_profile): 
        
        #loop through the list and append those catering to user's skin concern
        for row in self.cleanser_list:
            # if user is pregnant and product is marked avoid pregnancy then skip that product
            if user_profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if user_profile.skintype in row.skintypes: 
                score += 1
            score += sum(1 for item in user_profile.skin_concern if item in row.product_target)
            print(f"score: {score}")
            print(f"product: {row.product_name}")

            # rank products according to scores 
            if score == 2:
                self.cleanser["high_score"].append(row)
            elif score == 1:
                self.cleanser["mid_score"].append(row)

        #initiate product count
        count = 0

        #loop through cleanser list and save products with the highest scores to the db
        #if less than 3 products saved to db, continue to loop through each cat until 4 products are saved 
        if self.cleanser["high_score"]: 
            for row in self.cleanser["high_score"]:
                if count < 3: 
                    UserProduct.objects.create(user=user, product=row)
                    count += 1
                else:
                    break

        if count < 3 and self.cleanser["mid_score"]: 
            for row in self.cleanser["mid_score"]:
                if count < 3: 
                    UserProduct.objects.create(user=user, product=row)
                    count += 1
                else:
                    break

        for row in self.toner_list: 
            # if user is pregnant and product is marked avoid pregnancy then skip that product
            if user_profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if user_profile.skintype in row.skintypes: 
                score += 1
            score += sum(1 for item in user_profile.skin_concern if item in row.product_target)
            print(f"score: {score}")
            print(f"product: {row.product_name}")
            
            # rank products according to scores 
            if score == 2:
                self.toner["high_score"].append(row)
            elif score == 1:
                self.toner["mid_score"].append(row)

        #initiate product count
        count = 0

        #loop through cleanser list and save products with the highest scores to the db
        #if less than 3 products saved to db, continue to loop through each cat until 4 products are saved 
        if self.toner["high_score"]: 
            for row in self.toner["high_score"]:
                if count < 3: 
                    UserProduct.objects.create(user=user, product=row)
                    count += 1

        if count < 3 and self.toner["mid_score"]: 
            for row in self.toner["mid_score"]:
                if count < 3: 
                    UserProduct.objects.create(user=user, product=row)
                    count += 1

        for row in self.serum_list: 
            # if user is pregnant and product is marked avoid pregnancy then skip that product
            if user_profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if user_profile.skintype in row.skintypes: 
                score += 1
            score += sum(1 for item in user_profile.skin_concern if item in row.product_target)
            print(f"score: {score}")
            print(f"product: {row.product_name}")
            
            # rank products according to scores 
            if score == 2:
                self.serum["high_score"].append(row)
            elif score == 1:
                self.serum["mid_score"].append(row)

        #initiate product count
        count = 0

        #loop through cleanser list and save products with the highest scores to the db
        #if less than 3 products saved to db, continue to loop through each cat until 4 products are saved 
        if self.serum["high_score"]: 
            for row in self.serum["high_score"]:
                if count < 3: 
                    UserProduct.objects.create(user=user, product=row)
                    count += 1

        if count < 3 and self.serum["mid_score"]: 
            for row in self.serum["mid_score"]:
                if count < 3: 
                    UserProduct.objects.create(user=user, product=row)
                    count += 1

        for row in self.moisturiser_list: 
            # if user is pregnant and product is marked avoid pregnancy then skip that product
            if user_profile.pregnant and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if user_profile.skintype in row.skintypes: 
                score += 1
            score += sum(1 for item in user_profile.skin_concern if item in row.product_target)
            print(f"score: {score}")
            print(f"product: {row.product_name}")
            
            # rank products according to scores 
            if score == 2:
                self.moisturiser["high_score"].append(row)
            elif score == 1:
                self.moisturiser["mid_score"].append(row)

        #initiate product count
        count = 0

        #loop through cleanser list and save products with the highest scores to the db
        #if less than 3 products saved to db, continue to loop through each cat until 4 products are saved 
        if self.moisturiser["high_score"]: 
            for row in self.moisturiser["high_score"]:
                if count <3: 
                    UserProduct.objects.create(user=user, product=row)
                    count += 1

        if count < 3 and self.moisturiser["mid_score"]: 
            for row in self.moisturiser["mid_score"]:
                if count < 3: 
                    UserProduct.objects.create(user=user, product=row)
                    count += 1

        #if acne is the concern, only loop through physcial sunscreen list
        if "acne" in user_profile.skin_concern or "sensitive" in user_profile.skin_concern:   
            for row in self.physical_sunscreen_list: 
                if user_profile.pregnant and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if user_profile.skintype in row.skintypes: 
                    score += 1
                score += sum(1 for item in user_profile.skin_concern if item in row.product_target)
                print(f"score: {score}")
                print(f"product: {row.product_name}")
                
                # rank products according to scores 
                if score == 2:
                    self.sunscreen["high_score"].append(row)
                elif score == 1:
                    self.sunscreen["mid_score"].append(row)

            #initiate product count
            count = 0

            #loop through cleanser list and save products with the highest scores to the db
            #if less than 3 products saved to db, continue to loop through each cat until 4 products are saved 
            if self.sunscreen["high_score"]: 
                for row in self.sunscreen["high_score"]:
                    if count < 3: 
                        UserProduct.objects.create(user=user, product=row)
                        count += 1

            if count < 3 and self.sunscreen["mid_score"]: 
                for row in self.sunscreen["mid_score"]:
                    if count < 3: 
                        UserProduct.objects.create(user=user, product=row)
                        count += 1
        else: 
            for row in self.chemical_sunscreen_list: 
                if user_profile.pregnant and "avoid pregnancy" in row.product_target:
                    continue  

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if user_profile.skintype in row.skintypes: 
                    score += 1
                score += sum(1 for item in user_profile.skin_concern if item in row.product_target)
                print(f"score: {score}")
                print(f"product: {row.product_name}")
                
                # rank products according to scores 
                if score == 2:
                    self.sunscreen["high_score"].append(row)
                elif score == 1:
                    self.sunscreen["mid_score"].append(row)

            #initiate product count
            count = 0

            #loop through cleanser list and save products with the highest scores to the db
            #if less than 3 products saved to db, continue to loop through each cat until 4 products are saved 
            if self.sunscreen["high_score"]: 
                for row in self.sunscreen["high_score"]:
                    if count < 3: 
                        UserProduct.objects.create(user=user, product=row)
                        count += 1

            if count < 3 and self.sunscreen["mid_score"]: 
                for row in self.sunscreen["mid_score"]:
                    if count < 3: 
                        UserProduct.objects.create(user=user, product=row)
                        count += 1

        if user_profile.eye_concern:
            for row in self.eye_list: 
                if user_profile.pregnant and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if any(item in row.product_target for item in user_profile.eye_concern):
                    score += 1
                score += sum(1 for item in user_profile.skin_concern if item in row.product_target)
                print(f"score: {score}")
                print(f"product: {row.product_name}")
                
                # rank products according to scores 
                if score == 2:
                    self.eye["high_score"].append(row)
                elif score == 1:
                    self.eye["mid_score"].append(row)

            #initiate product count
            count = 0

            #loop through cleanser list and save products with the highest scores to the db
            #if less than 3 products saved to db, continue to loop through each cat until 4 products are saved 
            if self.eye["high_score"]: 
                for row in self.eye["high_score"]:
                    if count < 3: 
                        UserProduct.objects.create(user=user, product=row)
                        count += 1

            if count < 3 and self.eye["mid_score"]: 
                for row in self.eye["mid_score"]:
                    if count < 3: 
                        UserProduct.objects.create(user=user, product=row)
                        count += 1
    
        #if acne is the concern only loop thro micellar water list
        if "acne" in user_profile.skin_concern:
            for row in self.micellar_water_list:
                if user_profile.pregnant and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if user_profile.skintype in row.skintypes: 
                    score += 1
                score += sum(1 for item in user_profile.skin_concern if item in row.product_target)
                print(f"score: {score}")
                print(f"product: {row.product_name}")
                
                # rank products according to scores 
                if score == 2:
                    self.micellar_water["high_score"].append(row)
                elif score == 1:
                    self.micellar_water["mid_score"].append(row)

            #initiate product count
            count = 0

            #loop through cleanser list and save products with the highest scores to the db
            #if less than 3 products saved to db, continue to loop through each cat until 4 products are saved 
            if self.micellar_water["high_score"]: 
                for row in self.micellar_water["high_score"]:
                    if count < 3: 
                        UserProduct.objects.create(user=user, product=row)
                        count += 1

            if count < 3 and self.micellar_water["mid_score"]: 
                for row in self.micellar_water["mid_score"]:
                    if count < 3: 
                        UserProduct.objects.create(user=user, product=row)
                        count += 1
        else: 
            for row in self.oil_cleanser_list:
                if user_profile.pregnant and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if user_profile.skintype in row.skintypes: 
                    score += 1
                score += sum(1 for item in user_profile.skin_concern if item in row.product_target)
                print(f"score: {score}")
                print(f"product: {row.product_name}")
                
                # rank products according to scores 
                if score == 2:
                    self.oil_cleanser["high_score"].append(row)
                elif score == 1:
                    self.oil_cleanser["mid_score"].append(row)

            #initiate product count
            count = 0

            #loop through cleanser list and save products with the highest scores to the db
            #if less than 3 products saved to db, continue to loop through each cat until 4 products are saved 
            if self.oil_cleanser["high_score"]: 
                for row in self.oil_cleanser["high_score"]:
                    if count < 3: 
                        UserProduct.objects.create(user=user, product=row)
                        count += 1

            if count < 3 and self.oil_cleanser["mid_score"]: 
                for row in self.oil_cleanser["mid_score"]:
                    if count < 3: 
                        UserProduct.objects.create(user=user, product=row)
                        count += 1

        get_product_recs = UserProduct.objects.filter(user=user)
        return UserProductSerializer(get_product_recs, many=True)
    
    def get_rec(self, user_profile):

        items= {"off_cleanser": [], "off_toner": [], "off_serum": [], "off_moisturiser": [], "off_sunscreen": [], "off_eye": [], "off_oil_cleanser": [], "off_micellar_water": []}

        for row in self.cleanser_list:
            if user_profile["pregnant"] and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if user_profile["skintype"] in row.skintypes: 
                score += 1
            score += sum(1 for item in user_profile["skin_concern"] if item in row.product_target)
            print(f"score: {score}")
            print(f"product: {row.product_name}")
            
            #build a product dict 
            add_product = {
                "product_name": row.product_name, 
                "product_brand": row.product_brand, 
                "product_category": row.product_cat, 
                "product_price": row.product_price, 
                "product_link": row.product_link, 
                "product_img": row.product_img.url, 
                "product_target": row.product_target,
                "skintypes" : row.skintypes,
                "product_des": row.product_des,
                "product_time" : row.product_time,
                }

            # rank and append products according to scores 
            if score == 2:
                self.cleanser["high_score"].append(add_product)
            elif score == 1:
                self.cleanser["mid_score"].append(add_product)
            
        count = 0

        #loop from high to low score products and append max 3 to new list
        if self.cleanser["high_score"]:
            for row in self.cleanser["high_score"]:
                if count < 3:
                    items["off_cleanser"].append(row)
                    count += 1
        
        if count < 3 and self.cleanser["mid_score"]:
            for row in self.cleanser["mid_score"]:
                if count < 3:
                    items["off_cleanser"].append(row)
                    count += 1

        for row in self.toner_list: 
            if user_profile["pregnant"] and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if user_profile["skintype"] in row.skintypes: 
                score += 1
            score += sum(1 for item in user_profile["skin_concern"] if item in row.product_target)
            print(f"score: {score}")
            print(f"product: {row.product_name}")

            #build a product dict 
            add_product = {
                "product_name": row.product_name, 
                "product_brand": row.product_brand, 
                "product_category": row.product_cat, 
                "product_price": row.product_price, 
                "product_link": row.product_link, 
                "product_img": row.product_img.url, 
                "product_target": row.product_target,
                "skintypes" : row.skintypes,
                "product_des": row.product_des,
                "product_time" : row.product_time,
                }

            # rank and append products according to scores 
            if score == 2:
                self.toner["high_score"].append(add_product)
            elif score == 1:
                self.toner["mid_score"].append(add_product)
        
        count = 0
        if self.toner["high_score"]:
            for row in self.toner["high_score"]:
                if count < 3:
                    items["off_toner"].append(row)
                    count += 1
        
        if count < 3 and self.toner["mid_score"]:
            for row in self.toner["mid_score"]:
                if count < 3:
                    items["off_toner"].append(row)
                    count += 1

        for row in self.serum_list: 
            if user_profile["pregnant"] and "avoid pregnancy" in row.product_target:
                continue
            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if user_profile["skintype"] in row.skintypes: 
                score += 1
            score += sum(1 for item in user_profile["skin_concern"] if item in row.product_target)
            print(f"score: {score}")
            print(f"product: {row.product_name}")

            #build a product dict 
            add_product = {
                "product_name": row.product_name, 
                "product_brand": row.product_brand, 
                "product_category": row.product_cat, 
                "product_price": row.product_price, 
                "product_link": row.product_link, 
                "product_img": row.product_img.url, 
                "product_target": row.product_target,
                "skintypes" : row.skintypes,
                "product_des": row.product_des,
                "product_time" : row.product_time,
                }

            # rank and append products according to scores 
            if score == 2:
                self.serum["high_score"].append(add_product)
            elif score == 1:
                self.serum["mid_score"].append(add_product)

        count = 0    
        if self.serum["high_score"]:
            for row in self.serum["high_score"]:
                if count < 3:
                    items["off_serum"].append(row)
                    count += 1
        
        if count < 3 and self.serum["mid_score"]:
            for row in self.serum["mid_score"]:
                if count < 3:
                    items["off_serum"].append(row)
                    count += 1

        for row in self.moisturiser_list: 
            if user_profile["pregnant"] and "avoid pregnancy" in row.product_target:
                continue

            #reset score for every product
            score = 0

            #for every criteria met, plus 1 to score
            if user_profile["skintype"] in row.skintypes: 
                score += 1
            score += sum(1 for item in user_profile["skin_concern"] if item in row.product_target)
            print(f"score: {score}")
            print(f"product: {row.product_name}")

            #build a product dict 
            add_product = {
                "product_name": row.product_name, 
                "product_brand": row.product_brand, 
                "product_category": row.product_cat, 
                "product_price": row.product_price, 
                "product_link": row.product_link, 
                "product_img": row.product_img.url, 
                "product_target": row.product_target,
                "skintypes" : row.skintypes,
                "product_des": row.product_des,
                "product_time" : row.product_time,
                }

            # rank and append products according to scores 
            if score == 2:
                self.moisturiser["high_score"].append(add_product)
            elif score == 1:
                self.moisturiser["mid_score"].append(add_product)
        
        count = 0
        if self.moisturiser["high_score"]:
            for row in self.moisturiser["high_score"]:
                if count < 3:
                    items["off_moisturiser"].append(row)
                    count += 1
        
        if count < 3 and self.moisturiser["mid_score"]:
            for row in self.moisturiser["mid_score"]:
                if count < 3:
                    items["off_moisturiser"].append(row)
                    count += 1

        if "acne" in user_profile["skin_concern"] or "sensitive" in user_profile["skin_concern"]:
            for row in self.physical_sunscreen_list: 
                if user_profile["pregnant"] and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if user_profile["skintype"] in row.skintypes: 
                    score += 1
                score += sum(1 for item in user_profile["skin_concern"] if item in row.product_target)
                print(f"score: {score}")
                print(f"product: {row.product_name}")

                #build a product dict 
                add_product = {
                    "product_name": row.product_name, 
                    "product_brand": row.product_brand, 
                    "product_category": row.product_cat, 
                    "product_price": row.product_price, 
                    "product_link": row.product_link, 
                    "product_img": row.product_img.url, 
                    "product_target": row.product_target,
                    "skintypes" : row.skintypes,
                    "product_des": row.product_des,
                    "product_time" : row.product_time,
                    }

                # rank and append products according to scores 
                if score == 2:
                    self.sunscreen["high_score"].append(add_product)
                elif score == 1:
                    self.sunscreen["mid_score"].append(add_product)
            
            count = 0          
            if self.sunscreen["high_score"]:
                for row in self.sunscreen["high_score"]:
                    if count < 3:
                        items["off_sunscreen"].append(row)
                        count += 1
            
            if count < 3 and self.sunscreen["mid_score"]:
                for row in self.sunscreen["mid_score"]:
                    if count < 3:
                        items["off_sunscreen"].append(row)
                        count += 1
        else:
            for row in self.chemical_sunscreen_list: 
                if user_profile["pregnant"] and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if user_profile["skintype"] in row.skintypes: 
                    score += 1
                score += sum(1 for item in user_profile["skin_concern"] if item in row.product_target)
                print(f"score: {score}")
                print(f"product: {row.product_name}")

                #build a product dict 
                add_product = {
                    "product_name": row.product_name, 
                    "product_brand": row.product_brand, 
                    "product_category": row.product_cat, 
                    "product_price": row.product_price, 
                    "product_link": row.product_link, 
                    "product_img": row.product_img.url, 
                    "product_target": row.product_target,
                    "skintypes" : row.skintypes,
                    "product_des": row.product_des,
                    "product_time" : row.product_time,
                    }

                # rank and append products according to scores 
                if score == 2:
                    self.sunscreen["high_score"].append(add_product)
                elif score == 1:
                    self.sunscreen["mid_score"].append(add_product)
            
            count = 0      
            if self.sunscreen["high_score"]:
                for row in self.sunscreen["high_score"]:
                    if count < 3:
                        items["off_sunscreen"].append(row)
                        count += 1
            
            if count < 3 and self.sunscreen["mid_score"]:
                for row in self.sunscreen["mid_score"]:
                    if count < 3:
                        items["off_sunscreen"].append(row)
                        count += 1

        #check if there's any eye concern 
        if user_profile["eye_concern"]:
            for row in self.eye_list: 
                if user_profile["pregnant"] and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if user_profile["skintype"] in row.skintypes: 
                    score += 1
                score += sum(1 for item in user_profile["skin_concern"] if item in row.product_target)
                print(f"score: {score}")
                print(f"product: {row.product_name}")

                #build a product dict 
                add_product = {
                    "product_name": row.product_name, 
                    "product_brand": row.product_brand, 
                    "product_category": row.product_cat, 
                    "product_price": row.product_price, 
                    "product_link": row.product_link, 
                    "product_img": row.product_img.url, 
                    "product_target": row.product_target,
                    "skintypes" : row.skintypes,
                    "product_des": row.product_des,
                    "product_time" : row.product_time,
                    }

                # rank and append products according to scores 
                if score == 2:
                    self.eye["high_score"].append(add_product)
                elif score == 1:
                    self.eye["mid_score"].append(add_product)
            
            count = 0     
            if self.eye["high_score"]:
                for row in self.eye["high_score"]:
                    if count < 3:
                        items["off_eye"].append(row)
                        count += 1
            
            if count < 3 and self.eye["mid_score"]:
                for row in self.eye["mid_score"]:
                    if count < 3:
                        items["off_eye"].append(row)
                        count += 1

        if "acne" in user_profile["skin_concern"]:
            for row in self.micellar_water_list:
                if user_profile["pregnant"] and "avoid pregnancy" in row.product_target:
                    continue
                
                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if user_profile["skintype"] in row.skintypes: 
                    score += 1
                score += sum(1 for item in user_profile["skin_concern"] if item in row.product_target)
                print(f"score: {score}")
                print(f"product: {row.product_name}")

                #build a product dict 
                add_product = {
                    "product_name": row.product_name, 
                    "product_brand": row.product_brand, 
                    "product_category": row.product_cat, 
                    "product_price": row.product_price, 
                    "product_link": row.product_link, 
                    "product_img": row.product_img.url, 
                    "product_target": row.product_target,
                    "skintypes" : row.skintypes,
                    "product_des": row.product_des,
                    "product_time" : row.product_time,
                    }

                # rank and append products according to scores 
                if score == 2:
                    self.micellar_water["high_score"].append(add_product)
                elif score == 1:
                    self.micellar_water["mid_score"].append(add_product)
            
            count = 0
            if self.micellar_water["high_score"]:
                for row in self.micellar_water["high_score"]:
                    if count < 3:
                        items["off_micellar_water"].append(row)
                        count += 1
            
            if count < 3 and self.micellar_water["mid_score"]:
                for row in self.micellar_water["mid_score"]:
                    if count < 3:
                        items["off_micellar_water"].append(row)
                        count += 1
        else: 
            for row in self.oil_cleanser_list:
                if user_profile["pregnant"] and "avoid pregnancy" in row.product_target:
                    continue

                #reset score for every product
                score = 0

                #for every criteria met, plus 1 to score
                if user_profile["skintype"] in row.skintypes: 
                    score += 1
                score += sum(1 for item in user_profile["skin_concern"] if item in row.product_target)
                print(f"score: {score}")
                print(f"product: {row.product_name}")

                #build a product dict 
                add_product = {
                    "product_name": row.product_name, 
                    "product_brand": row.product_brand, 
                    "product_category": row.product_cat, 
                    "product_price": row.product_price, 
                    "product_link": row.product_link, 
                    "product_img": row.product_img.url, 
                    "product_target": row.product_target,
                    "skintypes" : row.skintypes,
                    "product_des": row.product_des,
                    "product_time" : row.product_time,
                    }

                # rank and append products according to scores 
                if score == 2:
                    self.oil_cleanser["high_score"].append(add_product)
                elif score == 1:
                    self.oil_cleanser["mid_score"].append(add_product)
            
            count = 0    
            if self.oil_cleanser["high_score"]:
                for row in self.oil_cleanser["high_score"]:
                    if count < 3:
                        items["off_oil_cleanser"].append(row)
                        count += 1
            
            if count < 3 and self.oil_cleanser["mid_score"]:
                for row in self.oil_cleanser["mid_score"]:
                    if count < 3:
                        items["off_oil_cleanser"].append(row)
                        count += 1
        return items



