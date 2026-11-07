import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (keyword) query.append('keyword', keyword);
      if (location) query.append('location', location);
      if (jobType) query.append('jobType', jobType);

      const response = await axios.get(`http://localhost:5000/api/jobs?${query.toString()}`);
      setJobs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Hero Section with Gradient */}
      <header className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 py-24 text-center px-4 overflow-hidden">
        {/* Background Design Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute top-20 right-10 w-60 h-60 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Find Your Dream Job <br className="hidden md:block" /> 
            <span className="text-blue-200">Faster Than Ever.</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Discover thousands of job opportunities with top companies. Your next big career move is just a click away.
          </p>

          {/* Glassmorphism Search Box */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/20 flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Job title, keywords, or company" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 bg-white text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
            />
            <input 
              type="text" 
              placeholder="City or Remote" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full md:w-64 bg-white text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
            />
            <select 
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full md:w-48 bg-white text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Job Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            <button type="submit" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition shadow-lg">
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Jobs List Section */}
      <main className="max-w-6xl mx-auto py-16 px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Recommended Jobs</h2>
            <p className="text-gray-500 mt-2">Showing {jobs.length} open positions</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No jobs found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                {/* Top Accent Line on Hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div>
                  <div className="flex items-center space-x-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-primary font-extrabold text-2xl shadow-inner">
                      {job.company?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <Link to={`/jobs/${job._id}`}>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                      </Link>
                      <Link to={`/companies/${job.company?._id}`} className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                        {job.company?.name}
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      📍 {job.location}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      💼 {job.jobType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      💰 {job.salary.min/1000}k - {job.salary.max/1000}k
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="bg-gray-50 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium border border-gray-200">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="text-gray-400 text-xs py-1">+{job.skills.length - 3} more</span>
                    )}
                  </div>
                </div>
                
                <Link 
                  to={`/jobs/${job._id}`} 
                  className="block w-full text-center bg-gray-50 text-gray-800 border border-gray-200 py-2.5 rounded-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 font-semibold"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;