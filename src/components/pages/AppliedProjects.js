import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDeleteForever } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import LoadingSpinner from "../LoadingSpinner";
import { useNavigate } from "react-router-dom";


const AppliedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const Navigate = useNavigate();
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/userSpecificProject`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log("Printing data d", response.data.appliedDetails);
      setProjects(response.data.appliedDetails || []);
    } catch (error) {

      console.error("Error fetching project data:", error);
      Navigate("/login");
      // toast.error("Failed to fetch applied projects.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (projectId) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to cancel this application?");
      if (!isConfirmed) return;
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/cancelApplication`, { applyId: projectId }, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Request cancelled successfully!");
        setProjects((prevProjects) => prevProjects.filter(project => project.id !== projectId));
      } else {
        toast.error("Failed to cancel the request.");
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast.error("An error occurred while cancelling the request.");
    }
    setIsLoading(false);
  };

  const openReasonModal = (project) => {
    setSelectedProject(project);
    setShowReasonModal(true);
  };

  const closeReasonModal = () => {
    setShowReasonModal(false);
    setSelectedProject(null);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Function to get preference display text
  const getPreferenceText = (preference) => {
    return preference === "1st" ? "1st Choice" : preference === "2nd" ? "2nd Choice" : preference || "Not specified";
  };

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <ToastContainer position="bottom-left" autoClose={3000} />
      <h1 className="text-4xl text-center font-extrabold mb-10 text-indigo-700">
        Applied Projects
      </h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{project.projectId.projectName}</h2>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </div>
              </div>
              
              {/* {project.status === 'Pending' && (
                <button
                  onClick={() => handleCancelRequest(project.id)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                  title="Cancel Application"
                >
                  <MdDeleteForever className="text-2xl" />
                </button>
              )} */}
              
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Instructor:</span> {project.projectId.instructorId?.firstName} {project.projectId.instructorId?.lastName}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Mode:</span> {project.projectId.mode}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Preference:</span> <span className="font-medium text-indigo-600">{getPreferenceText(project.preference)}</span>
              </p>
              
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => openReasonModal(project)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-300 rounded-md hover:bg-indigo-50"
                >
                  <FaEye className="mr-1" /> View Application
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-center text-xl text-gray-700 mb-4">No Projects Applied</p>
          <p className="text-center text-gray-500">You haven't applied to any projects yet.</p>
        </div>
      )}

      {/* Reason Modal */}
      {showReasonModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedProject.projectId.projectName}</h2>
            
            <div className="mb-6">
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-4">
                <p className="text-sm font-medium text-indigo-800">Application Status: <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedProject.status)}`}>{selectedProject.status}</span></p>
                <p className="text-sm font-medium text-indigo-800">Preference: {getPreferenceText(selectedProject.preference)}</p>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Why should we hire you?</h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedProject.whyShouldWeSelectYou || "No reason provided."}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Project Details</h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Instructor:</span> {selectedProject.projectId.instructorId?.firstName} {selectedProject.projectId.instructorId?.lastName}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Mode:</span> {selectedProject.projectId.mode}
              </p>
              {selectedProject.projectId.prerequisites && (
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Prerequisites:</span> {selectedProject.projectId.prerequisites}
                </p>
              )}
              {selectedProject.projectId.preferredBranch && (
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Preferred Branch:</span> {selectedProject.projectId.preferredBranch}
                </p>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeReasonModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedProjects;