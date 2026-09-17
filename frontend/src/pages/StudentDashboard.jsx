import { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { BookOpen, Star, Award, LogOut, CheckCircle } from 'lucide-react';

import StudentLessonView from './StudentLessonView';

export default function StudentDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F0FDF4] font-sans">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-green-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-primary h-8 w-8" />
          <span className="text-2xl font-bold text-gray-800">TribalEdu</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">Welcome, {user.name}!</p>
            <p className="text-xs text-primary font-medium">Class 3 • Santali</p>
          </div>
          <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition">
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Routes>
          <Route path="/" element={<StudentHome />} />
          <Route path="/lesson/:id" element={<StudentLessonView />} />
          <Route path="/quiz/:id" element={<div>Quiz View coming soon</div>} />
        </Routes>
      </main>
    </div>
  );
}

function StudentHome() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-primary rounded-3xl p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-2">Ready to Learn?</h1>
          <p className="text-green-100 text-lg">You have 2 new lessons today!</p>
        </div>
        <div className="mt-6 sm:mt-0 relative z-10 flex space-x-4">
          <div className="bg-white/20 px-4 py-3 rounded-2xl text-center backdrop-blur-sm">
            <div className="flex justify-center mb-1"><Star className="h-6 w-6 text-yellow-300 fill-current" /></div>
            <p className="font-bold text-xl">120</p>
            <p className="text-xs text-green-100 font-medium uppercase tracking-wider">Points</p>
          </div>
          <div className="bg-white/20 px-4 py-3 rounded-2xl text-center backdrop-blur-sm">
            <div className="flex justify-center mb-1"><Award className="h-6 w-6 text-blue-300" /></div>
            <p className="font-bold text-xl">5</p>
            <p className="text-xs text-green-100 font-medium uppercase tracking-wider">Badges</p>
          </div>
        </div>
        {/* Decorative background circle */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Today's Lessons */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-primary" /> Today's Lessons
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <LessonCard 
            subject="Science" 
            title="Plants and Water" 
            color="bg-emerald-100 text-emerald-800" 
            btnColor="bg-emerald-500 hover:bg-emerald-600"
            icon="🌱"
          />
          <LessonCard 
            subject="EVS" 
            title="Our Environment" 
            color="bg-blue-100 text-blue-800" 
            btnColor="bg-blue-500 hover:bg-blue-600"
            icon="🌍"
          />
        </div>
      </div>
    </div>
  );
}

function LessonCard({ subject, title, color, btnColor, icon, id }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${color}`}>
          {subject}
        </span>
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 line-clamp-2">Learn about {title.toLowerCase()} in Hindi and Santali.</p>
      
      <div className="mt-auto pt-4 border-t border-gray-50">
        <button onClick={() => navigate(`/student/lesson/${id || 'demo1'}`)} className={`w-full py-3 rounded-2xl text-white font-bold text-lg transition-colors ${btnColor}`}>
          Start Lesson
        </button>
      </div>
    </div>
  );
}
