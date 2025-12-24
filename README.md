# Skincare Regimen Builder
A full-stack app that recommends skincare products based on your skin profile. 
** Note: This project runs locally. Deployment is in progress

## Demo 
Main Page
<img width="1719" height="958" alt="Screenshot 2025-12-24 at 4 15 10 pm" src="https://github.com/user-attachments/assets/5c378f25-323b-436f-9724-28996d74921f" />

Survey
<img width="1728" height="964" alt="Screenshot 2025-12-24 at 4 22 44 pm" src="https://github.com/user-attachments/assets/be64e091-a45a-4e55-ae2a-c57298809ee6" />

<img width="1726" height="962" alt="Screenshot 2025-12-24 at 4 16 11 pm" src="https://github.com/user-attachments/assets/8a4cd573-bac4-4b65-8c8b-63be80e0d89d" />

Recommendation Page
<img width="1725" height="962" alt="Screenshot 2025-12-24 at 4 16 22 pm" src="https://github.com/user-attachments/assets/0349bf9a-3b7e-4c3e-9578-310427f95921" />

<img width="1723" height="962" alt="Screenshot 2025-12-24 at 4 16 31 pm" src="https://github.com/user-attachments/assets/91b39de8-408d-43fd-868f-2f2c1865809e" />

AI Chatbot
<img width="1705" height="946" alt="Screenshot 2025-12-24 at 4 17 27 pm" src="https://github.com/user-attachments/assets/5ce90515-0144-4ed1-b41a-7c62b754cc0f" />


## Core Functionality
13-Stage Interactive Survey: Comprehensive questionnaire to understand user's skin needs.
Personalised Recommendations based on:
  - Skin type
  - Skin concerns
  - Eye concerns
  - Pregnancy status
  - Current skincare routine level
  - Active ingredient usage

Scoring Algorithm: Products scored based on skin type match and concern targeting.

Price-Based Categorization: Products organised into low (<$40), mid ($40-80), and high (>$80) price ranges.

## User Features
User Authentication: Secure login/signup system
Session Management: Recommendations saved for non-authenticated users via sessions
AI Chatbot: Integrated Claude API for personalised skincare advice
Product Database: Web-scraped products from multiple websites with detailed information

## Technical Features
RESTful API: Django REST Framework backend
Web Scraping: Automated product data collection using BeautifulSoup
Conditional Survey Flow: Dynamic question branching based on user responses

## Tech Stack

## Backend
Django 4.2 - Web framework
Django REST Framework - API development
SQLite - Database
BeautifulSoup4 - Web scraping
Anthropic Claude API - AI chatbot integration
python-dotenv - Environment variable management

## Frontend
React - UI framework
CSS3 - Custom styling
Fetch API- HTTP requests


## Database Models

### Products
- Product name, brand, category
- Main ingredients
- Target concerns
- Compatible skin types
- Price, image URL, product link
- Usage time (AM/PM)

### UserProfile
- User information
- Skin type and concerns
- Eye concerns
- Pregnancy status
- Current routine details
- Active ingredient preferences

### UserProduct
- Links users to recommended products
- Stores product categories for user's routine

### UserImage
- Stores user-uploaded skin photos

## Key Features Implementation

## Recommendation Algorithm
The algorithm scores products based on:
1. **Skin Type Match** (+1 point)
2. **Concern Targeting** (+1 point per matching concern)
3. **Pregnancy Safety** (excludes products with "avoid pregnancy" flag)


## AI Chatbot 
Uses Anthropic's Claude API to provide personalised skincare advice:
- Context-aware responses based on user profile
- Product recommendations
- Skincare routine guidance

## Common Issues 
Issue: API requests fail with CORS error **
Solution: Ensure `django-cors-headers` is installed and configured in `settings.py`

Issue: Products not appearing in recommendations **
Solution: Check that product data matches expected format (skin types, concerns)

Issue: Session not persisting for non-authenticated users **
Solution: Verify `SESSION_COOKIE_HTTPONLY` and CORS credentials settings

