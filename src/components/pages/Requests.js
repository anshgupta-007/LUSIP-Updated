import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from "../LoadingSpinner";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/getallRequests`, {
          headers: { "Content-Type": "application/json" },
        });
        setRequests(response.data.faculties);
      } catch (error) {
        toast.error("Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (applyId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/changeStatus`, {
        status: "Approved",
        applyId,
      });
      toast.success(response.data.message);
      setRequests(requests.map(req => req.id === applyId ? { ...req, status: "Approved" } : req));
      setShowDetailsModal(false);
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleReject = async (applyId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/changeStatus`, {
        status: "Declined",
        applyId,
      });
      toast.success(response.data.message);
      setRequests(requests.map(req => req.id === applyId ? { ...req, status: "Declined" } : req));
      setShowDetailsModal(false);
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  const filteredRequests = requests.filter((request) => {
    if (filter === "All") return true;
    return request.status === filter;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="bottom-right"/>
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-4 sm:mb-6">Request Management</div>
            
            <div className="flex flex-wrap justify-center gap-8 mb-4 sm:mb-6">
              {["All", "Pending", "Approved", "Declined"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`
                    px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-colors
                    ${filter === status 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>

            {filteredRequests.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-lg sm:text-xl">No {filter.toLowerCase()==='all'? "" : filter.toLowerCase()} requests found</p>
              </div>
            ) : (
              <div className="block sm:hidden">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="mb-4 p-4 border rounded-lg">
                    <div className="mb-2">
                      <label className="text-sm text-gray-500">Project</label>
                      <div className="text-base font-medium text-gray-900">{request.projectId.projectName}</div>
                    </div>
                    <div className="mb-2">
                      <label className="text-sm text-gray-500">Student</label>
                      <div className="text-base text-gray-700">{request.studentId.firstName} {request.studentId.lastName}</div>
                    </div>
                    <div className="mb-3">
                      <label className="text-sm text-gray-500">Status</label>
                      <div>
                        <span className={`
                          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${request.status === "Approved" 
                            ? "bg-green-100 text-green-800" 
                            : request.status === "Declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                          }
                        `}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="w-full py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200 hover:bg-blue-100"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-blue-50">
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-blue-900 uppercase tracking-wider">Project</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-blue-900 uppercase tracking-wider">Student</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-blue-900 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-blue-900 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-left align-middle">
                        <div className="text-base font-medium text-gray-900">{request.projectId.projectName}</div>
                      </td>
                      <td className="px-6 py-4 text-left align-middle">
                        <div className="text-base text-gray-700">{request.studentId.firstName} {request.studentId.lastName}</div>
                      </td>
                      <td className="px-6 py-4 text-left align-middle">
                        <span className={`
                          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${request.status === "Approved" 
                            ? "bg-green-100 text-green-800" 
                            : request.status === "Declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                          }
                        `}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200 hover:bg-blue-100"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                <button 
                  onClick={closeDetailsModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Project</h4>
                  <p className="text-base font-medium text-gray-900">{selectedRequest.projectId.projectName}</p>
                </div>
                
                {/* Student Information Section */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Student Information</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Name</label>
                      <p className="text-base text-gray-900">
                        {selectedRequest.studentId.firstName} {selectedRequest.studentId.lastName}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500">College</label>
                      <p className="text-base text-gray-900">
                        {selectedRequest.studentId.college || "Not specified"}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500">Branch</label>
                      <p className="text-base text-gray-900">
                        {selectedRequest.studentId.branch || "Not specified"}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500">Year</label>
                      <p className="text-base text-gray-900">
                        {selectedRequest.studentId.year || "Not specified"}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500">SGPA</label>
                      <p className="text-base text-gray-900">
                        {selectedRequest.studentId.SGPA || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Application Details</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500">Student Preference</label>
                      <p className="text-base text-gray-900">
                        {selectedRequest.preference || "No preference specified"}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500">Why Should We Select You</label>
                      <div className="bg-gray-50 p-3 rounded-md mt-1">
                        <p className="text-base text-gray-900 whitespace-pre-wrap">
                          {selectedRequest.whyShouldWeSelectYou || "No information provided"}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500">Current Status</label>
                      <div className="mt-1">
                        <span className={`
                          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${selectedRequest.status === "Approved" 
                            ? "bg-green-100 text-green-800" 
                            : selectedRequest.status === "Declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                          }
                        `}>
                          {selectedRequest.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-200"
                >
                  Close
                </button>
                {selectedRequest.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleReject(selectedRequest.id)}
                      className="px-4 py-2 bg-red-50 text-red-700 rounded-md text-sm font-medium border border-red-200 hover:bg-red-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAccept(selectedRequest.id)}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-md text-sm font-medium border border-green-200 hover:bg-green-100"
                    >
                      Accept
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;