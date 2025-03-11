import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";
// import { DepartmentList, InstitutionList } from "./Institutions";

const AboutUpdateForm = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "",
    facultyType: "",
    institution: "",
    department: "",
    adminFor: "",
    college: "",
    branch: "",
    SGPA: "",
    college: "",
    year: "",
  });

  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "",
    facultyType: "",
    institution: "",
    department: "",
    adminFor: "",
    college: "",
    branch: "",
    SGPA: "",
    college: "",
    year: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };

  const callAboutPage = async () => {
    try {
      console.log("Inside About Page");
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/about`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.user);
      const data = response.data.user;
      console.log(data);
      setUserData(data);
      setOriginalData(data);
      setIsLoading(false);
      if (response.status !== 200) {
        throw new Error(response.error);
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.warn("Unauthorized Access! Please Login!", {
          toastId: "Unauthorized",
        });
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    callAboutPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to get user initial for avatar
  const getUserInitial = () => {
    return userData.firstName ? userData.firstName.charAt(0).toUpperCase() : "U";
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
          <div className="w-full rounded-xl p-8 shadow-lg sm:w-11/12 lg:w-7/12 bg-white border border-gray-100">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Profile Information</h1>
              {/* {!isEditing && (
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )} */}
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* User Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                  {getUserInitial()}
                </div>
                <p className="mt-3 text-lg font-medium text-gray-700 capitalize">
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm text-gray-500">{userData.accountType}</p>
              </div>

              {/* Main Information */}
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Basic Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base font-semibold text-gray-700">{userData.email}</p>
                    </div>

                    {userData.accountType === "Student" && (
                      <>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p className="text-base font-semibold text-gray-700">{userData.phone || "Not provided"}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {userData.accountType === "Student" && (
                  <div className="bg-gray-50 rounded-lg p-6 mt-4 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Academic Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-500">College</p>
                        <p className="text-base font-semibold text-gray-700">{userData.college || "Not specified"}</p>
                      </div>
                      
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-500">Branch</p>
                        <p className="text-base font-semibold text-gray-700">{userData.branch || "Not specified"}</p>
                      </div>
                      
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-500">Year</p>
                        <p className="text-base font-semibold text-gray-700">{userData.year || "Not specified"}</p>
                      </div>
                      
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-500">SGPA</p>
                        <p className="text-base font-semibold text-gray-700">{userData.SGPA || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-4 mt-6">
                <button 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AboutUpdateForm;