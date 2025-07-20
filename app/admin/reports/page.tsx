"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, TrendingUp, Users, FileText, Download, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ReportsPage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "admin") {
      router.push("/")
      return
    }
  }, [router])

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-2">
              REPORTS & ANALYTICS
            </h1>
            <p className="text-xl font-semibold text-white">Comprehensive institutional performance insights</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border-2 border-green-500 rounded-xl font-semibold bg-white text-black focus:border-green-600 focus:ring-0"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-green-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg p-6 text-center">
            <Users className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-black text-white">{reportData.students.total}</div>
            <div className="text-sm font-semibold text-white/90">Total Students</div>
            <div className="text-xs text-white/80 mt-1">+{reportData.students.newThisMonth} this month</div>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-black text-black">{reportData.teachers.total}</div>
            <div className="text-sm font-semibold text-gray-600">Faculty Members</div>
            <div className="text-xs text-gray-500 mt-1">+{reportData.teachers.newThisMonth} this month</div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg p-6 text-center">
            <FileText className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-black text-white">{reportData.assignments.total}</div>
            <div className="text-sm font-semibold text-white/90">Assignments</div>
            <div className="text-xs text-white/80 mt-1">{reportData.assignments.active} active</div>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-black text-black">{reportData.assignments.averageGrade}</div>
            <div className="text-sm font-semibold text-gray-600">Average Grade</div>
            <div className="text-xs text-gray-500 mt-1">{reportData.assignments.submissions} submissions</div>
          </Card>
        </div>

        {/* Detailed Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Student Distribution */}
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-3xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-black flex items-center">
                <Users className="w-6 h-6 mr-3 text-green-600" />
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
                      <span className="bg-green-500 text-white font-black px-3 py-1 rounded-lg text-sm">
                        {grade} Grade
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-black">{count}</div>
                      <div className="text-sm font-semibold text-gray-600">students</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Teacher Distribution */}
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-3xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-white flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-white" />
                Faculty by Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(reportData.teachers.subjectDistribution).map(([subject, count]) => (
                  <div
                    key={subject}
                    className="flex items-center justify-between p-4 bg-white/20 border-2 border-white/30 rounded-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="bg-white text-green-600 font-black px-3 py-1 rounded-lg text-sm">{subject}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">{count}</div>
                      <div className="text-sm font-semibold text-white/90">teachers</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-black text-black">Assignment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total Assignments</span>
                  <span className="font-black text-black">{reportData.assignments.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Active</span>
                  <span className="font-black text-green-600">{reportData.assignments.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Completed</span>
                  <span className="font-black text-blue-600">{reportData.assignments.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Submissions</span>
                  <span className="font-black text-purple-600">{reportData.assignments.submissions}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-black text-white">Question Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white/90">Total Papers</span>
                  <span className="font-black text-white">{reportData.questionPapers.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white/90">Published</span>
                  <span className="font-black text-white">{reportData.questionPapers.published}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white/90">Draft</span>
                  <span className="font-black text-white">{reportData.questionPapers.draft}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white/90">Downloads</span>
                  <span className="font-black text-white">{reportData.questionPapers.downloads}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-black text-black">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-black rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Export Full Report
                </Button>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold border-2 border-black rounded-xl">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Report
                </Button>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold border-2 border-black rounded-xl">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Custom Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-3xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black flex items-center">
              <FileText className="w-6 h-6 mr-3 text-green-600" />
              Recent Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-black text-black mb-4">Top Performing Classes</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-100 border-2 border-green-300 rounded-xl">
                    <span className="font-semibold text-green-700">10th Grade A</span>
                    <span className="font-black text-green-600">92% avg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-100 border-2 border-blue-300 rounded-xl">
                    <span className="font-semibold text-blue-700">11th Grade B</span>
                    <span className="font-black text-blue-600">89% avg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-100 border-2 border-purple-300 rounded-xl">
                    <span className="font-semibold text-purple-700">9th Grade A</span>
                    <span className="font-black text-purple-600">87% avg</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-black mb-4">Most Active Teachers</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-yellow-100 border-2 border-yellow-300 rounded-xl">
                    <span className="font-semibold text-yellow-700">Dr. Rajesh Kumar</span>
                    <span className="font-black text-yellow-600">15 assignments</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-pink-100 border-2 border-pink-300 rounded-xl">
                    <span className="font-semibold text-pink-700">Prof. Sunita Sharma</span>
                    <span className="font-black text-pink-600">12 assignments</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-indigo-100 border-2 border-indigo-300 rounded-xl">
                    <span className="font-semibold text-indigo-700">Ms. Kavita Singh</span>
                    <span className="font-black text-indigo-600">10 assignments</span>
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
