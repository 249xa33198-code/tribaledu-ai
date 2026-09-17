import os
import json
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class TranslationService:
    def __init__(self):
        self.hf_key = os.getenv("HUGGINGFACE_API_KEY")
        self.vocab = self._load_vocabulary()

    def _load_vocabulary(self):
        vocab_path = os.path.join(os.path.dirname(__file__), "../../../data/vocabulary.json")
        try:
            with open(vocab_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load vocabulary: {e}")
            return []

    def translate_hindi_to_santali(self, text: str) -> dict:
        """
        Translates Hindi to Santali.
        Uses a local verified fallback if HF API fails or is unavailable.
        """
        # Try local exact match first (as a safe fallback for the MVP)
        for item in self.vocab:
            if item.get("hindi", "").strip().lower() == text.strip().lower():
                return {
                    "translated_text": item.get("santali"),
                    "confidence": "Verified (Local Dataset)",
                    "source": "local"
                }

        # If HF API is configured, we would call it here.
        if self.hf_key and self.hf_key != "your_huggingface_key":
            try:
                # Mocking HF API call for demonstration since specific model wasn't provided
                # In production, use requests.post to HF Inference API
                pass
            except Exception as e:
                logger.warning(f"HF API failed: {e}")

        # If no match and no API, return unavailable status
        return {
            "translated_text": "[Translation unavailable - Model/Dataset required]",
            "confidence": "Not provided",
            "source": "fallback"
        }

    def translate_santali_to_hindi(self, text: str) -> dict:
        for item in self.vocab:
            if item.get("santali", "").strip().lower() == text.strip().lower():
                return {
                    "translated_text": item.get("hindi"),
                    "confidence": "Verified (Local Dataset)",
                    "source": "local"
                }
        return {
            "translated_text": "[अनुवाद उपलब्ध नहीं है - डेटासेट आवश्यक है]",
            "confidence": "Not provided",
            "source": "fallback"
        }
