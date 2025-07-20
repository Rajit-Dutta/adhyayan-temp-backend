"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Aarav Sharma",
      email: "aarav@adhyayan.edu",
      grade: "10th",
      section: "A",
      phone: "9876543210",
      rollNo: "2024001",
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@adhyayan.edu",
      grade: "10th",
      section: "B",
      phone: "9876543211",
      rollNo: "2024002",
      status: "Active",
    },
    {
      id: 3,
      name: "Arjun Singh",
      email: "arjun@adhyayan.edu",
      grade: "9th",
      section: "A",
      phone: "9876543212",
      rollNo: "2024003",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Kavya Reddy",
      email: "kavya@adhyayan.edu",
      grade: "11th",
      section: "A",
      phone: "9876543213",
      rollNo: "2024004",
      status: "Active",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterGrade, setFilterGrade] = useState("")

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "admin") {
      router.push("/")
      return
    }
  }, [router])

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = filterGrade === "" || student.grade === filterGrade
    return matchesSearch && matchesGrade
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-2">
              STUDENT MANAGEMENT
            </h1>
            <p className="text-xl font-semibold text-white">Manage all student records and information</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-green-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students by name, email, or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                >
                  <option value="">All Grades</option>
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
                <Button className="bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-black rounded-xl px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg p-6 text-center">
            <Users className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-black text-white">{students.length}</div>
            <div className="text-sm font-semibold text-white/90">Total Students</div>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-black text-black">{students.filter((s) => s.status === "Active").length}</div>
            <div className="text-sm font-semibold text-gray-600">Active Students</div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-black text-white">{new Set(students.map((s) => s.grade)).size}</div>
            <div className="text-sm font-semibold text-white/90">Grade Levels</div>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-black text-black">{new Set(students.map((s) => s.section)).size}</div>
            <div className="text-sm font-semibold text-gray-600">Sections</div>
          </Card>
        </div>

        {/* Students List */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-3xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black flex items-center">
              <Users className="w-6 h-6 mr-3 text-green-600" />
              Student Database ({filteredStudents.length} students)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center">
                      <div className="lg:col-span-2">
                        <h3 className="text-xl font-black text-black mb-1">{student.name}</h3>
                        <p className="font-semibold text-gray-600 mb-1">{student.email}</p>
                        <p className="font-semibold text-green-600 text-sm">Roll: {student.rollNo}</p>
                      </div>
                      <div className="text-center">
                        <span className="bg-green-100 border-2 border-green-300 text-green-700 px-3 py-1 font-black text-sm rounded-lg">
                          {student.grade}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="bg-blue-100 border-2 border-blue-300 text-blue-700 px-3 py-1 font-black text-sm rounded-lg">
                          SEC {student.section}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-700">{student.phone}</p>
                      </div>
                      <div className="text-center">
                        <span
                          className={`px-3 py-1 border-2 font-bold text-sm rounded-lg ${
                            student.status === "Active"
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-red-100 border-red-300 text-red-700"
                          }`}
                        >
                          {student.status}
                        </span>
                      </div>
                      <div className="lg:col-span-2 flex space-x-2">
                        <Button className="bg-green-500 text-white font-bold border-2 border-black text-xs px-3 py-2 rounded-lg hover:bg-green-600 transition-colors">
                          View
                        </Button>
                        <Button className="bg-blue-500 text-white font-bold border-2 border-black text-xs px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                          Edit
                        </Button>
                        <Button className="bg-red-500 text-white font-bold border-2 border-black text-xs px-3 py-2 rounded-lg hover:bg-red-600 transition-colors">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
