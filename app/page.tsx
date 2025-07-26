"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, GraduationCap, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [loginType, setLoginType] = useState<"admin" | "teacher" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [showSignup, setShowSignup] = useState(false);
  const [teacherSignupData, setTeacherSignupData] = useState({
    fullName: "",
    subject: "",
    email: "",
    password: "",
    phoneNumber: "",
    classesToTeach: [] as string[],
  });
  const [adminSignupData, setAdminSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [teacherSigninData, setTeacherSigninData] = useState({
    email: "",
    password: "",
  });
  const [adminSigninData, setAdminSigninData] = useState({
    email: "",
    password: "",
  });

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent form reload
    setIsSubmitting(true);
    setError("");

    if (!adminSigninData.email || !adminSigninData.password) {
      setError("Please fill in all required fields!");
      setIsSubmitting(false);
      return;
    }

    try {
      const signInPromise = axios.post(
        `${process.env.NEXT_PUBLIC_ADMIN_DOMAIN!}/signIn`,
        adminSigninData
      );

      const response = await toast.promise(signInPromise, {
        loading: "Loading",
        success: "Log in successful!✅",
        error: "Log in unsuccessful! ❌.",
      });
      await signInPromise;
      window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN!}/admin/${
        response.data.id
      }`;
    } catch (error) {
      console.error("Signup error:", error);
      setError("Signup failed. Please try again later.");
    } finally {
      setIsSubmitting(false); // <-- this was missing
    }
  };
  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent form reload
    setIsSubmitting(true);
    setError("");

    if (!teacherSigninData.email || !teacherSigninData.password) {
      setError("Please fill in all required fields!");
      setIsSubmitting(false);
      return;
    }

    try {
      const signInPromise = axios.post(
        `${process.env.NEXT_PUBLIC_TEACHER_DOMAIN!}/signIn`,
        teacherSigninData
      );

      const response = await toast.promise(signInPromise, {
        loading: "Loading",
        success: "Log in successful!✅",
        error: "Log in unsuccessful! ❌.",
      });
      await signInPromise;

      window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN!}/teacher/${
        response.data.id
      }`;
    } catch (error) {
      console.error("Signup error:", error);
      setError("Signup failed. Please try again later.");
    } finally {
      setIsSubmitting(false); // <-- this was missing
    }
  };

  const handleTeacherSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent form reload
    setIsSubmitting(true);
    setError("");

    if (
      !teacherSignupData.email ||
      !teacherSignupData.password ||
      !teacherSignupData.fullName ||
      !teacherSignupData.subject ||
      !teacherSignupData.phoneNumber
    ) {
      setError("Please fill in all required fields!");
      setIsSubmitting(false);
      return;
    }

    try {
      const signUpPromise = axios.post(
        `${process.env.NEXT_PUBLIC_TEACHER_DOMAIN!}/signUp`,
        teacherSignupData
      );

      const response = await toast.promise(signUpPromise, {
        loading: "Signing up...",
        success: "Sign up successful! ✅",
        error: "Sign up unsuccessful! ❌",
      });

      window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN!}/teacher/${
        response.data.id
      }`;

      setShowSignup(false); // Hide
    } catch (error) {
      console.error("Signup error:", error);
      setError("Signup failed. Please try again later.");
    } finally {
      setIsSubmitting(false); // <-- this was missing
    }
  };

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent form reload
    setIsSubmitting(true);
    setError("");

    if (
      !adminSignupData.email ||
      !adminSignupData.password ||
      !adminSignupData.fullName ||
      !adminSignupData.phoneNumber
    ) {
      setError("Please fill in all required fields!");
      setIsSubmitting(false);
      return;
    }

    try {
      const signUpPromise = axios.post(
        `${process.env.NEXT_PUBLIC_ADMIN_DOMAIN!}/signUp`,
        adminSignupData
      );

      const response = await toast.promise(signUpPromise, {
        loading: "Signing up...",
        success: "Sign up successful! ✅",
        error: "Sign up unsuccessful! ❌",
      });
      window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN!}/admin/${
        response.data.id
      }`;
    } catch (error) {
      console.error("Signup error:", error);
      setError("Signup failed. Please try again later.");
    } finally {
      setIsSubmitting(false); // <-- this was missing
    }
  };

  const handleSignupClassSelection = (className: string) => {
    setTeacherSignupData((prev) => ({
      ...prev,
      classesToTeach: prev.classesToTeach.includes(className)
        ? prev.classesToTeach.filter((c) => c !== className)
        : [...prev.classesToTeach, className],
    }));
  };

  if (!loginType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 border-2 border-white rounded-2xl mb-6 shadow-lg">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-4">
              ADHYAYAN
            </h1>
            <p className="text-xl font-semibold text-gray-300">
              Institution Management System
            </p>
          </div>

          {/* Bento Grid Login Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Admin Login Card */}
            <Card
              className="group relative p-8 bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgb(34,197,94,0.3)] transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => setLoginType("admin")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 border-2 border-black rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-black mb-3">
                  ADMIN ACCESS
                </h2>
                <p className="font-semibold text-gray-600 mb-6">
                  Staff & Management Portal
                </p>
                <div className="flex items-center justify-center text-green-600 font-bold">
                  <span>Enter Admin Panel</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Card>

            {/* Teacher Login Card */}
            <Card
              className="group relative p-8 bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgb(34,197,94,0.4)] transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => setLoginType("teacher")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-black rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-white mb-3">
                  TEACHER ACCESS
                </h2>
                <p className="font-semibold text-green-100 mb-6">
                  Individual Teacher Portal
                </p>
                <div className="flex items-center justify-center text-white font-bold">
                  <span>Enter Teacher Panel</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            className: "neo-brutalism-toast",
            style: {
              color: "white",
              backgroundColor: "var(--background)",
              border: "2px solid var(--border)",
              boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 0.1)",
            },
          }}
        />
        <Card className="p-8 bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-3xl shadow-[0_20px_60px_rgb(34,197,94,0.3)]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 border-2 border-black rounded-2xl mb-6">
              {loginType === "admin" ? (
                <Users className="w-8 h-8 text-white" />
              ) : (
                <GraduationCap className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-black text-black mb-2">
              {loginType === "admin" ? "ADMIN LOGIN" : "TEACHER LOGIN"}
            </h1>
            <p className="text-lg font-semibold text-gray-600">ADHYAYAN</p>
          </div>

          {loginType === "teacher" && !showSignup && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={teacherSigninData.email}
                  onChange={(e) =>
                    setTeacherSigninData({
                      ...teacherSigninData,
                      email: e.target.value,
                    })
                  }
                  className="h-12 border-2 border-gray-300 bg-white text-black font-semibold placeholder:text-gray-400 focus:ring-0 focus:border-green-500 rounded-xl"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={teacherSigninData.password}
                    onChange={(e) =>
                      setTeacherSigninData({
                        ...teacherSigninData,
                        password: e.target.value,
                      })
                    }
                    className="pl-10 h-12 border-2 border-gray-300 bg-white text-black font-semibold placeholder:text-gray-400 focus:ring-0 focus:border-green-500 rounded-xl"
                    placeholder="Enter password"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleTeacherLogin(e)
                    }
                  />
                </div>
                {error && (
                  <p className="text-red-600 font-semibold text-sm mt-2 bg-red-50 border-2 border-red-200 p-3 rounded-xl">
                    {error}
                  </p>
                )}
              </div>

              <Button
                onClick={handleTeacherLogin}
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-black text-lg border-2 border-black rounded-xl shadow-[0_4px_14px_0_rgb(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] hover:translate-y-[-2px] transition-all duration-300"
              >
                Access Teacher Panel
              </Button>

              <div className="text-center">
                <p className="text-gray-600 font-semibold mb-2">New teacher?</p>
                <Button
                  onClick={() => setShowSignup(true)}
                  className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white font-bold border-2 border-black rounded-xl transition-all duration-300"
                >
                  Sign Up as Teacher
                </Button>
              </div>

              <Button
                onClick={() => setLoginType(null)}
                className="w-full h-10 bg-white hover:bg-gray-50 text-black font-bold border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all duration-300"
              >
                ← Back to Login Options
              </Button>
            </div>
          )}

          {loginType === "admin" && !showSignup && (
            <form className="space-y-6" onSubmit={handleAdminLogin}>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={adminSigninData.email}
                  onChange={(e) =>
                    setAdminSigninData({
                      ...adminSigninData,
                      email: e.target.value,
                    })
                  }
                  className="h-12 border-2 border-gray-300 bg-white text-black font-semibold placeholder:text-gray-400 focus:ring-0 focus:border-green-500 rounded-xl"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={adminSigninData.password}
                    onChange={(e) =>
                      setAdminSigninData({
                        ...adminSigninData,
                        password: e.target.value,
                      })
                    }
                    className="pl-10 h-12 border-2 border-gray-300 bg-white text-black font-semibold placeholder:text-gray-400 focus:ring-0 focus:border-green-500 rounded-xl"
                    placeholder="Enter password"
                    onKeyPress={(e) => e.key === "Enter" && handleAdminLogin(e)}
                  />
                </div>
                {error && (
                  <p className="text-red-600 font-semibold text-sm mt-2 bg-red-50 border-2 border-red-200 p-3 rounded-xl">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-12 ${
                  isSubmitting
                    ? "bg-green-300"
                    : "bg-green-500 hover:bg-green-600"
                } text-white font-black text-lg border-2 border-black rounded-xl transition-all duration-300`}
              >
                {isSubmitting ? "Signing In..." : "Access Admin Panel"}
              </Button>

              <div className="text-center">
                <p className="text-gray-600 font-semibold mb-2">
                  New admin/staff member?
                </p>
                <Button
                  onClick={() => setShowSignup(true)}
                  className="w-full h-10 bg-purple-500 hover:bg-purple-600 text-white font-bold border-2 border-black rounded-xl transition-all duration-300"
                >
                  Sign Up as Admin/Staff
                </Button>
              </div>

              <Button
                onClick={() => setLoginType(null)}
                className="w-full h-10 bg-white hover:bg-gray-50 text-black font-bold border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all duration-300"
              >
                ← Back to Login Options
              </Button>
            </form>
          )}

          {loginType === "teacher" && showSignup && (
            <form onSubmit={handleTeacherSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={teacherSignupData.fullName}
                    onChange={(e) =>
                      setTeacherSignupData({
                        ...teacherSignupData,
                        fullName: e.target.value,
                      })
                    }
                    className="h-12 border-2 border-gray-300 bg-white text-black font-semibold placeholder:text-gray-400 focus:ring-0 focus:border-green-500 rounded-xl"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Subject
                  </label>
                  <select
                    value={teacherSignupData.subject}
                    onChange={(e) =>
                      setTeacherSignupData({
                        ...teacherSignupData,
                        subject: e.target.value,
                      })
                    }
                    className="w-full h-12 border-2 border-gray-300 bg-white text-black font-semibold focus:ring-0 focus:border-green-500 rounded-xl"
                  >
                    <option value="">Select</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Physics">Physics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={teacherSignupData.email}
                  onChange={(e) =>
                    setTeacherSignupData({
                      ...teacherSignupData,
                      email: e.target.value,
                    })
                  }
                  className="h-12 border-2 border-gray-300 bg-white text-black font-semibold placeholder:text-gray-400 focus:ring-0 focus:border-green-500 rounded-xl"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={teacherSignupData.password}
                    onChange={(e) =>
                      setTeacherSignupData({
                        ...teacherSignupData,
                        password: e.target.value,
                      })
                    }
                    className="pl-10 h-12 border-2 border-gray-300 bg-white text-black font-semibold placeholder:text-gray-400 focus:ring-0 focus:border-green-500 rounded-xl"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={teacherSignupData.phoneNumber}
                  onChange={(e) =>
                    setTeacherSignupData({
                      ...teacherSignupData,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="h-12 border-2 border-gray-300 bg-white text-black font-semibold placeholder:text-gray-400 focus:ring-0 focus:border-green-500 rounded-xl"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Classes You'll Teach
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["6", "7", "8", "9", "10", "11", "12", "Others"].map(
                    (className) => (
                      <div
                        key={className}
                        onClick={() => handleSignupClassSelection(className)}
                        className={`p-2 border-2 font-bold text-center cursor-pointer rounded-lg transition-all duration-300 text-sm ${
                          teacherSignupData.classesToTeach.includes(className)
                            ? "bg-green-500 text-white border-green-600"
                            : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {className}
                      </div>
                    )
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected:{" "}
                  {teacherSignupData.classesToTeach.length > 0
                    ? teacherSignupData.classesToTeach.join(", ")
                    : "None (can be assigned later)"}
                </p>
              </div>

              {error && (
                <p className="text-red-600 font-semibold text-sm bg-red-50 border-2 border-red-200 p-3 rounded-xl">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-12 ${
                  isSubmitting
                    ? "bg-green-300"
                    : "bg-green-500 hover:bg-green-600"
                } text-white font-black text-lg border-2 border-black rounded-xl transition-all duration-300`}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up as Teacher"}
              </Button>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowSignup(false)}
                  className="flex-1 h-10 bg-white hover:bg-gray-50 text-black font-bold border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all duration-300"
                >
                  ← Back to Login
                </Button>
                <Button
                  onClick={() => setLoginType(null)}
                  className="flex-1 h-10 bg-gray-500 hover:bg-gray-600 text-white font-bold border-2 border-gray-700 rounded-xl transition-all duration-300"
                >
                  Login Options
                </Button>
              </div>
            </form>
          )}

          {loginType === "admin" && showSignup && (
            <form className="space-y-6" onSubmit={handleAdminSignup}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={adminSignupData.fullName}
                    onChange={(e) =>
                      setAdminSignupData({
                        ...adminSignupData,
                        fullName: e.target.value,
                      })
                    }
                    className="h-12 border-2 border-gray-300 bg-white text-black font-semibold placeholder:text-gray-400 focus:ring-0 focus:border-green-500 rounded-xl"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={adminSignupData.email}
                  onChange={(e) =>
                    setAdminSignupData({
                      ...adminSignupData,
                      email: e.target.value,
                    })
                  }
                  className="h-12 border-2 border-gray-300 bg-white text-black font-semibold placeholder:text-gray-400 focus:ring-0 focus:border-green-500 rounded-xl"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={adminSignupData.password}
                    onChange={(e) =>
                      setAdminSignupData({
                        ...adminSignupData,
                        password: e.target.value,
                      })
                    }
                    className="pl-10 h-12 border-2 border-gray-300 bg-white text-black font-semibold placeholder:text-gray-400 focus:ring-0 focus:border-green-500 rounded-xl"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={adminSignupData.phoneNumber}
                  onChange={(e) =>
                    setAdminSignupData({
                      ...adminSignupData,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="h-12 border-2 border-gray-300 bg-white text-black font-semibold placeholder:text-gray-400 focus:ring-0 focus:border-green-500 rounded-xl"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {error && (
                <p className="text-red-600 font-semibold text-sm bg-red-50 border-2 border-red-200 p-3 rounded-xl">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-12 ${
                  isSubmitting
                    ? "bg-green-300"
                    : "bg-green-500 hover:bg-green-600"
                } text-white font-black text-lg border-2 border-black rounded-xl transition-all duration-300`}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up as Admin/Staff"}
              </Button>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowSignup(false)}
                  className="flex-1 h-10 bg-white hover:bg-gray-50 text-black font-bold border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all duration-300"
                >
                  ← Back to Login
                </Button>
                <Button
                  onClick={() => setLoginType(null)}
                  className="flex-1 h-10 bg-gray-500 hover:bg-gray-600 text-white font-bold border-2 border-gray-700 rounded-xl transition-all duration-300"
                >
                  Login Options
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
