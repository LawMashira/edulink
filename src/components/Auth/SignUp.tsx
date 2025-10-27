import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone: '',
    schoolId: '',
    schoolName: '',
    studentNumber: '',
    parentId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Role-specific validations
    if (formData.role === 'school_admin' && !formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare data for backend according to SignUpDto
      const submitData: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role.toUpperCase(),
        phone: formData.phone
      };

      // Add schoolName for school_admin role ONLY
      if (formData.role === 'school_admin') {
        submitData.schoolName = formData.schoolName;
        // DO NOT send schoolId for SCHOOL_ADMIN - backend will create school
      }
      
      // DO NOT send any school-related fields for VENDOR role

      // Add other optional fields if needed
      if (formData.studentNumber) {
        submitData.studentNumber = formData.studentNumber;
      }
      if (formData.parentId) {
        submitData.parentId = formData.parentId;
      }
      
      // Clean up: Remove any undefined/null/empty values
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === undefined || submitData[key] === null || submitData[key] === '') {
          delete submitData[key];
        }
      });
      
      // Debug: Log the data being sent
      console.log('Signup data being sent:', submitData);
      
      const success = await signUp(submitData);
      if (success) {
        toast.success('Registration successful! Welcome to ZimEduLink.');
        navigate('/dashboard');
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' });
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again later.' });
      toast.error('An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'school_admin':
        return 'Create an account for your school to manage students, teachers, and operations. You will be the primary administrator for your school.';
      case 'vendor':
        return 'Register as a vendor to sell educational products, books, stationery, and other school supplies on our marketplace.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-3">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="text-center mb-5">
            <img src="/images/edulink.jpg" alt="ZimEduLink" className="h-12 w-auto mx-auto mb-2" />
            <p className="text-sm text-gray-600">Register your school or become a vendor</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection - First */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am registering as *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'school_admin', label: 'School Admin', icon: '🏫' },
                  { value: 'vendor', label: 'Vendor', icon: '🛒' }
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, role: role.value }));
                      if (errors.role) {
                        setErrors(prev => ({ ...prev, role: '' }));
                      }
                    }}
                    className={`p-2 rounded-lg border-2 transition-all duration-200 text-center ${
                      formData.role === role.value
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <span className="text-xl mr-2">{role.icon}</span>
                    <span className="font-medium text-gray-900 text-sm">{role.label}</span>
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+263 77 123 4567"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>}
            </div>

            {/* Role-specific fields */}
            {formData.role === 'school_admin' && (
              <div>
                <label htmlFor="schoolName" className="block text-xs font-medium text-gray-700 mb-1">
                  School Name *
                </label>
                <input
                  type="text"
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.schoolName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Harare High School"
                />
                {errors.schoolName && <p className="text-red-500 text-xs mt-0.5">{errors.schoolName}</p>}
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Password"
                />
                {errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                  Confirm *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-0.5 h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I agree to the <a href="#" className="text-blue-600 hover:text-blue-800">Terms</a> and <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
              </label>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUp;
