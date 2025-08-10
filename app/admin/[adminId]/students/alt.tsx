"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Search, Filter, Plus, Eye, Edit, Trash2, X, Save, Mail, Phone, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Aarav Sharma",
      grade: "10th",
      section: "A",
      rollNumber: "2024001",
      email: "aarav.sharma@school.edu",
      phone: "+91 98765 43210",
      dateOfBirth: "2008-05-15",
      address: "123 MG Road, Mumbai, Maharashtra",
      parentName: "Rajesh Sharma",
      parentPhone: "+91 98765 43200",
      attendance: 95,
      status: "Active",
      subjects: ["Mathematics", "Science", "English", "Hindi", "Social Studies"],
      grades: { Mathematics: "A+", Science: "A", English: "A+", Hindi: "B+", "Social Studies": "A" },
      joinDate: "2024-04-01",
      bloodGroup: "O+",
      emergencyContact: "+91 98765 43201",
    },
    {
      id: 2,
      name: "Priya Patel",
      grade: "11th",
      section: "B",
      rollNumber: "2024002",
      email: "priya.patel@school.edu",
      phone: "+91 98765 43211",
      dateOfBirth: "2007-08-22",
      address: "456 Park Street, Delhi, Delhi",
      parentName: "Amit Patel",
      parentPhone: "+91 98765 43202",
      attendance: 88,
      status: "Active",
      subjects: ["Physics", "Chemistry", "Mathematics", "English", "Computer Science"],
      grades: { Physics: "A", Chemistry: "A+", Mathematics: "A+", English: "B+", "Computer Science": "A" },
      joinDate: "2024-04-01",
      bloodGroup: "A+",
      emergencyContact: "+91 98765 43203",
    },
    {
      id: 3,
      name: "Rahul Kumar",
      grade: "9th",
      section: "A",
      rollNumber: "2024003",
      email: "rahul.kumar@school.edu",
      phone: "+91 98765 43212",
      dateOfBirth: "2009-12-10",
      address: "789 Gandhi Nagar, Bangalore, Karnataka",
      parentName: "Suresh Kumar",
      parentPhone: "+91 98765 43204",
      attendance: 92,
      status: "Active",
      subjects: ["Mathematics", "Science", "English", "Hindi", "Social Studies"],
      grades: { Mathematics: "B+", Science: "A", English: "A", Hindi: "A+", "Social Studies": "B+" },
      joinDate: "2024-04-01",
      bloodGroup: "B+",
      emergencyContact: "+91 98765 43205",
    },
    {
      id: 4,
      name: "Sneha Singh",
      grade: "12th",
      section: "C",
      rollNumber: "2024004",
      email: "sneha.singh@school.edu",
      phone: "+91 98765 43213",
      dateOfBirth: "2006-03-18",
      address: "321 Nehru Place, Chennai, Tamil Nadu",
      parentName: "Vikram Singh",
      parentPhone: "+91 98765 43206",
      attendance: 97,
      status: "Active",
      subjects: ["Biology", "Chemistry", "Physics", "English", "Mathematics"],
      grades: { Biology: "A+", Chemistry: "A+", Physics: "A", English: "A", Mathematics: "A+" },
      joinDate: "2024-04-01",
      bloodGroup: "AB+",
      emergencyContact: "+91 98765 43207",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterGrade, setFilterGrade] = useState("")
  const [filterSection, setFilterSection] = useState("")
  const [viewStudent, setViewStudent] = useState(null)
  const [editStudent, setEditStudent] = useState(null)
  const [deleteStudent, setDeleteStudent] = useState(null)
  const [editForm, setEditForm] = useState({})

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
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = filterGrade === "" || student.grade === filterGrade
    const matchesSection = filterSection === "" || student.section === filterSection
    return matchesSearch && matchesGrade && matchesSection
  })

  const handleView = (student) => {
    setViewStudent(student)
  }

  const handleEdit = (student) => {
    setEditStudent(student)
    setEditForm({ ...student })
  }

  const handleDelete = (student) => {
    setDeleteStudent(student)
  }

  const confirmDelete = () => {
    setStudents(students.filter((s) => s.id !== deleteStudent.id))
    setDeleteStudent(null)
  }

  const saveEdit = () => {
    setStudents(students.map((s) => (s.id === editStudent.id ? { ...editForm } : s)))
    setEditStudent(null)
    setEditForm({})
  }

  const getAttendanceColor = (attendance) => {
    if (attendance >= 95) return "bg-green-100 border-green-300 text-green-700"
    if (attendance >= 85) return "bg-yellow-100 border-yellow-300 text-yellow-700"
    return "bg-red-100 border-red-300 text-red-700"
  }

  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "bg-green-100 border-green-300 text-green-700"
    if (grade.startsWith("B")) return "bg-blue-100 border-blue-300 text-blue-700"
    if (grade.startsWith("C")) return "bg-yellow-100 border-yellow-300 text-yellow-700"
    return "bg-red-100 border-red-300 text-red-700"
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
                <h1 className="text-3xl font-black text-white">STUDENT MANAGEMENT</h1>
                <p className="text-lg font-bold text-green-100">Manage student records and academic information</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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
                  placeholder="Search students by name, roll number, or email..."
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
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                  className="px-4 py-4 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none bg-white"
                >
                  <option value="">All Sections</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
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
            <div className="text-4xl font-black text-white">4</div>
            <div className="text-sm font-bold text-green-100">Grades</div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <div className="text-4xl font-black text-black">
              {Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)}%
            </div>
            <div className="text-sm font-bold text-gray-700">Avg Attendance</div>
          </Card>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card
              key={student.id}
              className="bg-white border-2 border-green-500 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                {/* Student Avatar and Basic Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-green-500 border-2 border-black rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-xl">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-black mb-1">{student.name}</h3>
                    <p className="text-green-600 font-bold text-sm mb-1">Roll: {student.rollNumber}</p>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 border-2 border-green-300 text-green-700 px-3 py-1 font-black text-xs rounded-lg">
                        {student.grade}
                      </span>
                      <span className="bg-white border-2 border-gray-300 text-gray-700 px-3 py-1 font-black text-xs rounded-lg">
                        SEC {student.section}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-bold text-gray-700 truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-bold text-gray-700">{student.phone}</span>
                  </div>
                </div>

                {/* Attendance and Status */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <div
                      className={`px-3 py-2 border-2 font-black text-sm rounded-xl ${getAttendanceColor(student.attendance)}`}
                    >
                      {student.attendance}%
                    </div>
                    <p className="text-xs font-bold text-gray-600 mt-1">Attendance</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 border-2 border-green-300 text-green-700 px-3 py-2 font-black text-sm rounded-xl">
                      {student.status}
                    </div>
                    <p className="text-xs font-bold text-gray-600 mt-1">Status</p>
                  </div>
                </div>

                {/* Subjects */}
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-600 mb-2">Subjects ({student.subjects.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {student.subjects.slice(0, 3).map((subject) => (
                      <span
                        key={subject}
                        className="bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 text-xs font-bold rounded-lg"
                      >
                        {subject}
                      </span>
                    ))}
                    {student.subjects.length > 3 && (
                      <span className="bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 text-xs font-bold rounded-lg">
                        +{student.subjects.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleView(student)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black text-sm py-2 rounded-xl"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    onClick={() => handleEdit(student)}
                    className="flex-1 bg-white hover:bg-gray-100 text-black font-black border-2 border-black text-sm py-2 rounded-xl"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(student)}
                    className="bg-black hover:bg-gray-800 text-white font-black border-2 border-gray-300 text-sm px-3 py-2 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* View Student Modal */}
      {viewStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-green-500 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-green-500 border-b-2 border-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">STUDENT DETAILS</h2>
              <Button
                onClick={() => setViewStudent(null)}
                className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <Card className="bg-gray-50 border-2 border-gray-300 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-black text-black flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-green-500 border-2 border-black rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-black text-2xl">
                          {viewStudent.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-black">{viewStudent.name}</h3>
                      <p className="text-green-600 font-bold">Roll: {viewStudent.rollNumber}</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-1">Date of Birth</p>
                        <p className="text-sm font-black text-black">{viewStudent.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-1">Blood Group</p>
                        <p className="text-sm font-black text-black">{viewStudent.bloodGroup}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-1">Join Date</p>
                        <p className="text-sm font-black text-black">{viewStudent.joinDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Information */}
                <Card className="bg-gray-50 border-2 border-gray-300 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-black text-black flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="bg-green-100 border-2 border-green-300 text-green-700 px-4 py-2 font-black text-sm rounded-xl">
                        Grade {viewStudent.grade}
                      </span>
                      <span className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 font-black text-sm rounded-xl">
                        Section {viewStudent.section}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-2">Attendance</p>
                      <div
                        className={`px-4 py-2 border-2 font-black text-sm rounded-xl text-center ${getAttendanceColor(viewStudent.attendance)}`}
                      >
                        {viewStudent.attendance}%
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-2">Subjects</p>
                      <div className="space-y-2">
                        {viewStudent.subjects.map((subject) => (
                          <div key={subject} className="flex justify-between items-center">
                            <span className="text-sm font-bold text-black">{subject}</span>
                            <span
                              className={`px-2 py-1 border-2 font-black text-xs rounded-lg ${getGradeColor(viewStudent.grades[subject])}`}
                            >
                              {viewStudent.grades[subject]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="bg-gray-50 border-2 border-gray-300 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-black text-black flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-green-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-1">Email</p>
                      <p className="text-sm font-black text-black break-all">{viewStudent.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-1">Phone</p>
                      <p className="text-sm font-black text-black">{viewStudent.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-1">Address</p>
                      <p className="text-sm font-black text-black">{viewStudent.address}</p>
                    </div>
                    <div className="border-t-2 border-gray-300 pt-4">
                      <p className="text-xs font-bold text-gray-600 mb-2">Parent/Guardian</p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1">Name</p>
                          <p className="text-sm font-black text-black">{viewStudent.parentName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1">Phone</p>
                          <p className="text-sm font-black text-black">{viewStudent.parentPhone}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1">Emergency Contact</p>
                          <p className="text-sm font-black text-black">{viewStudent.emergencyContact}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-green-500 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-green-500 border-b-2 border-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">EDIT STUDENT</h2>
              <Button
                onClick={() => setEditStudent(null)}
                className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Grade</label>
                      <select
                        value={editForm.grade || ""}
                        onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="9th">9th Grade</option>
                        <option value="10th">10th Grade</option>
                        <option value="11th">11th Grade</option>
                        <option value="12th">12th Grade</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Section</label>
                      <select
                        value={editForm.section || ""}
                        onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Roll Number</label>
                    <input
                      type="text"
                      value={editForm.rollNumber || ""}
                      onChange={(e) => setEditForm({ ...editForm, rollNumber: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone || ""}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={editForm.dateOfBirth || ""}
                      onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Blood Group</label>
                    <select
                      value={editForm.bloodGroup || ""}
                      onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                    <textarea
                      value={editForm.address || ""}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Parent Name</label>
                    <input
                      type="text"
                      value={editForm.parentName || ""}
                      onChange={(e) => setEditForm({ ...editForm, parentName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Parent Phone</label>
                    <input
                      type="tel"
                      value={editForm.parentPhone || ""}
                      onChange={(e) => setEditForm({ ...editForm, parentPhone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t-2 border-gray-300">
                <Button
                  onClick={() => setEditStudent(null)}
                  className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveEdit}
                  className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black rounded-xl px-6 py-3"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-red-500 rounded-2xl max-w-md w-full">
            <div className="bg-red-500 border-b-2 border-white p-6">
              <h2 className="text-2xl font-black text-white">DELETE STUDENT</h2>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500 border-2 border-black rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-black mb-2">Are you sure?</h3>
                <p className="text-gray-600 font-bold">
                  You are about to delete <span className="font-black text-black">{deleteStudent.name}</span>. This
                  action cannot be undone.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setDeleteStudent(null)}
                  className="flex-1 bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black border-2 border-black rounded-xl py-3"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
