"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, TrendingUp, Users, FileText, Download, Calendar, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function ReportsPage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")

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
      if (userType === "admin" && adminPayload) {
        const parsedAdmin = adminPayload;
        console.log("Admin member logged in:", parsedAdmin);
      }
    } catch (error) {
      console.error("Error during admin dashboard data fetch:", error);
    }
  };

  const reportData = {
    students: {
      total: 150,
      active: 145,
      inactive: 5,
      newThisMonth: 12,
      gradeDistribution: {
        "9th": 35,
        "10th": 40,
        "11th": 38,
        "12th": 37,
      },
    },
    teachers: {
      total: 25,
      active: 23,
      onLeave: 2,
      newThisMonth: 2,
      subjectDistribution: {
        Mathematics: 4,
        Science: 6,
        English: 5,
        History: 3,
        Others: 7,
      },
    },
    assignments: {
      total: 45,
      active: 28,
      completed: 17,
      submissions: 1250,
      averageGrade: "B+",
    },
    questionPapers: {
      total: 85,
      published: 72,
      draft: 13,
      downloads: 2340,
      mostDownloaded: "Mathematics Mid-Term Exam",
    },
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-green-500 border-b-2 border-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-black text-white">REPORTS & ANALYTICS</h1>
                <p className="text-lg font-bold text-green-100">Comprehensive institutional performance insights</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="pl-12 pr-8 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none bg-white"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <Button className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl">
                <Download className="w-5 h-5 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center hover:bg-green-600 transition-colors">
            <Users className="w-10 h-10 text-white mx-auto mb-3" />
            <div className="text-4xl font-black text-white">{reportData.students.total}</div>
            <div className="text-sm font-bold text-green-100">Total Students</div>
            <div className="text-xs text-green-200 mt-1">+{reportData.students.newThisMonth} this month</div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-4xl font-black text-black">{reportData.teachers.total}</div>
            <div className="text-sm font-bold text-gray-700">Faculty Members</div>
            <div className="text-xs text-gray-600 mt-1">+{reportData.teachers.newThisMonth} this month</div>
          </Card>
          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center hover:bg-green-600 transition-colors">
            <FileText className="w-10 h-10 text-white mx-auto mb-3" />
            <div className="text-4xl font-black text-white">{reportData.assignments.total}</div>
            <div className="text-sm font-bold text-green-100">Assignments</div>
            <div className="text-xs text-green-200 mt-1">{reportData.assignments.active} active</div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-4xl font-black text-black">{reportData.assignments.averageGrade}</div>
            <div className="text-sm font-bold text-gray-700">Average Grade</div>
            <div className="text-xs text-gray-600 mt-1">{reportData.assignments.submissions} submissions</div>
          </Card>
        </div>

        {/* Detailed Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Student Distribution */}
          <Card className="bg-white border-2 border-green-500 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-black text-black flex items-center">
                <Users className="w-8 h-8 mr-4 text-green-600" />
                Student Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(reportData.students.gradeDistribution).map(([grade, count]) => (
                  <div
                    key={grade}
                    className="flex items-center justify-between p-4 bg-gray-100 border-2 border-gray-300 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="bg-green-500 text-white font-black px-4 py-2 rounded-xl text-sm border-2 border-black">
                        {grade} Grade
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-black">{count}</div>
                      <div className="text-sm font-bold text-gray-600">students</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Teacher Distribution */}
          <Card className="bg-green-500 border-2 border-white rounded-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-black text-white flex items-center">
                <TrendingUp className="w-8 h-8 mr-4 text-white" />
                Faculty by Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(reportData.teachers.subjectDistribution).map(([subject, count]) => (
                  <div
                    key={subject}
                    className="flex items-center justify-between p-4 bg-white/20 border border-white/30 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="bg-white text-green-600 font-black px-4 py-2 rounded-xl text-sm border-2 border-white">
                        {subject}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-white">{count}</div>
                      <div className="text-sm font-bold text-white/90">teachers</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-2 border-green-500 rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-black">Assignment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700">Total Assignments</span>
                  <span className="font-black text-black text-xl">{reportData.assignments.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700">Active</span>
                  <span className="font-black text-green-600 text-xl">{reportData.assignments.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700">Completed</span>
                  <span className="font-black text-green-600 text-xl">{reportData.assignments.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700">Submissions</span>
                  <span className="font-black text-green-600 text-xl">{reportData.assignments.submissions}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-500 border-2 border-white rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-white">Question Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white/90">Total Papers</span>
                  <span className="font-black text-white text-xl">{reportData.questionPapers.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white/90">Published</span>
                  <span className="font-black text-white text-xl">{reportData.questionPapers.published}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white/90">Draft</span>
                  <span className="font-black text-white text-xl">{reportData.questionPapers.draft}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white/90">Downloads</span>
                  <span className="font-black text-white text-xl">{reportData.questionPapers.downloads}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-green-500 rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-black">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black rounded-xl">
                  <Download className="w-5 h-5 mr-2" />
                  Export Full Report
                </Button>
                <Button className="w-full bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Report
                </Button>
                <Button className="w-full bg-black hover:bg-gray-800 text-white font-black border-2 border-gray-300 rounded-xl">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Custom Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white border-2 border-green-500 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-black flex items-center">
              <FileText className="w-8 h-8 mr-4 text-green-600" />
              Recent Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-black text-black mb-6">Top Performing Classes</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-100 border-2 border-green-300 rounded-xl">
                    <span className="font-bold text-green-700 text-lg">10th Grade A</span>
                    <span className="font-black text-green-600 text-xl">92% avg</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-100 border-2 border-green-300 rounded-xl">
                    <span className="font-bold text-green-700 text-lg">11th Grade B</span>
                    <span className="font-black text-green-600 text-xl">89% avg</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-100 border-2 border-green-300 rounded-xl">
                    <span className="font-bold text-green-700 text-lg">9th Grade A</span>
                    <span className="font-black text-green-600 text-xl">87% avg</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-black mb-6">Most Active Teachers</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300 rounded-xl">
                    <span className="font-bold text-gray-700 text-lg">Dr. Rajesh Kumar</span>
                    <span className="font-black text-gray-600 text-xl">15 assignments</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300 rounded-xl">
                    <span className="font-bold text-gray-700 text-lg">Prof. Sunita Sharma</span>
                    <span className="font-black text-gray-600 text-xl">12 assignments</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300 rounded-xl">
                    <span className="font-bold text-gray-700 text-lg">Ms. Kavita Singh</span>
                    <span className="font-black text-gray-600 text-xl">10 assignments</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
