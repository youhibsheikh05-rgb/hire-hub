import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CompanySetup = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', location: '', industry: '', size: '11-50', website: '', description: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/companies', formData, config);
      alert('Company Profile Created Successfully! 🎉');
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create company');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Setup Your Company</h1>
        <p className="text-gray-500 mb-6 text-sm">Before posting jobs, you need to create a company profile.</p>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input type="text" name="name" required onChange={handleChange} className="w-full border p-2 rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input type="text" name="location" required onChange={handleChange} className="w-full border p-2 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <input type="text" name="industry" required onChange={handleChange} className="w-full border p-2 rounded-md" placeholder="e.g. IT, Marketing" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Size</label>
              <select name="size" onChange={handleChange} className="w-full border p-2 rounded-md">
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="500+">500+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website (Optional)</label>
              <input type="url" name="website" onChange={handleChange} className="w-full border p-2 rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" required rows="3" onChange={handleChange} className="w-full border p-2 rounded-md"></textarea>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-md hover:bg-blue-700 transition font-bold">
            Create Company Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;