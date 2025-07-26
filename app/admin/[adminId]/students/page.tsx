"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Plus, Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

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
      avatar: "AS",
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
      avatar: "PP",
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
      avatar: "AS",
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
      avatar: "KR",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterGrade, setFilterGrade] = useState("")

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

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = filterGrade === "" || student.grade === filterGrade
    return matchesSearch && matchesGrade
  })

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
                <h1 className="text-3xl font-black text-white">STUDENT MANAGEMENT</h1>
                <p className="text-lg font-bold text-green-100">Manage all student records and information</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl">
                <Download className="w-5 h-5 mr-2" />
                Export
              </Button>
              <Button className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                Add Student
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filter Bar */}
        <Card className="bg-white border-2 border-green-500 rounded-xl mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search students by name, email, or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-black rounded-xl font-bold text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <select
                    value={filterGrade}
                    onChange={(e) => setFilterGrade(e.target.value)}
                    className="pl-12 pr-8 py-4 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none bg-white"
                  >
                    <option value="">All Grades</option>
                    <option value="9th">9th Grade</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center hover:bg-green-600 transition-colors">
            <Users className="w-10 h-10 text-white mx-auto mb-3" />
            <div className="text-4xl font-black text-white">{students.length}</div>
            <div className="text-sm font-bold text-green-100">Total Students</div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <div className="text-4xl font-black text-black">{students.filter((s) => s.status === "Active").length}</div>
            <div className="text-sm font-bold text-gray-700">Active Students</div>
          </Card>
          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center hover:bg-green-600 transition-colors">
            <div className="text-4xl font-black text-white">{new Set(students.map((s) => s.grade)).size}</div>
            <div className="text-sm font-bold text-green-100">Grade Levels</div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <div className="text-4xl font-black text-black">{new Set(students.map((s) => s.section)).size}</div>
            <div className="text-sm font-bold text-gray-700">Sections</div>
          </Card>
        </div>

        {/* Students List */}
        <Card className="bg-white border-2 border-green-500 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-black flex items-center">
              <Users className="w-8 h-8 mr-4 text-green-600" />
              Student Database ({filteredStudents.length} students)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className="bg-gray-50 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center">
                      <div className="lg:col-span-2 flex items-center space-x-4">
                        <div className="w-16 h-16 bg-green-500 border-2 border-black rounded-xl flex items-center justify-center">
                          <span className="text-white font-black text-lg">{student.avatar}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-black mb-1">{student.name}</h3>
                          <p className="text-gray-600 font-bold text-sm mb-1">{student.email}</p>
                          <p className="text-green-600 font-black text-sm">Roll: {student.rollNo}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="bg-green-100 border-2 border-green-300 text-green-700 px-4 py-2 font-black text-sm rounded-xl">
                          {student.grade}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 font-black text-sm rounded-xl">
                          SEC {student.section}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700 font-bold">{student.phone}</p>
                      </div>
                      <div className="text-center">
                        <span
                          className={`px-4 py-2 border-2 font-black text-sm rounded-xl ${
                            student.status === "Active"
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-red-100 border-red-300 text-red-700"
                          }`}
                        >
                          {student.status}
                        </span>
                      </div>
                      <div className="lg:col-span-2 flex space-x-2">
                        <Button className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black text-xs px-3 py-2 rounded-xl">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black text-xs px-3 py-2 rounded-xl">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button className="bg-black hover:bg-gray-800 text-white font-black border-2 border-gray-300 text-xs px-3 py-2 rounded-xl">
                          <Trash2 className="w-4 h-4 mr-1" />
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
