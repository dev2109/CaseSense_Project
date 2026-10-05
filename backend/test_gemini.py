import google.generativeai as genai
from core.config import settings

genai.configure(api_key=settings.AI_API_KEY)
llm_model = genai.GenerativeModel('models/gemini-2.5-flash')

try:
    response = llm_model.generate_content(
        "Answer in JSON: {'answer': 'hello'}",
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
        )
    )
    print("Response:")
    print(response.text)
except Exception as e:
    import traceback
    traceback.print_exc()
