from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.ai.translation_service import TranslationService

router = APIRouter()
translation_service = TranslationService()

class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class TranslationResponse(BaseModel):
    translated_text: str
    confidence: str
    source: str

@router.post("/", response_model=TranslationResponse)
async def translate_text(req: TranslationRequest):
    if req.source_lang == "hi" and req.target_lang == "sat":
        result = translation_service.translate_hindi_to_santali(req.text)
        return TranslationResponse(**result)
    elif req.source_lang == "sat" and req.target_lang == "hi":
        result = translation_service.translate_santali_to_hindi(req.text)
        return TranslationResponse(**result)
    else:
        raise HTTPException(status_code=400, detail="Language pair not supported for translation")
