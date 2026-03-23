"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Building2, Check, ChevronDown, Globe, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthService } from "@/services/authService";

export function RegisterForm() {
  const [activeTab, setActiveTab] = useState("candidate");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [candidateForm, setCandidateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [employerForm, setEmployerForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [hrForm, setHrForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [candidateErrors, setCandidateErrors] = useState<{fullName?: string; email?: string; password?: string; confirmPassword?: string; terms?: string}>({});
  const [employerErrors, setEmployerErrors] = useState<{companyName?: string; email?: string; phone?: string; password?: string; confirmPassword?: string; terms?: string}>({});
  const [hrErrors, setHrErrors] = useState<{fullName?: string; email?: string; phone?: string; password?: string; confirmPassword?: string; terms?: string}>({});

  const validateCandidateForm = () => {
    const newErrors: {fullName?: string; email?: string; password?: string; confirmPassword?: string; terms?: string} = {};

    if (!candidateForm.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
    }

    if (!candidateForm.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(candidateForm.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!candidateForm.password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (candidateForm.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!candidateForm.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (candidateForm.password !== candidateForm.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!candidateForm.agreeToTerms) {
      newErrors.terms = 'Bạn phải đồng ý với điều khoản dịch vụ';
    }

    setCandidateErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmployerForm = () => {
    const newErrors: {companyName?: string; email?: string; phone?: string; password?: string; confirmPassword?: string; terms?: string} = {};

    if (!employerForm.companyName.trim()) {
      newErrors.companyName = 'Tên công ty không được để trống';
    }

    if (!employerForm.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(employerForm.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!employerForm.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9+\-\s()]+$/.test(employerForm.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!employerForm.password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (employerForm.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!employerForm.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (employerForm.password !== employerForm.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!employerForm.agreeToTerms) {
      newErrors.terms = 'Bạn phải đồng ý với điều khoản dịch vụ';
    }

    setEmployerErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateHrForm = () => {
    const newErrors: {fullName?: string; email?: string; phone?: string; password?: string; confirmPassword?: string; terms?: string} = {};

    if (!hrForm.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
    }

    if (!hrForm.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(hrForm.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!hrForm.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9+\-\s()]+$/.test(hrForm.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!hrForm.password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (hrForm.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!hrForm.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (hrForm.password !== hrForm.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!hrForm.agreeToTerms) {
      newErrors.terms = 'Bạn phải đồng ý với điều khoản dịch vụ';
    }

    setHrErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent, formData: typeof candidateForm | typeof employerForm | typeof hrForm, formType: 'candidate' | 'employer' | 'hr') => {
    e.preventDefault();

    // Clear previous errors
    if (formType === 'candidate') {
      setCandidateErrors({});
    } else if (formType === 'employer') {
      setEmployerErrors({});
    } else {
      setHrErrors({});
    }

    // Client-side validation
    let isValid = false;
    if (formType === 'candidate') {
      isValid = validateCandidateForm();
    } else if (formType === 'employer') {
      isValid = validateEmployerForm();
    } else {
      isValid = validateHrForm();
    }

    if (!isValid) {
      return;
    }

    setIsLoading(true);

    try {
      const roleMapping = {
        candidate: 'job_seeker',
        employer: 'employer',
        hr: 'hr'
      };

      const registerData = {
        email: formData.email,
        password: formData.password,
        role: roleMapping[formType as keyof typeof roleMapping] as 'job_seeker' | 'employer' | 'hr'
      };

      const data = await AuthService.register(registerData);

      // Store access token
      localStorage.setItem('access_token', data.access_token);

      // Store user info if needed
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Create profile based on user type
      try {
        if (formType === 'candidate') {
          // Create job seeker profile
          await createJobSeekerProfile(data.access_token, candidateForm);
        } else if (formType === 'employer') {
          // Create company profile - this is required for employers
          console.log('Creating company profile for employer...');
          const companyResult = await createCompanyProfile(data.access_token, employerForm);
          console.log('Company profile created:', companyResult);
        } else if (formType === 'hr') {
          // For HR, we might need to handle this differently
          // For now, just proceed to dashboard
          console.log('HR registration completed - profile creation may be handled separately');
        }
      } catch (profileError) {
        console.error('Profile creation failed:', profileError);
        // For employers, company creation is critical - show specific message
        if (formType === 'employer') {
          alert('Tài khoản đã được tạo thành công, nhưng không thể tạo công ty. Vui lòng liên hệ hỗ trợ hoặc tạo công ty sau trong dashboard.');
        } else {
          alert('Tài khoản đã được tạo thành công, nhưng có lỗi khi tạo hồ sơ. Bạn có thể cập nhật hồ sơ sau.');
        }
      }

      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent('userLogin'));

      // Redirect based on user role with proper priority
      // Priority: admin > hr > employer > job_seeker
      const userRoles = data.user?.roles || [];

      if (userRoles.includes('admin')) {
        window.location.href = '/dashboard/admin';
      } else if (userRoles.includes('hr')) {
        window.location.href = '/dashboard/hr';
      } else if (userRoles.includes('employer')) {
        window.location.href = '/dashboard/employer';
      } else if (userRoles.includes('job_seeker')) {
        window.location.href = '/jobs';
      } else {
        // Default fallback for any other roles
        window.location.href = '/jobs';
      }

    } catch (error) {
      console.error('Registration failed:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const createJobSeekerProfile = async (accessToken: string, formData: typeof candidateForm) => {
    const profileData = {
      title: formData.fullName, // Use fullName as initial title/summary
      summary: `Ứng viên: ${formData.fullName}`,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/jobseeker/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create job seeker profile');
    }

    return response.json();
  };

  const createCompanyProfile = async (accessToken: string, formData: typeof employerForm) => {
    const companyData = {
      name: formData.companyName,
      phone: formData.phone,
      email: formData.email, // Use registration email as company contact email
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create company profile');
    }

    return response.json();
  };

  const handleGoogleRegister = async () => {
    try {
      console.log('Google register attempt');

      // TODO: Implement Google OAuth with real client ID
      // For demo purposes, simulate successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // On success, redirect to dashboard
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('Google registration failed:', error);
      // TODO: Show error message
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff0f5] via-[#ffece6] to-[#f0f8ff] relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-32 right-32 w-80 h-80 bg-purple-200/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 right-1/4 w-56 h-56 bg-pink-200/20 rounded-full blur-2xl"
        />
      </div>

      {/* Animated Gradient Waves */}
      <div className="absolute inset-0 opacity-40">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(242, 107, 56, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 193, 77, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 236, 230, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255, 193, 77, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(242, 107, 56, 0.2) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(255, 236, 230, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 60% 80%, rgba(242, 107, 56, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(255, 193, 77, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(255, 236, 230, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(242, 107, 56, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 193, 77, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 236, 230, 0.4) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Marketing */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20"
        >
          <div className="max-w-lg">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl xl:text-6xl font-bold text-gray-800 mb-6 leading-tight"
            >
              Tham gia CVKing ngay
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-700 mb-12 leading-relaxed"
            >
              Khám phá cơ hội việc làm mơ ước hoặc đăng tin tuyển dụng để tìm kiếm nhân tài xuất sắc.
              Kết nối với cộng đồng chuyên nghiệp hàng đầu tại Việt Nam.
            </motion.p>

            {/* Language Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center space-x-2 mb-8"
            >
              <Globe className="w-5 h-5 text-gray-800" />
              <span className="text-gray-800 text-sm font-medium">Tiếng Việt</span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </motion.div>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex space-x-8 text-sm text-gray-600"
            >
              <motion.a
                href="#"
                className="hover:text-gray-800 transition-colors hover:scale-105 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Điều khoản
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-gray-800 transition-colors hover:scale-105 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Gói dịch vụ
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-gray-800 transition-colors hover:scale-105 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Liên hệ
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-md"
          >
            {/* Form Card with Glassmorphism */}
            <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-10 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Tạo tài khoản
                </h2>
                <p className="text-gray-600">
                  Tham gia cùng hàng nghìn chuyên gia
                </p>
              </motion.div>

              {/* Account Type Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-6"
              >
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 bg-orange-50">
                    <TabsTrigger
                      value="candidate"
                      className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      <User className="h-4 w-4" />
                      Ứng viên
                    </TabsTrigger>
                    <TabsTrigger
                      value="employer"
                      className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      <Building2 className="h-4 w-4" />
                      Nhà tuyển dụng
                    </TabsTrigger>
                    <TabsTrigger
                      value="hr"
                      className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      <Users className="h-4 w-4" />
                      HR
                    </TabsTrigger>
                  </TabsList>

                  {/* Candidate Tab */}
                  <TabsContent value="candidate" className="space-y-6 mt-6">
                    <form onSubmit={(e) => handleRegister(e, candidateForm, 'candidate')} className="space-y-5">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="text"
                            placeholder="Họ và tên"
                            value={candidateForm.fullName}
                            onChange={(e) => setCandidateForm({ ...candidateForm, fullName: e.target.value })}
                            className={`pl-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              candidateErrors.fullName
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                        </div>
                        {candidateErrors.fullName && (
                          <p className="text-red-500 text-sm ml-1">{candidateErrors.fullName}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="email"
                            placeholder="Email"
                            value={candidateForm.email}
                            onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                            className={`pl-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              candidateErrors.email
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                        </div>
                        {candidateErrors.email && (
                          <p className="text-red-500 text-sm ml-1">{candidateErrors.email}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            value={candidateForm.password}
                            onChange={(e) => setCandidateForm({ ...candidateForm, password: e.target.value })}
                            className={`pl-10 pr-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              candidateErrors.password
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {candidateErrors.password && (
                          <p className="text-red-500 text-sm ml-1">{candidateErrors.password}</p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Xác nhận mật khẩu"
                            value={candidateForm.confirmPassword}
                            onChange={(e) => setCandidateForm({ ...candidateForm, confirmPassword: e.target.value })}
                            className={`pl-10 pr-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              candidateErrors.confirmPassword
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {candidateErrors.confirmPassword && (
                          <p className="text-red-500 text-sm ml-1">{candidateErrors.confirmPassword}</p>
                        )}
                      </div>

                      {/* Terms Checkbox */}
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="candidate-terms"
                          checked={candidateForm.agreeToTerms}
                          onCheckedChange={(checked) =>
                            setCandidateForm({ ...candidateForm, agreeToTerms: checked as boolean })
                          }
                          className="border-2 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 mt-1"
                        />
                        <label htmlFor="candidate-terms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                          Tôi đồng ý với{" "}
                          <a href="#" className="text-orange-500 hover:underline">
                            Điều khoản dịch vụ
                          </a>{" "}
                          và{" "}
                          <a href="#" className="text-orange-500 hover:underline">
                            Chính sách bảo mật
                          </a>
                        </label>
                      </div>

                      {/* Register Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-12 bg-[#f26b38] hover:bg-[#e05a27] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Đăng ký tài khoản
                        </Button>
                      </motion.div>
                    </form>
                  </TabsContent>

                  {/* Employer Tab */}
                  <TabsContent value="employer" className="space-y-6 mt-6">
                    <form onSubmit={(e) => handleRegister(e, employerForm, 'employer')} className="space-y-5">
                      {/* Company Name */}
                      <div className="space-y-1">
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="text"
                            placeholder="Tên công ty"
                            value={employerForm.companyName}
                            onChange={(e) => setEmployerForm({ ...employerForm, companyName: e.target.value })}
                            className={`pl-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              employerErrors.companyName
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                        </div>
                        {employerErrors.companyName && (
                          <p className="text-red-500 text-sm ml-1">{employerErrors.companyName}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="email"
                            placeholder="Email công ty"
                            value={employerForm.email}
                            onChange={(e) => setEmployerForm({ ...employerForm, email: e.target.value })}
                            className={`pl-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              employerErrors.email
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                        </div>
                        {employerErrors.email && (
                          <p className="text-red-500 text-sm ml-1">{employerErrors.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="tel"
                            placeholder="Số điện thoại"
                            value={employerForm.phone}
                            onChange={(e) => setEmployerForm({ ...employerForm, phone: e.target.value })}
                            className={`pl-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              employerErrors.phone
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                        </div>
                        {employerErrors.phone && (
                          <p className="text-red-500 text-sm ml-1">{employerErrors.phone}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            value={employerForm.password}
                            onChange={(e) => setEmployerForm({ ...employerForm, password: e.target.value })}
                            className={`pl-10 pr-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              employerErrors.password
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {employerErrors.password && (
                          <p className="text-red-500 text-sm ml-1">{employerErrors.password}</p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Xác nhận mật khẩu"
                            value={employerForm.confirmPassword}
                            onChange={(e) => setEmployerForm({ ...employerForm, confirmPassword: e.target.value })}
                            className={`pl-10 pr-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              employerErrors.confirmPassword
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {employerErrors.confirmPassword && (
                          <p className="text-red-500 text-sm ml-1">{employerErrors.confirmPassword}</p>
                        )}
                      </div>

                      {/* Terms Checkbox */}
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="employer-terms"
                          checked={employerForm.agreeToTerms}
                          onCheckedChange={(checked) =>
                            setEmployerForm({ ...employerForm, agreeToTerms: checked as boolean })
                          }
                          className="border-2 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 mt-1"
                        />
                        <label htmlFor="employer-terms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                          Tôi đồng ý với{" "}
                          <a href="#" className="text-orange-500 hover:underline">
                            Điều khoản dịch vụ
                          </a>
                        </label>
                      </div>

                      {/* Register Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-12 bg-[#f26b38] hover:bg-[#e05a27] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Đăng ký công ty
                        </Button>
                      </motion.div>
                    </form>
                  </TabsContent>

                  {/* HR Tab */}
                  <TabsContent value="hr" className="space-y-6 mt-6">
                    <form onSubmit={(e) => handleRegister(e, hrForm, 'hr')} className="space-y-5">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="text"
                            placeholder="Họ và tên"
                            value={hrForm.fullName}
                            onChange={(e) => setHrForm({ ...hrForm, fullName: e.target.value })}
                            className={`pl-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              hrErrors.fullName
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                        </div>
                        {hrErrors.fullName && (
                          <p className="text-red-500 text-sm ml-1">{hrErrors.fullName}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="email"
                            placeholder="Email"
                            value={hrForm.email}
                            onChange={(e) => setHrForm({ ...hrForm, email: e.target.value })}
                            className={`pl-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              hrErrors.email
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                        </div>
                        {hrErrors.email && (
                          <p className="text-red-500 text-sm ml-1">{hrErrors.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="tel"
                            placeholder="Số điện thoại"
                            value={hrForm.phone}
                            onChange={(e) => setHrForm({ ...hrForm, phone: e.target.value })}
                            className={`pl-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              hrErrors.phone
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                        </div>
                        {hrErrors.phone && (
                          <p className="text-red-500 text-sm ml-1">{hrErrors.phone}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            value={hrForm.password}
                            onChange={(e) => setHrForm({ ...hrForm, password: e.target.value })}
                            className={`pl-10 pr-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              hrErrors.password
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {hrErrors.password && (
                          <p className="text-red-500 text-sm ml-1">{hrErrors.password}</p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Xác nhận mật khẩu"
                            value={hrForm.confirmPassword}
                            onChange={(e) => setHrForm({ ...hrForm, confirmPassword: e.target.value })}
                            className={`pl-10 pr-10 h-12 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-orange-500/20 ${
                              hrErrors.confirmPassword
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-200 focus:border-orange-500'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {hrErrors.confirmPassword && (
                          <p className="text-red-500 text-sm ml-1">{hrErrors.confirmPassword}</p>
                        )}
                      </div>

                      {/* Terms Checkbox */}
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="hr-terms"
                          checked={hrForm.agreeToTerms}
                          onCheckedChange={(checked) =>
                            setHrForm({ ...hrForm, agreeToTerms: checked as boolean })
                          }
                          className="border-2 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 mt-1"
                        />
                        <label htmlFor="hr-terms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                          Tôi đồng ý với{" "}
                          <a href="#" className="text-orange-500 hover:underline">
                            Điều khoản dịch vụ
                          </a>{" "}
                          và{" "}
                          <a href="#" className="text-orange-500 hover:underline">
                            Chính sách bảo mật
                          </a>
                        </label>
                      </div>

                      {/* Register Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-12 bg-[#f26b38] hover:bg-[#e05a27] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Đăng ký tài khoản HR
                        </Button>
                      </motion.div>
                    </form>
                  </TabsContent>
                </Tabs>
              </motion.div>

              {/* Social Login Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">hoặc đăng ký với</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="space-y-3 mb-6"
              >
                <Button
                  onClick={handleGoogleRegister}
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-xl"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Đăng ký với Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-xl"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Đăng ký với Apple
                </Button>
              </motion.div>

              {/* Toggle to Login */}
              <div className="text-center">
                <button
                  onClick={() => window.location.href = '/auth/login'}
                  className="text-orange-500 hover:underline font-medium text-sm"
                >
                  Đã có tài khoản? Đăng nhập ngay
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
