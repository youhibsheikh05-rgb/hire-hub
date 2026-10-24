import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        setJobs(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <header className="bg-white py-16 text-center px-4 border-b">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Connecting Talent with Opportunity. Explore thousands of jobs and take the next step in your career.
        </p>
      </header>

      {/* Jobs List */}
      <main className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Jobs</h2>
        
        {loading ? (
          <div className="text-center text-gray-500 text-xl">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500">No jobs found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-primary font-bold text-xl">
                    {job.company?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company?.name}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p>📍 {job.location}</p>
                  <p>💼 {job.jobType} • {job.experienceLevel}</p>
                  <p>💰 {job.salary.min} - {job.salary.max} {job.salary.currency}</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition font-medium">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Home;