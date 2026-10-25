import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams(); // URL se job ID nikalna
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Apply Modal ke liye states
  const [showModal, setShowModal] = useState(false);
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applyMsg, setApplyMsg] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to apply');
      navigate('/login');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/applications', 
        { jobId: job._id, resume, coverLetter }, 
        config
      );
      setApplyMsg('Application submitted successfully! 🎉');
      setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      setApplyMsg(error.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!job) return <div className="text-center py-20">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-600 mt-1">{job.company?.name} • {job.location}</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Apply Now
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
          <p><strong>Job Type:</strong> {job.jobType}</p>
          <p><strong>Experience:</strong> {job.experienceLevel}</p>
          <p><strong>Salary:</strong> {job.salary.min} - {job.salary.max} {job.salary.currency}</p>
          <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Skills Required</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, i) => (
              <span key={i} className="bg-blue-100 text-primary px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Apply for {job.title}</h2>
            {applyMsg && <p className="text-green-600 mb-4">{applyMsg}</p>}
            
            <form onSubmit={submitApplication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Resume Link (Google Drive / URL)</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://drive.google.com/..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Letter (Optional)</label>
                <textarea 
                  rows="3"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full border p-2 rounded-md"
                  placeholder="Why should we hire you?"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;