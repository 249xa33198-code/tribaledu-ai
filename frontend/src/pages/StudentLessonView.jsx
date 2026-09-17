import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Volume2, Mic, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function StudentLessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        // Fetch all lessons (for demo purposes) and find the one with matching ID, or just fetch directly if backend supports it.
        // Since we don't have a specific GET /lessons/{id} route yet, we'll fetch all.
        const res = await api.get('/lessons/');
        const found = res.data.find(l => l._id === id || l.id === id);
        if (found) {
            setLesson(found);
        } else {
            // Fallback for demo if id is just 'demo1' etc
            setLesson({
                title: "Basic Greetings",
                subject: "Language",
                content: [
                    { hindi: "नमस्ते, आप कैसे हैं?", santali: "ᱡᱚᱦᱟᱨ, ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?", english: "Hello, how are you?" },
                    { hindi: "मैं ठीक हूँ, धन्यवाद।", santali: "ᱤᱧ ᱵᱮᱥ ᱜᱮ ᱢᱮᱱᱟᱹᱧᱟ, ᱥᱟᱨᱦᱟᱣ᱾", english: "I am fine, thank you." }
                ]
            });
        }
      } catch (error) {
        console.error("Failed to load lesson", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a suitable voice
      const voices = window.speechSynthesis.getVoices();
      if (lang === 'hi') {
          const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
          if (hiVoice) utterance.voice = hiVoice;
          utterance.lang = 'hi-IN';
      }
      // For Santali, browser might not have native TTS, so it falls back to default.
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in this browser.");
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Using Hindi as proxy for testing pronunciation
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setFeedback('Listening...');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFeedback(`You said: "${transcript}". Good try!`);
      };

      recognition.onerror = (event) => {
        setFeedback(`Error occurred in recognition: ${event.error}`);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  if (loading) return <div className="text-center py-20 text-xl font-bold text-gray-500">Loading lesson...</div>;
  if (!lesson) return <div className="text-center py-20 text-xl font-bold text-red-500">Lesson not found.</div>;

  const currentItem = lesson.content[currentIndex];
  const isLast = currentIndex === lesson.content.length - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate('/student')} className="text-gray-500 hover:text-primary flex items-center font-medium transition-colors">
        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{lesson.title}</h1>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8 mt-4">
          <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentIndex + 1) / lesson.content.length) * 100}%` }}></div>
        </div>

        {currentItem && (
          <div className="space-y-8 py-8">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-sm text-blue-500 font-bold uppercase tracking-wider mb-2">Instruction (Hindi)</p>
              <div className="flex items-center justify-center space-x-4">
                <p className="text-2xl font-medium text-gray-800">{currentItem.hindi}</p>
                <button onClick={() => speakText(currentItem.hindi, 'hi')} className="p-2 bg-white text-blue-500 rounded-full shadow hover:bg-blue-100 transition-colors">
                  <Volume2 className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider mb-2">Mother Tongue (Santali)</p>
              <div className="flex items-center justify-center space-x-4">
                <p className="text-3xl font-bold text-gray-900">{currentItem.santali}</p>
                <button onClick={() => speakText(currentItem.santali, 'en')} className="p-2 bg-white text-emerald-600 rounded-full shadow hover:bg-emerald-100 transition-colors">
                  <Volume2 className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-500 mt-4 text-sm">Practice saying this aloud.</p>
              
              <div className="mt-6 flex flex-col items-center">
                <button 
                  onClick={startListening} 
                  className={`p-4 rounded-full shadow-lg transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-gray-600 hover:text-primary hover:border-primary border-2 border-transparent'}`}
                >
                  <Mic className="h-8 w-8" />
                </button>
                {feedback && <p className="mt-4 text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm">{feedback}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center border-t border-gray-100 pt-6">
          <button 
            onClick={() => {setCurrentIndex(Math.max(0, currentIndex - 1)); setFeedback('');}}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            Previous
          </button>
          
          {isLast ? (
            <button 
              onClick={() => navigate('/student')}
              className="px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-green-700 flex items-center transition-colors shadow-md shadow-green-200"
            >
              Finish Lesson <CheckCircle className="ml-2 h-5 w-5" />
            </button>
          ) : (
            <button 
              onClick={() => {setCurrentIndex(Math.min(lesson.content.length - 1, currentIndex + 1)); setFeedback('');}}
              className="px-6 py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 flex items-center transition-colors shadow-md shadow-blue-200"
            >
              Next <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
