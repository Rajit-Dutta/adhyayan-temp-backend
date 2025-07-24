"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  BookOpen,
  LogOut,
  UserCheck,
  FileText,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    fetchUserType();
  }, [router]);

  const fetchUserType = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getUserType`,
        {
          withCredentials: true,
        }
      );
      if (!response) {
        throw new Error("No response from server");
      }
      setUserType(response.data.jwtDecoded.userType);
      console.log(response.data.jwtDecoded);
      let typeOfUser = response.data.jwtDecoded.userType;
      if (typeOfUser === "teacher") {
        router.push(`/teacher/${response.data.jwtDecoded.id}`);
        return null;
      }
      else if (typeOfUser === "admin") {
        router.push("/admin");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user type:", error);
      setUserType(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("teacherData");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminData");
    router.push("/");
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-2">
              ADHYAYAN
            </h1>
            <p className="text-xl font-semibold text-white">Admin Dashboard</p>
            <p className="text-lg font-medium text-gray-300">
              Choose a management area to continue
            </p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-green-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Main Management Areas - Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Student Management */}
          <Card
            className="group relative bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => router.push("/admin/students")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative z-10 text-center pb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-black rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-black text-white mb-2">
                STUDENT MANAGEMENT
              </CardTitle>
              <p className="text-green-100 font-semibold">
                Manage student records and information
              </p>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-white/20 border-2 border-white/30 rounded-xl backdrop-blur-sm">
                  <UserCheck className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">
                    Student Registration
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/20 border-2 border-white/30 rounded-xl backdrop-blur-sm">
                  <FileText className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">Academic Records</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/20 border-2 border-white/30 rounded-xl backdrop-blur-sm">
                  <BarChart3 className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">
                    Performance Tracking
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center text-white font-bold">
                <span>Manage Students</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>

          {/* Teacher Management */}
          <Card
            className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => router.push("/admin/teachers")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative z-10 text-center pb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 border-2 border-black rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-black text-black mb-2">
                TEACHER MANAGEMENT
              </CardTitle>
              <p className="text-gray-600 font-semibold">
                Manage faculty and teaching staff
              </p>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-black border-2 border-green-500 rounded-xl">
                  <GraduationCap className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">
                    Faculty Registration
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-black border-2 border-green-500 rounded-xl">
                  <BookOpen className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">
                    Subject Assignment
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-black border-2 border-green-500 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">
                    Performance Review
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center text-black font-bold">
                <span>Manage Teachers</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Management Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Question Papers */}
          <Card
            className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => router.push("/admin/question-papers")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative z-10 text-center pb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 border-2 border-black rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-black text-black mb-2">
                QUESTION PAPERS
              </CardTitle>
              <p className="text-gray-600 font-semibold">
                Manage examination papers and assessments
              </p>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-black border-2 border-green-500 rounded-xl">
                  <FileText className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">Paper Upload</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-black border-2 border-green-500 rounded-xl">
                  <BookOpen className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">Question Bank</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-black border-2 border-green-500 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">Usage Analytics</span>
                </div>
              </div>
              <div className="flex items-center justify-center text-black font-bold">
                <span>Manage Papers</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>

          {/* Reports & Analytics */}
          <Card
            className="group relative bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => router.push("/admin/reports")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative z-10 text-center pb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-black rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-black text-white mb-2">
                REPORTS & ANALYTICS
              </CardTitle>
              <p className="text-green-100 font-semibold">
                Comprehensive performance insights
              </p>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-white/20 border-2 border-white/30 rounded-xl backdrop-blur-sm">
                  <BarChart3 className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">
                    Performance Reports
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/20 border-2 border-white/30 rounded-xl backdrop-blur-sm">
                  <Users className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">
                    Attendance Analytics
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/20 border-2 border-white/30 rounded-xl backdrop-blur-sm">
                  <FileText className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">Custom Reports</span>
                </div>
              </div>
              <div className="flex items-center justify-center text-white font-bold">
                <span>View Reports</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats - Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg p-6 text-center">
            <Users className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-black text-white">150</div>
            <div className="text-sm font-semibold text-white/90">Students</div>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <GraduationCap className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-black text-black">25</div>
            <div className="text-sm font-semibold text-gray-600">Teachers</div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg p-6 text-center">
            <UserCheck className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-black text-white">12</div>
            <div className="text-sm font-semibold text-white/90">Staff</div>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-black text-black">45</div>
            <div className="text-sm font-semibold text-gray-600">
              Assignments
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
