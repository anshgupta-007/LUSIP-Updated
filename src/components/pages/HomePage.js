import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "../../App";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const { state } = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyingToProject, setApplyingToProject] = useState(null);
  const [applicationData, setApplicationData] = useState({
    whyHireYou: "",
    preference: "1"
  });
  const [wordCount, setWordCount] = useState(0);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'

  const axiosConfig = {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  // Fetch all projects data
  const getProjectsData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/getallProjects`,
        axiosConfig,

      );

      if (response.status === 200) {
        setUserData(response.data.allProject);
      } else {
        toast.error("Failed to fetch projects.");
      }
    } catch (error) {
      toast.error("Error fetching projects. Redirecting to login.");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete all projects (admin only)
  const handleDeleteAllProjects = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all projects?");
    if (!confirmDelete) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/deleteAllProjects`,
        {},
        axiosConfig
      );
      if (response.status === 200) {
        toast.success("All projects have been deleted.");
        getProjectsData(); // Refresh the project list after deletion
      }
    } catch (error) {
      toast.error("Failed to delete projects.");
    }
  };

  // Open application modal
  const openApplyModal = (project) => {
    setApplyingToProject(project);
    setApplicationData({
      whyHireYou: "",
      preference: "1"
    });
    setWordCount(0);
    setShowApplyModal(true);
  };

  // Close application modal
  const closeApplyModal = () => {
    setShowApplyModal(false);
    setApplyingToProject(null);
  };

  // Count words in text
  const countWords = (text) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  // Handle input change for application form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "whyHireYou") {
      const words = countWords(value);
      setWordCount(words);
      
      // Limit to approximately 100 words (allow typing but will validate on submit)
      setApplicationData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setApplicationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle student project booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // If already submitting, prevent multiple submissions
    if (isSubmitting) return;
    
    // Validate form input
    if (!applicationData.whyHireYou.trim()) {
      toast.error("Please explain why you should be hired.");
      return;
    }
    
    if (wordCount > 100) {
      toast.error("Your explanation exceeds 100 words. Please shorten it.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/apply/${applyingToProject.id}/${applyingToProject.instructorId?.id}`,
        {
          whyShouldWeSelectYou: applicationData.whyHireYou,
          preference: applicationData.preference
        },
        axiosConfig
      );
      toast.success(response.data.message || "Successfully applied for the project.");
      closeApplyModal();
      getProjectsData(); // Refresh the project list to update the applied status
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply for the project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle project details modal
  const handleShowDetails = (project) => {
    setSelectedProject(project);
  };

  // Close project details modal
  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Toggle between table and card view
  const toggleViewMode = () => {
    setViewMode(prev => prev === "table" ? "card" : "table");
  };

  // Auto-switch to card view on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("card");
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch projects when component mounts
  useEffect(() => {
    getProjectsData();
  }, []);

  // Render project card
  const renderProjectCard = (project) => (
    <div 
      key={project.id} 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4">
        <h3 className="text-xl font-bold text-white truncate">{project.projectName}</h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Faculty</span>
          <span className="text-sm text-gray-700">{project.instructorId?.firstName} {project.instructorId?.lastName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Prerequisites</span>
          <span className="text-sm text-gray-700 truncate max-w-[180px]">{project.prerequisites}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Mode</span>
          <span className="text-sm text-gray-700">{project.mode}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Branch</span>
          <span className="text-sm text-gray-700">{project.preferredBranch}</span>
        </div>
      </div>
      <div className="bg-gray-50 p-4 flex justify-between items-center">
        <button
          onClick={() => handleShowDetails(project)}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline focus:outline-none"
        >
          View Details
        </button>
        {state?.userType === "Student" && (
          <>
            {project.isApplied ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Applied
              </span>
            ) : (
              <button
                onClick={() => openApplyModal(project)}
                className="inline-flex items-center px-3 py-1 text-sm font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Apply
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer position="bottom-left" autoClose={3000} className="z-50" />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 text-center sm:text-left">
                Available <span className="text-indigo-700">Projects</span>
              </h1>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                {/* View toggle */}
                <button
                  onClick={toggleViewMode}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="mr-2">
                    {viewMode === "table" ? "Card View" : "Table View"}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {viewMode === "table" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    )}
                  </svg>
                </button>

                {state?.userType === "Admin" && (
                  <button
                    onClick={handleDeleteAllProjects}
                    className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 transition duration-300 ease-in-out w-full sm:w-auto"
                  >
                    Delete All Projects
                  </button>
                )}
              </div>
            </div>

            {/* No Projects Message */}
            {(!Array.isArray(userData) || userData.length === 0) && (
              <div className="flex justify-center mt-10">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">No Projects Found</h2>
                  <p className="text-gray-500">Check back later for new project opportunities.</p>
                </div>
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && Array.isArray(userData) && userData.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    {/* Table Header */}
                    <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500">
                      <tr>
                        <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">
                          Project Name
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">
                          Faculty Name
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white hidden sm:table-cell">
                          Prerequisites
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white hidden md:table-cell">
                          Mode
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white hidden lg:table-cell">
                          Preferred Branch
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-center text-sm font-semibold text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userData.map((project, idx) => (
                        <tr 
                          key={project.id} 
                          className={`${
                            idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          } hover:bg-indigo-50 transition-colors duration-200`}
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {project.projectName}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 truncate max-w-[120px]">
                            {project.instructorId?.firstName} {project.instructorId?.lastName}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 hidden sm:table-cell truncate max-w-[150px]">
                            {project.prerequisites}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 hidden md:table-cell">
                            {project.mode}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 hidden lg:table-cell">
                            {project.preferredBranch}
                          </td>
                          <td className="px-4 py-4 text-sm ">
                            <div className="flex flex-wrap">
                              <button
                                onClick={() => handleShowDetails(project)}
                                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200"
                              >
                                Details
                              </button>
                              
                              {/* {state?.userType === "Student" && (
                                <>
                                  {project.isApplied ? (
                                    <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Applied
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => openApplyModal(project)}
                                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                      Apply
                                    </button>
                                  )}
                                </>
                              )} */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Card View */}
            {viewMode === "card" && Array.isArray(userData) && userData.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.map(project => renderProjectCard(project))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative">
      {/* Close (X) button */}
      <button 
        onClick={handleCloseModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 pr-8">{selectedProject.projectName}</h2>
      
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-gray-500">Instructor</span>
            <span className="text-base text-gray-800">{selectedProject.instructorId?.firstName} {selectedProject.instructorId?.lastName}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-gray-500">Mode</span>
            <span className="text-base text-gray-800">{selectedProject.mode}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-gray-500">Preferred Branch</span>
            <span className="text-base text-gray-800">{selectedProject.preferredBranch}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-gray-500">Prerequisites</span>
          <span className="text-base text-gray-800">{selectedProject.prerequisites}</span>
        </div>

        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-gray-500">Description</span>
          <p className="text-base text-gray-800 whitespace-pre-line">{selectedProject.projectDescription}</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t border-gray-200">
        {state?.userType === "Student" && !selectedProject.isApplied && (
          <button
            onClick={() => {
              handleCloseModal();
              openApplyModal(selectedProject);
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Apply Now
          </button>
        )}
        <button
          onClick={handleCloseModal}
          className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {/* Application Modal */}
      {showApplyModal && applyingToProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              Apply for: {applyingToProject.projectName}
            </h2>
            
            <form onSubmit={handleBookingSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="preference" className="block text-sm font-medium text-gray-700 mb-1">
                    Preference
                  </label>
                  <select
                    id="preference"
                    name="preference"
                    value={applicationData.preference}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="1">1st Preference</option>
                    <option value="2">2nd Preference</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="whyHireYou" className="block text-sm font-medium text-gray-700 mb-1">
                    Why should we select you for this project? (Max 100 words)
                  </label>
                  <textarea
                    id="whyHireYou"
                    name="whyHireYou"
                    rows={5}
                    value={applicationData.whyHireYou}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    disabled={isSubmitting}
                  />
                  <div className={`text-sm mt-1 flex justify-end ${wordCount > 100 ? 'text-red-500' : 'text-gray-500'}`}>
                    {wordCount}/100 words
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  type="submit"
                  disabled={!applicationData.whyHireYou.trim() || wordCount > 100 || isSubmitting}
                  className={`w-full sm:w-auto px-6 py-3 text-white rounded-lg ${
                    !applicationData.whyHireYou.trim() || wordCount > 100 || isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? "Applying..." : "Apply Now"}
                </button>
                <button
                  type="button"
                  onClick={closeApplyModal}
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-4 py-2 text-white rounded-lg ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;