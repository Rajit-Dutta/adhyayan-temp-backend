"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Plus, Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TeachersPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      email: "rajesh@adhyayan.edu",
      phone: "9876543210",
      subject: "Mathematics",
      experience: "15 years",
      qualification: "M.Sc, B.Ed",
      status: "Active",
      avatar: "RK",
      classes: ["10th A", "10th B", "11th A"],
      joinDate: "2020-06-15",
    },
    {
      id: 2,
      name: "Prof. Sunita Sharma",
      email: "sunita@adhyayan.edu",
      phone: "9876543211",
      subject: "Physics",
      experience: "12 years",
      qualification: "M.Sc Physics, B.Ed",
      status: "Active",
      avatar: "SS",
      classes: ["11th A", "11th B", "12th A"],
      joinDate: "2021-04-10",
    },
    {
      id: 3,
      name: "Mr. Amit Patel",
      email: "amit@adhyayan.edu",
      phone: "9876543212",
      subject: "Chemistry",
      experience: "8 years",
      qualification: "M.Sc Chemistry, B.Ed",
      status: "Active",
      avatar: "AP",
      classes: ["11th B", "12th A", "12th B"],
      joinDate: "2022-07-01",
    },
    {
      id: 4,
      name: "Ms. Priya Singh",
      email: "priya@adhyayan.edu",
      phone: "9876543213",
      subject: "English",
      experience: "10 years",
      qualification: "M.A English, B.Ed",
      status: "On Leave",
      avatar: "PS",
      classes: ["9th A", "9th B", "10th A"],
      joinDate: "2021-08-15",
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
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = filterSubject === "" || teacher.subject === filterSubject
    return matchesSearch && matchesSubject
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
                <h1 className="text-3xl font-black text-white">TEACHER MANAGEMENT</h1>
                <p className="text-lg font-bold text-green-100">Manage teaching staff and faculty information</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl">
                <Download className="w-5 h-5 mr-2" />
                Export
              </Button>
              <Button className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                Add Teacher
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
                  placeholder="Search teachers by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-black rounded-xl font-bold text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="pl-12 pr-8 py-4 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none bg-white"
                  >
                    <option value="">All Subjects</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                    <option value="Biology">Biology</option>
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
            <div className="text-4xl font-black text-white">{teachers.length}</div>
            <div className="text-sm font-bold text-green-100">Total Teachers</div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <div className="text-4xl font-black text-black">{teachers.filter((t) => t.status === "Active").length}</div>
            <div className="text-sm font-bold text-gray-700">Active Teachers</div>
          </Card>
          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center hover:bg-green-600 transition-colors">
            <div className="text-4xl font-black text-white">{new Set(teachers.map((t) => t.subject)).size}</div>
            <div className="text-sm font-bold text-green-100">Subjects</div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <div className="text-4xl font-black text-black">
              {Math.round(teachers.reduce((sum, t) => sum + Number.parseInt(t.experience), 0) / teachers.length)}
            </div>
            <div className="text-sm font-bold text-gray-700">Avg Experience</div>
          </Card>
        </div>

        {/* Teachers List */}
        <Card className="bg-white border-2 border-green-500 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-black flex items-center">
              <Users className="w-8 h-8 mr-4 text-green-600" />
              Teaching Staff ({filteredTeachers.length} teachers)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredTeachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="bg-gray-50 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center">
                      <div className="lg:col-span-2 flex items-center space-x-4">
                        <div className="w-16 h-16 bg-green-500 border-2 border-black rounded-xl flex items-center justify-center">
                          <span className="text-white font-black text-lg">{teacher.avatar}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-black mb-1">{teacher.name}</h3>
                          <p className="text-gray-600 font-bold text-sm mb-1">{teacher.email}</p>
                          <p className="text-green-600 font-black text-sm">{teacher.qualification}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="bg-green-100 border-2 border-green-300 text-green-700 px-4 py-2 font-black text-sm rounded-xl">
                          {teacher.subject}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 font-black text-sm rounded-xl">
                          {teacher.experience}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700 font-bold">{teacher.phone}</p>
                      </div>
                      <div className="text-center">
                        <span
                          className={`px-4 py-2 border-2 font-black text-sm rounded-xl ${
                            teacher.status === "Active"
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-yellow-100 border-yellow-300 text-yellow-700"
                          }`}
                        >
                          {teacher.status}
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
                    <div className="mt-4 pt-4 border-t-2 border-gray-300">
                      <p className="text-sm font-bold text-gray-600 mb-2">Classes Teaching:</p>
                      <div className="flex flex-wrap gap-2">
                        {teacher.classes.map((className) => (
                          <span
                            key={className}
                            className="bg-green-100 border-2 border-green-300 text-green-700 px-3 py-1 text-xs font-black rounded-lg"
                          >
                            {className}
                          </span>
                        ))}
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
