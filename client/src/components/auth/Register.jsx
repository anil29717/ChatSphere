import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { toast } from 'react-toastify';
import { FaUserAlt, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaImage, FaUserCircle } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    username: '',
    email: '',
    number: '',
    password: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileImage) return toast.error("Please upload profile image");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append('profileImage', profileImage);

    try {
      const res = await API.post('/auth/register', data);
      toast.success(res.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 font-barlow">
      <form
        onSubmit={handleSubmit}
        className="bg-dark-blue p-6 rounded-2xl shadow-xl w-full max-w-xl space-y-6"
      >
        {/* Profile Image on Top */}
        <div className="flex flex-col items-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <label className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 border-2 border-white text-3xl shadow-md">
              <FaUserAlt />
              <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="hidden"
            />
            </label>
            
          )}
          
        </div>

        <h2 className="text-3xl font-semibold text-center">Create Account</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="relative">
            <FaUserAlt className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="bg-black text-white border border-gray-600 rounded-lg pl-10 py-2 w-full"
            />
          </div>

          {/* Age */}
          <input
            type="number"
            name="age"
            onChange={handleChange}
            placeholder="Age"
            required
            className="bg-black text-white border border-gray-600 rounded-lg py-2 px-4 w-full"
          />

          {/* Gender */}
          <select
            name="gender"
            onChange={handleChange}
            required
            className="bg-black text-white border border-gray-600 rounded-lg py-2 px-4 w-full col-span-1 sm:col-span-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Location */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="location"
              onChange={handleChange}
              placeholder="Location"
              required
              className="bg-black text-white border border-gray-600 rounded-lg pl-10 py-2 w-full"
            />
          </div>

          {/* Username */}
          <div className="relative">
            <FaUserCircle className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Username"
              required
              className="bg-black text-white border border-gray-600 rounded-lg pl-10 py-2 w-full"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="bg-black text-white border border-gray-600 rounded-lg pl-10 py-2 w-full"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <FaPhone className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="number"
              onChange={handleChange}
              placeholder="Phone"
              className="bg-black text-white border border-gray-600 rounded-lg pl-10 py-2 w-full"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
              className="bg-black text-white border border-gray-600 rounded-lg pl-10 py-2 w-full"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
