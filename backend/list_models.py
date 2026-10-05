import google.generativeai as genai
from core.config import settings

genai.configure(api_key=settings.AI_API_KEY)
for m in genai.list_models():
    if 'embedContent' in m.supported_generation_methods:
        print(m.name)
