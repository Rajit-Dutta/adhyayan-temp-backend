"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Eye, Edit, Trash2, Users, BookOpen, LogOut, Calendar, Clock, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock assignments data for each teacher
const TEACHER_ASSIGNMENTS = {
  T001: [
    {
      id: 1,
      title: "Algebra Fundamentals",
      subject: "Mathematics",
      dueDate: "2024-01-15",
      status: "Active",
      submittedCount: 18,
      totalStudents: 25,
      gradedCount: 12,
      classes: ["10A", "10B"],
    },
    {
      id: 2,
      title: "Quadratic Equations",
      subject: "Mathematics",
      dueDate: "2024-01-20",
      status: "Draft",
      submittedCount: 0,
      totalStudents: 30,
      gradedCount: 0,
      classes: ["9A"],
    },
  ],
  T002: [
    {
      id: 3,
      title: "Chemical Reactions Lab",
      subject: "Science",
      dueDate: "2024-01-12",
      status: "Completed",
      submittedCount: 22,
      totalStudents: 22,
      gradedCount: 22,
      classes: ["9A", "9B"],
    },
    {
      id: 4,
      title: "Physics Motion Study",
      subject: "Science",
      dueDate: "2024-01-18",
      status: "Active",
      submittedCount: 15,
      totalStudents: 28,
      gradedCount: 8,
      classes: ["10A"],
    },
  ],
  T003: [
    {
      id: 5,
      title: "Shakespeare Essay",
      subject: "English",
      dueDate: "2024-01-22",
      status: "Active",
      submittedCount: 20,
      totalStudents: 25,
      gradedCount: 15,
      classes: ["11A", "11B"],
    },
  ],
  T004: [
    {
      id: 6,
      title: "World War II Analysis",
      subject: "History",
      dueDate: "2024-01-25",
      status: "Active",
      submittedCount: 12,
      totalStudents: 20,
      gradedCount: 5,
      classes: ["10B", "11A"],
    },
  ],
}

export default function TeacherDashboard() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [assignments, setAssignments] = useState<any[]>([])

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const teacherData = localStorage.getItem("teacherData")
    const teacherId = localStorage.getItem("teacherId")

    if (userType !== "teacher" || !teacherData || !teacherId) {
      router.push("/")
      return
    }

    const parsedTeacher = JSON.parse(teacherData)
    setTeacher(parsedTeacher)
    setAssignments(TEACHER_ASSIGNMENTS[teacherId as keyof typeof TEACHER_ASSIGNMENTS] || [])
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("teacherId")
    localStorage.removeItem("teacherData")
    router.push("/")
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </div>
    )
  }

  const getSubjectColor = (subject: string) => {
    const colors = {
      Mathematics: "from-blue-500 to-blue-600",
      Science: "from-green-500 to-green-600",
      English: "from-purple-500 to-purple-600",
      History: "from-orange-500 to-orange-600",
    }
    return colors[subject as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-2">
              Welcome, {teacher.name.split(" ")[0]}
            </h1>
            <p className="text-xl font-semibold text-white">{teacher.subject} Teacher Dashboard</p>
            <p className="text-lg font-medium text-gray-300">Classes: {teacher.classes.join(", ")}</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-green-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold border-2 border-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards - Bento Style */}
          <Card
            className={`bg-gradient-to-br ${getSubjectColor(teacher.subject)} border-2 border-white rounded-2xl shadow-lg p-6 text-center`}
          >
            <BookOpen className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-black text-white">{assignments.length}</div>
            <div className="text-sm font-semibold text-white/90">Total Assignments</div>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-black text-black">
              {assignments.filter((a) => a.status === "Active").length}
            </div>
            <div className="text-sm font-semibold text-gray-600">Active Assignments</div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg p-6 text-center">
            <Users className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-black text-white">
              {assignments.reduce((sum, a) => sum + a.submittedCount, 0)}
            </div>
            <div className="text-sm font-semibold text-white/90">Submissions</div>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-black text-black">
              {assignments.reduce((sum, a) => sum + a.gradedCount, 0)}
            </div>
            <div className="text-sm font-semibold text-gray-600">Graded</div>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/teacher/create-assignment")}
            className="bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-white rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Assignment
          </Button>
        </div>

        {/* Assignments List - Bento Grid */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-3xl shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-black text-black flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-green-600" />
              Your Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl font-bold text-gray-600 mb-2">No assignments created yet</p>
                <p className="text-gray-500">Click "Create New Assignment" to get started</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {assignments.map((assignment) => (
                  <Card
                    key={assignment.id}
                    className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                        <div className="lg:col-span-2">
                          <h3 className="text-xl font-black text-black mb-1">{assignment.title}</h3>
                          <p className="font-semibold text-gray-600 mb-1">{assignment.subject}</p>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due: {assignment.dueDate}
                          </div>
                          <p className="font-semibold text-green-600 text-sm mt-1">
                            Classes: {assignment.classes.join(", ")}
                          </p>
                        </div>

                        <div className="text-center">
                          <span
                            className={`px-3 py-1 border-2 font-bold text-sm rounded-lg ${
                              assignment.status === "Active"
                                ? "bg-green-100 border-green-300 text-green-700"
                                : assignment.status === "Completed"
                                  ? "bg-blue-100 border-blue-300 text-blue-700"
                                  : "bg-yellow-100 border-yellow-300 text-yellow-700"
                            }`}
                          >
                            {assignment.status}
                          </span>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="font-black text-lg">
                              {assignment.submittedCount}/{assignment.totalStudents}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-gray-500">Submitted</p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <BookOpen className="w-4 h-4 text-gray-600" />
                            <span className="font-black text-lg">
                              {assignment.gradedCount}/{assignment.submittedCount}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-gray-500">Graded</p>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => router.push(`/teacher/assignment/${assignment.id}`)}
                            className="bg-green-500 text-white font-bold border-2 border-black text-xs px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button className="bg-blue-500 text-white font-bold border-2 border-black text-xs px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button className="bg-red-500 text-white font-bold border-2 border-black text-xs px-3 py-2 rounded-lg hover:bg-red-600 transition-colors">
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
