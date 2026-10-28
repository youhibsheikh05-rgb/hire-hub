import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/applications/my', config);
        setApplications(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (user) fetchMyApplications();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Applications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center text-gray-500">
          You haven't applied for any jobs yet. <Link to="/" className="text-primary hover:underline">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{app.job?.title}</h3>
                <p className="text-sm text-gray-600">{app.job?.company?.name} • {app.job?.location}</p>
                <p className="text-xs text-gray-500 mt-1">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${
                  app.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                  app.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-700' :
                  app.status === 'interview' ? 'bg-purple-100 text-purple-700' :
                  app.status === 'hired' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;