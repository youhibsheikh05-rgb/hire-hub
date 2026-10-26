import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCompanyAndFetchJobs = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Pehle check karo company hai ya nahi
        try {
          await axios.get('http://localhost:5000/api/companies/my', config);
        } catch (err) {
          // Agar company nahi hai (404), toh setup page par bhejo
          if (err.response?.status === 404) {
            navigate('/recruiter/setup-company');
            return;
          }
        }

        // Company hai, toh jobs fetch karo
        const { data } = await axios.get('http://localhost:5000/api/jobs/my-jobs', config);
        setJobs(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (user) checkCompanyAndFetchJobs();
  }, [user, navigate]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Recruiter Dashboard</h1>
        <Link 
          to="/recruiter/post-job" 
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium"
        >
          + Post New Job
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-4">Your Posted Jobs</h2>

      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm border text-center">
          You haven't posted any jobs yet. Click "Post New Job" to get started.
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4 border-b">Job Title</th>
                <th className="p-4 border-b">Location</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Views</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="p-4 border-b font-medium text-gray-900">{job.title}</td>
                  <td className="p-4 border-b text-gray-600">{job.location}</td>
                  <td className="p-4 border-b">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">
                      {job.status}
                    </span>
                  </td>
                  <td className="p-4 border-b text-gray-600">{job.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;