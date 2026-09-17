import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Book, LayoutDashboard, PlusCircle, Users, LogOut, Settings, Languages, BrainCircuit } from 'lucide-react';
import api from '../services/api';

export default function TeacherDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Book className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold text-gray-800">TribalEdu AI</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            <SidebarLink to="/teacher" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" end />
            <SidebarLink to="/teacher/create-lesson" icon={<PlusCircle className="h-5 w-5" />} text="Create Lesson" />
            <SidebarLink to="/teacher/lessons" icon={<Book className="h-5 w-5" />} text="My Lessons" />
            <SidebarLink to="/teacher/translation" icon={<Languages className="h-5 w-5" />} text="Translation" />
            <SidebarLink to="/teacher/students" icon={<Users className="h-5 w-5" />} text="Students" />
            <SidebarLink to="/teacher/analytics" icon={<BrainCircuit className="h-5 w-5" />} text="Analytics" />
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
              <p className="text-xs text-gray-500">Teacher</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex w-full items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Teacher Portal</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/create-lesson" element={<CreateLesson />} />
            <Route path="/translation" element={<div>Translation Interface coming soon</div>} />
            <Route path="/lessons" element={<div>Lessons List coming soon</div>} />
            <Route path="/students" element={<div>Students List coming soon</div>} />
            <Route path="/analytics" element={<div>Analytics coming soon</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, text, end }) {
  // A simple NavLink wrapper would be better, but building a quick active state for MVP
  const isActive = window.location.pathname === to || (!end && window.location.pathname.startsWith(to));
  
  return (
    <Link to={to} className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
      isActive ? 'bg-green-50 text-primary' : 'text-gray-700 hover:bg-gray-100'
    }`}>
      <span className={`mr-3 ${isActive ? 'text-primary' : 'text-gray-400'}`}>{icon}</span>
      {text}
    </Link>
  );
}

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="120" />
        <StatCard title="Lessons Created" value="15" />
        <StatCard title="Lessons Completed" value="340" />
        <StatCard title="Avg Student Score" value="85%" />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-500">Analytics and activity charts will appear here.</p>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function CreateLesson() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState([{ hindi: '', santali: '', english: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddSentence = () => {
    setContent([...content, { hindi: '', santali: '', english: '' }]);
  };

  const handleSentenceChange = (index, field, value) => {
    const newContent = [...content];
    newContent[index][field] = value;
    setContent(newContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      await api.post('/lessons/', { title, description, subject, content });
      setMessage('Lesson created successfully!');
      setTitle('');
      setDescription('');
      setSubject('');
      setContent([{ hindi: '', santali: '', english: '' }]);
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Error creating lesson');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Lesson</h2>
      {message && <div className={`p-4 mb-4 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="e.g., Basic Greetings" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="e.g., Environmental Studies" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="Briefly describe what students will learn..."></textarea>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Lesson Content (Sentences/Words)</h3>
          {content.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Hindi (Instructional Language)</label>
                <input type="text" required value={item.hindi} onChange={(e) => handleSentenceChange(index, 'hindi', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm" placeholder="Hindi sentence" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Santali (Mother Tongue)</label>
                <input type="text" required value={item.santali} onChange={(e) => handleSentenceChange(index, 'santali', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm" placeholder="Santali translation" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">English (Optional)</label>
                <input type="text" value={item.english} onChange={(e) => handleSentenceChange(index, 'english', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm" placeholder="English equivalent" />
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddSentence} className="text-sm text-primary font-medium hover:text-green-700 flex items-center">
            <PlusCircle className="h-4 w-4 mr-1" /> Add another sentence
          </button>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
}
