"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, GraduationCap, Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TeachersPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      email: "rajesh@adhyayan.edu",
      subject: "Mathematics",
      phone: "9876543200",
      empId: "EMP001",
      status: "Active",
      classes: ["10A", "10B", "9A"],
      experience: "15 years",
    },
    {
      id: 2,
      name: "Prof. Sunita Sharma",
      email: "sunita@adhyayan.edu",
      subject: "Science",
      phone: "9876543201",
      empId: "EMP002",
      status: "Active",
      classes: ["9A", "9B", "10A"],
      experience: "12 years",
    },
    {
      id: 3,
      name: "Ms. Kavita Singh",
      email: "kavita@adhyayan.edu",
      subject: "English",
      phone: "9876543202",
      empId: "EMP003",
      status: "Active",
      classes: ["11A", "11B", "12A"],
      experience: "8 years",
    },
    {
      id: 4,
      name: "Mr. Amit Verma",
      email: "amit@adhyayan.edu",
      subject: "History",
      phone: "9876543203",
      empId: "EMP004",
      status: "On Leave",
      classes: ["10B", "11A", "12B"],
      experience: "10 years",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubject, setFilterSubject] = useState("")

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "admin") {
      router.push("/")
      return
    }
  }, [router])

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.empId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = filterSubject === "" || teacher.subject === filterSubject
    return matchesSearch && matchesSubject
  })

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
              TEACHER MANAGEMENT
            </h1>
            <p className="text-xl font-semibold text-white">Manage faculty and teaching staff</p>
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
                  placeholder="Search teachers by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                >
                  <option value="">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
                <Button className="bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-black rounded-xl px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Teacher
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg p-6 text-center">
            <GraduationCap className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-black text-white">{teachers.length}</div>
            <div className="text-sm font-semibold text-white/90">Total Teachers</div>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-black text-black">{teachers.filter((t) => t.status === "Active").length}</div>
            <div className="text-sm font-semibold text-gray-600">Active Teachers</div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-black text-white">{new Set(teachers.map((t) => t.subject)).size}</div>
            <div className="text-sm font-semibold text-white/90">Subjects</div>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-black text-black">
              {teachers.reduce((sum, t) => sum + t.classes.length, 0)}
            </div>
            <div className="text-sm font-semibold text-gray-600">Total Classes</div>
          </Card>
        </div>

        {/* Teachers List */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-3xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black flex items-center">
              <GraduationCap className="w-6 h-6 mr-3 text-green-600" />
              Faculty Database ({filteredTeachers.length} teachers)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTeachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center">
                      <div className="lg:col-span-2">
                        <h3 className="text-xl font-black text-black mb-1">{teacher.name}</h3>
                        <p className="font-semibold text-gray-600 mb-1">{teacher.email}</p>
                        <p className="font-semibold text-green-600 text-sm">ID: {teacher.empId}</p>
                      </div>
                      <div className="text-center">
                        <span
                          className={`bg-gradient-to-r ${getSubjectColor(teacher.subject)} text-white px-3 py-1 font-black text-sm rounded-lg border-2 border-black`}
                        >
                          {teacher.subject}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-700">{teacher.phone}</p>
                        <p className="text-sm text-gray-500">{teacher.experience}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-blue-600 text-sm">{teacher.classes.join(", ")}</p>
                      </div>
                      <div className="text-center">
                        <span
                          className={`px-3 py-1 border-2 font-bold text-sm rounded-lg ${
                            teacher.status === "Active"
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-yellow-100 border-yellow-300 text-yellow-700"
                          }`}
                        >
                          {teacher.status}
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
