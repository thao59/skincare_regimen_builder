from anthropic import Anthropic 
from django.conf import settings 

class ClaudeService:
    def __init__ (self):
        self.client = Anthropic(api_key = settings.ANTHROPIC_API_KEY)
        self.model = "claude-sonnet-4-20250514"

    def get_response(self, user_message):
        response = self.client.messages.create (
            model=self.model, 
            max_tokens = 1000, 
            messages = [
                {"role": "user", "content": user_message}
            ]
        )
        return response.content[0].text
    
    def get_personalised_response(self, user_message, user_context):
        prompt = f"""You are a skincare expert. Provide personalised advice based on user's profile.
        User's profile: {user_context}
        When answering questions: 
        - Taking their skin type/concerns into account 
        - Explain the reasons behind recommend these products 
        - Be concise, short and informative """
        response = self.client.messages.create(
            model = self.model, 
            max_tokens = 1000, 
            system = prompt, 
            messages = [{"role": "user", "content": user_message}]
        )
        return response.content[0].text