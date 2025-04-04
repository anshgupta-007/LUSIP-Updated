import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2, Search, FileText, User, Building, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const ResultsPage = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/fetchApprovedStudents`, {
          headers: { "Content-Type": "application/json" },
        });

        console.log(response.data.data);
        
        if (response.data && response.data.data) {
          setResults(response.data.data);
        //   toast.success("Results loaded successfully");
        } 
        // else {
        //   toast.warning("No results available");
        // }
      } catch (error) {
        console.error("Error fetching results:", error);
        navigate('/');
        // toast.error("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, []);

  const filteredResults = results.filter(student => 
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-blue-100">
          {/* Header with decorative elements */}
          <div className="relative mb-10 pb-6 border-b border-blue-100">
            <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-full translate-x-1/3 -translate-y-1/3 opacity-50"></div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-2 text-center relative z-10">
              LUSIP 2025 Results
            </h1>
            <p className="text-center text-gray-500 max-w-2xl mx-auto">
              Congratulations to all selected candidates for the LNMIIT Undergraduate Summer Internship Program 2025
            </p>
          </div>
          
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <span className="text-lg text-gray-600">Loading results...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16 bg-blue-50 rounded-lg">
              <FileText className="h-16 w-16 text-blue-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 font-medium">No results available at this time.</p>
              <p className="mt-2 text-gray-500">Please check back after the announcement date (20th May 2025).</p>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="mb-6 max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name, institute or project..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            
              {/* Results display */}
              <div>
                {/* Desktop Table - Hidden on small screens */}
                <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <tr>
                        <th className="p-4 text-left font-semibold rounded-tl-lg">Sr. No.</th>
                        <th className="p-4 text-left font-semibold">Name</th>
                        <th className="p-4 text-left font-semibold">Mode of Operation</th>
                        <th className="p-4 text-left font-semibold">Name of Institute</th>
                        <th className="p-4 text-left font-semibold rounded-tr-lg">Allocated Project Title</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((student, index) => (
                        <tr 
                          key={index} 
                          className={`border-b hover:bg-blue-50 transition-colors ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } ${index === filteredResults.length - 1 ? "rounded-b-lg" : ""}`}
                        >
                          <td className="p-4">{index + 1}</td>
                          <td className="p-4 font-medium text-blue-700">{student.studentName}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 text-xs rounded-full ${
                              student.mode === "Online" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                            }`}>
                              {student.mode}
                            </span>
                          </td>
                          <td className="p-4">{student.college}</td>
                          <td className="p-4">{student.projectName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile Cards - Shown only on small screens */}
                <div className="md:hidden space-y-4">
                  {filteredResults.map((student, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                            {index + 1}
                          </div>
                          <h3 className="font-semibold text-blue-700">{student.studentName}</h3>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          student.mode === "Online" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                        }`}>
                          {student.mode}
                        </span>
                      </div>
                      
                      <div className="space-y-2 pl-11">
                        <div className="flex items-start">
                          <Building className="h-4 w-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{student.college}</p>
                        </div>
                        <div className="flex items-start">
                          <FileText className="h-4 w-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                          <p className="text-sm text-gray-800 font-medium">{student.projectName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredResults.length === 0 && searchTerm && (
                  <div className="text-center py-10">
                    <p className="text-gray-600">No results match your search criteria.</p>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-600">
            <p className="mb-4">
              For any queries regarding the results, please contact the LUSIP team at{" "}
              <a href="mailto:sandeep.saini@lnmiit.ac.in" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                sandeep.saini@lnmiit.ac.in
              </a>
            </p>
            <p className="text-sm text-gray-400">
              © 2025 LNMIIT. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;