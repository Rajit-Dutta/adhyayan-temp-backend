"use client";

import { useState, useEffect } from "react";
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
  Layers,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { usePathname } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getUserType`,
        {
          withCredentials: true,
        }
      );

      console.log("User data:", userRes.data);

      const { userType, email } = userRes.data.jwtDecoded;

      if (userType !== "admin") {
        router.push("/");
        return;
      }

      if (!userType) {
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-white text-xl font-semibold">
              Something went wrong (404)
            </div>
          </div>
        );
      }

      if (userType === "teacher") {
        router.push("/teacher");
        return null;
      }

      const adminRes = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getAdminData`,
        {
          params: { email },
        }
      );

      const adminPayload = adminRes.data.teacherData;
      setAdmin(adminPayload); // Assuming this is the parsed object already
      if (userType === "admin" && adminPayload) {
        const parsedAdmin = adminPayload;
        console.log("Admin member logged in:", parsedAdmin);
      }
    } catch (error) {
      console.error("Error during admin dashboard data fetch:", error);
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

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-green-500 border-b-2 border-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white border-2 border-black rounded-xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">ADHYAYAN</h1>
                <p className="text-lg font-bold text-green-100">
                  Admin Dashboard
                </p>
                <p className="text-sm font-semibold text-green-200">
                  Welcome back, {admin?.fullName?.split(" ")[0] || "Admin"}!
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="pl-12 pr-4 py-3 bg-white border-2 border-black rounded-xl font-bold text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <Button className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl">
                <Bell className="w-5 h-5" />
              </Button>
              <Button className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl">
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-black hover:bg-gray-800 text-white font-black border-2 border-white rounded-xl"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-white border-2 border-green-500 rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black text-black mb-2">
                    Ready to manage your institution? 🚀
                  </h2>
                  <p className="text-xl font-bold text-gray-800 mb-4">
                    {admin?.role || "Administrator"} •{" "}
                    {admin?.department || "Administration"}
                  </p>
                  <div className="flex items-center space-x-6 text-sm font-bold text-gray-700">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>System Status: All Good ✅</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-green-500 border-2 border-black rounded-full flex items-center justify-center">
                    <GraduationCap className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center hover:bg-green-600 transition-colors">
            <Users className="w-10 h-10 text-white mx-auto mb-3" />
            <div className="text-4xl font-black text-white">150</div>
            <div className="text-sm font-bold text-green-100">Students</div>
          </Card>

          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <GraduationCap className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-4xl font-black text-black">25</div>
            <div className="text-sm font-bold text-gray-700">Teachers</div>
          </Card>

          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center hover:bg-green-600 transition-colors">
            <Layers className="w-10 h-10 text-white mx-auto mb-3" />
            <div className="text-4xl font-black text-white">8</div>
            <div className="text-sm font-bold text-green-100">Batches</div>
          </Card>

          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <FileText className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-4xl font-black text-black">45</div>
            <div className="text-sm font-bold text-gray-700">Papers</div>
          </Card>

          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center hover:bg-green-600 transition-colors">
            <BarChart3 className="w-10 h-10 text-white mx-auto mb-3" />
            <div className="text-4xl font-black text-white">92%</div>
            <div className="text-sm font-bold text-green-100">Performance</div>
          </Card>
        </div>

        {/* Main Management Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Student Management */}
          <Card
            className="group relative bg-green-500 border-2 border-white rounded-2xl overflow-hidden cursor-pointer hover:bg-green-600 transition-colors"
            onClick={() => router.push(`${pathname}/students`)}
          >
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="w-20 h-20 bg-white border-2 border-black rounded-xl flex items-center justify-center">
                  <Users className="w-10 h-10 text-green-600" />
                </div>
                <ArrowRight className="w-8 h-8 text-white group-hover:translate-x-2 transition-transform duration-300" />
              </div>
              <CardTitle className="text-3xl font-black text-white mb-2">
                STUDENT MANAGEMENT
              </CardTitle>
              <p className="text-lg font-bold text-green-100">
                Manage student records and academic information
              </p>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-4 p-4 bg-white/20 border border-white/30 rounded-xl">
                  <UserCheck className="w-6 h-6 text-white" />
                  <span className="font-bold text-white">
                    Registration & Enrollment
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/20 border border-white/30 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                  <span className="font-bold text-white">Academic Records</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/20 border border-white/30 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                  <span className="font-bold text-white">
                    Performance Analytics
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Management */}
          <Card
            className="group relative bg-white border-2 border-green-500 rounded-2xl overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => router.push(`${pathname}/teachers`)}
          >
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="w-20 h-20 bg-green-500 border-2 border-black rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <ArrowRight className="w-8 h-8 text-black group-hover:translate-x-2 transition-transform duration-300" />
              </div>
              <CardTitle className="text-3xl font-black text-black mb-2">
                TEACHER MANAGEMENT
              </CardTitle>
              <p className="text-lg font-bold text-gray-700">
                Manage faculty and teaching staff
              </p>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-4 p-4 bg-black border border-gray-300 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                  <span className="font-bold text-white">
                    Faculty Registration
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-black border border-gray-300 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                  <span className="font-bold text-white">
                    Subject Assignment
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-black border border-gray-300 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                  <span className="font-bold text-white">
                    Performance Review
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Management Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Batch Management */}
          <Card
            className="group relative bg-green-500 border-2 border-white rounded-2xl overflow-hidden cursor-pointer hover:bg-green-600 transition-colors"
            onClick={() => router.push(`${pathname}/batches`)}
          >
            <CardHeader className="relative z-10 text-center pb-4">
              <div className="w-16 h-16 bg-white border-2 border-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-black text-white mb-2">
                BATCH MANAGEMENT
              </CardTitle>
              <p className="text-sm font-bold text-green-100">
                Organize students into subject-specific groups
              </p>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/20 border border-white/30 rounded-xl">
                  <span className="text-white text-sm font-bold">
                    Active Batches
                  </span>
                  <span className="text-white font-black text-lg">6</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/20 border border-white/30 rounded-xl">
                  <span className="text-white text-sm font-bold">
                    Total Students
                  </span>
                  <span className="text-white font-black text-lg">142</span>
                </div>
              </div>
              <div className="flex items-center justify-center mt-4 text-white font-black">
                <span>Manage Batches</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>

          {/* Question Papers */}
          <Card
            className="group relative bg-white border-2 border-green-500 rounded-2xl overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => router.push(`${pathname}/question-papers`)}
          >
            <CardHeader className="relative z-10 text-center pb-4">
              <div className="w-16 h-16 bg-green-500 border-2 border-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-black text-black mb-2">
                QUESTION PAPERS
              </CardTitle>
              <p className="text-sm font-bold text-gray-700">
                Manage examination papers and assessments
              </p>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-black border border-gray-300 rounded-xl">
                  <span className="text-white text-sm font-bold">
                    Published
                  </span>
                  <span className="text-white font-black text-lg">32</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black border border-gray-300 rounded-xl">
                  <span className="text-white text-sm font-bold">
                    Downloads
                  </span>
                  <span className="text-white font-black text-lg">1.2k</span>
                </div>
              </div>
              <div className="flex items-center justify-center mt-4 text-black font-black">
                <span>Manage Papers</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>

          {/* Reports & Analytics */}
          <Card
            className="group relative bg-green-500 border-2 border-white rounded-2xl overflow-hidden cursor-pointer hover:bg-green-600 transition-colors"
            onClick={() => router.push(`${pathname}/reports`)}
          >
            <CardHeader className="relative z-10 text-center pb-4">
              <div className="w-16 h-16 bg-white border-2 border-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-black text-white mb-2">
                REPORTS & ANALYTICS
              </CardTitle>
              <p className="text-sm font-bold text-green-100">
                Comprehensive performance insights
              </p>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/20 border border-white/30 rounded-xl">
                  <span className="text-white text-sm font-bold">
                    Avg Performance
                  </span>
                  <span className="text-white font-black text-lg">92%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/20 border border-white/30 rounded-xl">
                  <span className="text-white text-sm font-bold">
                    Reports Generated
                  </span>
                  <span className="text-white font-black text-lg">156</span>
                </div>
              </div>
              <div className="flex items-center justify-center mt-4 text-white font-black">
                <span>View Reports</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
