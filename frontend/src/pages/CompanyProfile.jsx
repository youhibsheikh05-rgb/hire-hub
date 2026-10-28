import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const { data: companyData } = await axios.get(`http://localhost:5000/api/companies/${id}`);
        setCompany(companyData.data);
        const { data: jobsData } = await axios.get(`http://localhost:5000/api/jobs`);
        const filteredJobs = jobsData.data.filter(job => job.company?._id === id);
        setJobs(filteredJobs);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!company) return <div className="text-center py-20">Company not found</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-blue-100 rounded-xl flex items-center justify-center text-primary text-4xl font-bold">
            {company.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-600 mt-1">{company.industry} • {company.location}</p>
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline mt-2 block">
                Visit Website
              </a>
            )}
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">About Us</h2>
          <p className="text-gray-700">{company.description}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Open Jobs at {company.name}</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500 bg-white p-6 rounded-xl border">No open jobs at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Link to={`/jobs/${job._id}`} key={job._id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{job.location} • {job.jobType}</p>
              <p className="text-primary font-medium mt-3">View Details →</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;