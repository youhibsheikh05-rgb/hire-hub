import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ViewApplicants = () => {
  const { jobId } = useParams(); // URL se ID nikal raha hai
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log("Fetching applicants for Job ID:", jobId); // Debugging ke liye
        
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Yahan URL check karo
        const { data } = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, config);
        
        setApplications(data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load applicants');
        setLoading(false);
      }
    };
    
    if (user && jobId) {
      fetchApplications();
    }
  }, [user, jobId]);

  const updateStatus = async (appId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/applications/${appId}/status`, { status: newStatus }, config);
      setApplications(applications.map(app => app._id === appId ? { ...app, status: newStatus } : app));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <Link to="/recruiter/dashboard" className="text-primary hover:underline mr-4 font-medium">← Back to Dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-800">Applicants for this Job</h1>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center text-gray-500">
          No one has applied for this job yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{app.candidate?.name}</h3>
                <p className="text-sm text-gray-600">{app.candidate?.email} • {app.candidate?.location || 'No location'}</p>
                <p className="text-xs text-gray-500 mt-1">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                {app.resume && (
                  <a href={app.resume} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline mt-2 block">
                    View Resume
                  </a>
                )}
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  app.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                  app.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-700' :
                  app.status === 'hired' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {app.status}
                </span>
                
                <select 
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  className="border p-1 rounded text-sm bg-white"
                >
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplicants;