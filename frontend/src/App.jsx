import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import JobDetail from './pages/JobDetail'; // Naya Page Import kiya

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">HireHub</Link>
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              <span className="text-gray-700 font-medium">Hi, {user.name}</span>
              <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-primary font-medium">Login</Link>
              <Link to="/signup" className="bg-primary text-white px-5 py-2 rounded-md hover:bg-blue-700 transition font-medium">Sign Up</Link>
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
          <Route path="/jobs/:id" element={<JobDetail />} /> {/* Naya Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;