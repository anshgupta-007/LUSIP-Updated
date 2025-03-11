import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { User, Mail, Lock, Phone, BookOpen, Calendar, GitBranch, BarChart } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    college: "",
    year: "",
    branch: "",
    "SGPA": "",
    accountType: "Student",
  });

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!user.firstName.trim()) newErrors.firstName = "First name required";
    if (!user.lastName.trim()) newErrors.lastName = "Last name required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email.trim()) newErrors.email = "Email required";
    else if (!emailRegex.test(user.email)) newErrors.email = "Invalid email";

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!user.phone.trim()) newErrors.phone = "Phone number required";
    else if (!phoneRegex.test(user.phone)) newErrors.phone = "Invalid phone number";

    // Additional fields validation
    if (!user.college.trim()) newErrors.college = "College name required";
    if (!user.year.trim()) newErrors.year = "Year required";
    if (!user.branch.trim()) newErrors.branch = "Branch required";

    // SGPA validation (optional)
    if (user.SGPA && (isNaN(user.SGPA) || user.SGPA < 0 || user.SGPA > 10)) {
      newErrors.SGPA = "SGPA must be between 0-10";
    }

    // Password validation
    if (!user.password) newErrors.password = "Password required";
    else if (user.password.length < 8) newErrors.password = "Min 8 characters";

    // Confirm password validation
    if (user.password !== user.confirmPassword) newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      //toast.error("Please correct form errors");
      return;
    }
    setIsLoading(true);
    setErrors({});

    try {
      const userCheckResponse = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/userpresent`,
        { email: user.email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (userCheckResponse.data.success) {
        toast.error("User already exists");
        setIsLoading(false);
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/sendotp`,
        user,
        { headers: { "Content-Type": "application/json" } }
      );

      navigate("/verify-otp", { state: { user } });
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.error || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Field mapping with labels and icons
  const fields = [
    { name: "firstName", label: "First Name", icon: <User size={18} /> },
    { name: "lastName", label: "Last Name", icon: <User size={18} /> },
    { name: "email", label: "Email", icon: <Mail size={18} /> },
    { name: "phone", label: "Phone Number", icon: <Phone size={18} /> },
    { name: "password", label: "Password", icon: <Lock size={18} /> },
    { name: "confirmPassword", label: "Confirm Password", icon: <Lock size={18} /> },
    { name: "college", label: "College", icon: <BookOpen size={18} /> },
    { name: "SGPA", label: "SGPA", icon: <BarChart size={18} /> },
    { name: "year", label: "Year", icon: <Calendar size={18} /> },
    { name: "branch", label: "Branch", icon: <GitBranch size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-4 sm:py-8">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
          
          <form onSubmit={requestOtp} className="space-y-4">
            {/* Mobile layout (vertical stacking) */}
            <div className="lg:hidden space-y-4">
              {fields.map((field) => (
                <div key={field.name} className="relative">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      {field.icon}
                    </div>
                    <input
                      type={field.name.includes("password") ? "password" : "text"}
                      id={field.name}
                      name={field.name}
                      value={user[field.name]}
                      onChange={handleInputs}
                      placeholder={field.label}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        errors[field.name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>
            
            {/* Desktop layout (grid) */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* First row: firstName, lastName */}
                <div className="relative">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleInputs}
                      placeholder="First Name"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                
                <div className="relative">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleInputs}
                      placeholder="Last Name"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        errors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
                
                {/* Second row: email, phone */}
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Mail size={18} />
                    </div>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputs}
                      placeholder="Email"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Phone size={18} />
                    </div>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={user.phone}
                      onChange={handleInputs}
                      placeholder="Phone Number"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                
                {/* Third row: password, confirmPassword */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={user.password}
                      onChange={handleInputs}
                      placeholder="Password"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
                
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={user.confirmPassword}
                      onChange={handleInputs}
                      placeholder="Confirm Password"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
                
                {/* Fourth row: college, SGPA */}
                <div className="relative">
                  <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
                    College
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <BookOpen size={18} />
                    </div>
                    <input
                      type="text"
                      id="college"
                      name="college"
                      value={user.college}
                      onChange={handleInputs}
                      placeholder="College"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        errors.college ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.college && (
                    <p className="text-red-500 text-xs mt-1">{errors.college}</p>
                  )}
                </div>
                
                <div className="relative">
                  <label htmlFor="SGPA" className="block text-sm font-medium text-gray-700 mb-1">
                    SGPA
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <BarChart size={18} />
                    </div>
                    <input
                      type="text"
                      id="SGPA"
                      name="SGPA"
                      value={user.SGPA}
                      onChange={handleInputs}
                      placeholder="SGPA"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        errors.SGPA ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.SGPA && (
                    <p className="text-red-500 text-xs mt-1">{errors.SGPA}</p>
                  )}
                </div>
                
                {/* Fifth row: branch, year */}
                <div className="relative">
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <GitBranch size={18} />
                    </div>
                    <input
                      type="text"
                      id="branch"
                      name="branch"
                      value={user.branch}
                      onChange={handleInputs}
                      placeholder="Branch"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        errors.branch ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.branch && (
                    <p className="text-red-500 text-xs mt-1">{errors.branch}</p>
                  )}
                </div>
                
                <div className="relative">
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Calendar size={18} />
                    </div>
                    <input
                      type="text"
                      id="year"
                      name="year"
                      value={user.year}
                      onChange={handleInputs}
                      placeholder="Year"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                        errors.year ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.year && (
                    <p className="text-red-500 text-xs mt-1">{errors.year}</p>
                  )}
                </div>
              </div>
            </div>
            
            <button type="submit" className="w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300">
              Create Account
            </button>
            
            <p className="text-sm text-center mt-4">
              Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Log in</Link>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Signup;