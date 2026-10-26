import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PostJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', jobType: 'full-time',
    experienceLevel: 'junior', minSalary: '', maxSalary: '', skills: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        salary: {
          min: Number(formData.minSalary),
          max: Number(formData.maxSalary),
          currency: 'PKR'
        },
        skills: formData.skills.split(',').map(s => s.trim()),
        requirements: ['Check description'],
      };
      await axios.post('http://localhost:5000/api/jobs', jobData, config);
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Post a New Job</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input type="text" name="title" required onChange={handleChange} className="w-full border p-2 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input type="text" name="location" required onChange={handleChange} className="w-full border p-2 rounded-md" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" required rows="4" onChange={handleChange} className="w-full border p-2 rounded-md"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Type</label>
              <select name="jobType" onChange={handleChange} className="w-full border p-2 rounded-md">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience Level</label>
              <select name="experienceLevel" onChange={handleChange} className="w-full border p-2 rounded-md">
                <option value="fresher">Fresher</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Salary (PKR)</label>
              <input type="number" name="minSalary" required onChange={handleChange} className="w-full border p-2 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Salary (PKR)</label>
              <input type="number" name="maxSalary" required onChange={handleChange} className="w-full border p-2 rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Skills (Comma separated)</label>
            <input type="text" name="skills" required placeholder="React, Node.js, MongoDB" onChange={handleChange} className="w-full border p-2 rounded-md" />
          </div>

          <button type="submit" className="w-full bg-primary text-white py-3 rounded-md hover:bg-blue-700 transition font-bold mt-4">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;