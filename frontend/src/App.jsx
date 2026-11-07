import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup'; // Naya import
import JobDetail from './pages/JobDetail';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import CompanySetup from './pages/CompanySetup';
import ViewApplicants from './pages/ViewApplicants';
import MyApplications from './pages/MyApplications';
import CompanyProfile from './pages/CompanyProfile';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
          HireHub.
        </Link>
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              {user.role === 'recruiter' && (
                <Link to="/recruiter/dashboard" className="text-gray-600 font-medium hover:text-primary transition">Dashboard</Link>
              )}
              {user.role === 'candidate' && (
                <Link to="/candidate/applications" className="text-gray-600 font-medium hover:text-primary transition">My Applications</Link>
              )}
              <span className="text-gray-800 font-medium">Hi, {user.name}</span>
              <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition">Login</Link>
              <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:shadow-lg transition font-medium">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> {/* Naya Route */}
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/post-job" element={<PostJob />} />
          <Route path="/recruiter/setup-company" element={<CompanySetup />} />
          <Route path="/recruiter/applicants/:jobId" element={<ViewApplicants />} />
          <Route path="/candidate/applications" element={<MyApplications />} />
          <Route path="/companies/:id" element={<CompanyProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;