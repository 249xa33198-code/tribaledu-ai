import { Link } from 'react-router-dom';
import { BookOpen, Mic, Languages, Sparkles, BarChart, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-primary h-8 w-8" />
          <span className="text-2xl font-bold text-gray-800">TribalEdu AI</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-primary font-medium">Login</Link>
          <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-full font-medium shadow hover:bg-primary-dark transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 text-center max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          AI-Powered Mother-Tongue Learning for <span className="text-primary">Tribal Children</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Bridging the language gap between teachers and tribal students through AI-powered translation, voice interaction, and personalized learning.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login" className="flex justify-center items-center bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-primary-dark transition">
            Teacher Login
          </Link>
          <Link to="/login" className="flex justify-center items-center bg-white text-primary border-2 border-primary px-8 py-4 rounded-full font-semibold text-lg shadow hover:bg-green-50 transition">
            Student Login
          </Link>
          <button className="flex justify-center items-center text-gray-600 font-semibold text-lg hover:text-primary transition group">
            Explore Demo <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Languages className="h-10 w-10 text-blue-500" />}
            title="Language Bridge"
            description="Real-time translation from Hindi to tribal languages like Santali, removing communication barriers in the classroom."
          />
          <FeatureCard 
            icon={<Sparkles className="h-10 w-10 text-yellow-500" />}
            title="AI Translation"
            description="Powered by contextual AI models ensuring culturally and educationally accurate translations."
          />
          <FeatureCard 
            icon={<Mic className="h-10 w-10 text-purple-500" />}
            title="Voice Learning"
            description="Speech-to-text and text-to-speech capabilities to help students learn through speaking and listening."
          />
          <FeatureCard 
            icon={<BookOpen className="h-10 w-10 text-red-500" />}
            title="Interactive Lessons"
            description="Bilingual lesson viewing with rich multimedia and integrated learning flashcards."
          />
          <FeatureCard 
            icon={<BarChart className="h-10 w-10 text-green-500" />}
            title="Student Progress"
            description="Comprehensive analytics dashboard for teachers to track individual and class performance."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12 mt-12">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p>SIH26042 Prototype - TribalEdu AI</p>
          <p className="mt-2 text-sm">Empowering mother-tongue education.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="bg-gray-50 inline-block p-4 rounded-xl mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
