import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [minSalary, setMinSalary] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // URL banayo query parameters ke sath
      const query = new URLSearchParams();
      if (keyword) query.append('keyword', keyword);
      if (location) query.append('location', location);
      if (jobType) query.append('jobType', jobType);
      if (minSalary) query.append('minSalary', minSalary);

      const response = await axios.get(`http://localhost:5000/api/jobs?${query.toString()}`);
      setJobs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  // Jab page pehli baar load ho
  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <>
      {/* Hero Section with Search */}
      <header className="bg-white py-12 text-center px-4 border-b">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Connecting Talent with Opportunity.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-md border flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Job title, skills..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input 
            type="text" 
            placeholder="Location" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full md:w-48 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select 
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full md:w-40 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium">
            Search
          </button>
        </form>
      </header>

      {/* Jobs List */}
      <main className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Jobs ({jobs.length})</h2>
        
        {loading ? (
          <div className="text-center text-gray-500 text-xl">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 bg-white p-10 rounded-xl shadow-sm border">No jobs found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-primary font-bold text-xl">
                      {job.company?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <Link to={`/jobs/${job._id}`}>
                        <h3 className="text-lg font-bold text-gray-900 hover:text-primary transition cursor-pointer">
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">{job.company?.name}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p>📍 {job.location}</p>
                    <p>💼 {job.jobType} • {job.experienceLevel}</p>
                    <p>💰 {job.salary.min} - {job.salary.max} {job.salary.currency}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <Link 
                  to={`/jobs/${job._id}`} 
                  className="block w-full text-center bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
                >
                  View & Apply
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Home;