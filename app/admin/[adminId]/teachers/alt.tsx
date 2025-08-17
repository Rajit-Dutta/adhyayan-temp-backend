"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  Phone,
  BookOpen,
  GraduationCap,
} from "lucide-react"
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
      qualification: "M.Sc Mathematics, B.Ed",
      status: "Active",
      avatar: "RK",
      classes: ["10th A", "10th B", "11th A"],
      joinDate: "2020-06-15",
      employeeId: "EMP001",
      department: "Science & Mathematics",
      address: "123 Teacher Colony, Mumbai, Maharashtra",
      dateOfBirth: "1985-03-15",
      emergencyContact: "9876543200",
      bloodGroup: "O+",
      salary: "₹65,000",
      specializations: ["Algebra", "Geometry", "Calculus"],
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
      employeeId: "EMP002",
      department: "Science & Mathematics",
      address: "456 Faculty Apartments, Delhi, Delhi",
      dateOfBirth: "1988-07-22",
      emergencyContact: "9876543201",
      bloodGroup: "A+",
      salary: "₹58,000",
      specializations: ["Mechanics", "Thermodynamics", "Optics"],
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
      employeeId: "EMP003",
      department: "Science & Mathematics",
      address: "789 Staff Quarters, Bangalore, Karnataka",
      dateOfBirth: "1990-12-10",
      emergencyContact: "9876543202",
      bloodGroup: "B+",
      salary: "₹52,000",
      specializations: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
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
      employeeId: "EMP004",
      department: "Languages & Literature",
      address: "321 Teachers Residency, Chennai, Tamil Nadu",
      dateOfBirth: "1987-05-18",
      emergencyContact: "9876543203",
      bloodGroup: "AB+",
      salary: "₹55,000",
      specializations: ["Literature", "Grammar", "Creative Writing"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [viewTeacher, setViewTeacher] = useState(null)
  const [editTeacher, setEditTeacher] = useState(null)
  const [deleteTeacher, setDeleteTeacher] = useState(null)
  const [editForm, setEditForm] = useState({})

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
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = filterSubject === "" || teacher.subject === filterSubject
    const matchesStatus = filterStatus === "" || teacher.status === filterStatus
    return matchesSearch && matchesSubject && matchesStatus
  })

  const handleView = (teacher) => {
    setViewTeacher(teacher)
  }

  const handleEdit = (teacher) => {
    setEditTeacher(teacher)
    setEditForm({ ...teacher })
  }

  const handleDelete = (teacher) => {
    setDeleteTeacher(teacher)
  }

  const confirmDelete = () => {
    setTeachers(teachers.filter((t) => t.id !== deleteTeacher.id))
    setDeleteTeacher(null)
  }

  const saveEdit = () => {
    setTeachers(teachers.map((t) => (t.id === editTeacher.id ? { ...editForm } : t)))
    setEditTeacher(null)
    setEditForm({})
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 border-green-300 text-green-700"
      case "On Leave":
        return "bg-yellow-100 border-yellow-300 text-yellow-700"
      case "Inactive":
        return "bg-red-100 border-red-300 text-red-700"
      default:
        return "bg-gray-100 border-gray-300 text-gray-700"
    }
  }

  const handleClassSelection = (className) => {
    const currentClasses = editForm.classes || []
    if (currentClasses.includes(className)) {
      setEditForm({
        ...editForm,
        classes: currentClasses.filter((c) => c !== className),
      })
    } else {
      setEditForm({
        ...editForm,
        classes: [...currentClasses, className],
      })
    }
  }

  const handleSpecializationToggle = (specialization) => {
    const currentSpecs = editForm.specializations || []
    if (currentSpecs.includes(specialization)) {
      setEditForm({
        ...editForm,
        specializations: currentSpecs.filter((s) => s !== specialization),
      })
    } else {
      setEditForm({
        ...editForm,
        specializations: [...currentSpecs, specialization],
      })
    }
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
                  placeholder="Search teachers by name, email, subject, or employee ID..."
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
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                  </select>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-4 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none bg-white"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                          <p className="text-green-600 font-black text-sm">ID: {teacher.employeeId}</p>
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
                          className={`px-4 py-2 border-2 font-black text-sm rounded-xl ${getStatusColor(teacher.status)}`}
                        >
                          {teacher.status}
                        </span>
                      </div>
                      <div className="lg:col-span-2 flex space-x-2">
                        <Button
                          onClick={() => handleView(teacher)}
                          className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black text-xs px-3 py-2 rounded-xl"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          onClick={() => handleEdit(teacher)}
                          className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black text-xs px-3 py-2 rounded-xl"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(teacher)}
                          className="bg-black hover:bg-gray-800 text-white font-black border-2 border-gray-300 text-xs px-3 py-2 rounded-xl"
                        >
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

      {/* View Teacher Modal */}
      {viewTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-green-500 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-green-500 border-b-2 border-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">TEACHER DETAILS</h2>
              <Button
                onClick={() => setViewTeacher(null)}
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
                        <span className="text-white font-black text-2xl">{viewTeacher.avatar}</span>
                      </div>
                      <h3 className="text-xl font-black text-black">{viewTeacher.name}</h3>
                      <p className="text-green-600 font-bold">ID: {viewTeacher.employeeId}</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-1">Date of Birth</p>
                        <p className="text-sm font-black text-black">{viewTeacher.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-1">Blood Group</p>
                        <p className="text-sm font-black text-black">{viewTeacher.bloodGroup}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-1">Join Date</p>
                        <p className="text-sm font-black text-black">{viewTeacher.joinDate}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-1">Department</p>
                        <p className="text-sm font-black text-black">{viewTeacher.department}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card className="bg-gray-50 border-2 border-gray-300 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-black text-black flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                      Professional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="bg-green-100 border-2 border-green-300 text-green-700 px-4 py-2 font-black text-sm rounded-xl">
                        {viewTeacher.subject}
                      </span>
                      <span
                        className={`px-4 py-2 border-2 font-black text-sm rounded-xl ${getStatusColor(viewTeacher.status)}`}
                      >
                        {viewTeacher.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-1">Experience</p>
                      <p className="text-lg font-black text-black">{viewTeacher.experience}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-1">Qualification</p>
                      <p className="text-sm font-black text-black">{viewTeacher.qualification}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-1">Salary</p>
                      <p className="text-lg font-black text-green-600">{viewTeacher.salary}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-2">Classes Teaching</p>
                      <div className="space-y-1">
                        {viewTeacher.classes.map((className) => (
                          <span
                            key={className}
                            className="inline-block bg-green-100 border-2 border-green-300 text-green-700 px-2 py-1 text-xs font-black rounded-lg mr-2 mb-1"
                          >
                            {className}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-2">Specializations</p>
                      <div className="space-y-1">
                        {viewTeacher.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="inline-block bg-blue-100 border-2 border-blue-300 text-blue-700 px-2 py-1 text-xs font-black rounded-lg mr-2 mb-1"
                          >
                            {spec}
                          </span>
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
                      <p className="text-sm font-black text-black break-all">{viewTeacher.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-1">Phone</p>
                      <p className="text-sm font-black text-black">{viewTeacher.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-1">Emergency Contact</p>
                      <p className="text-sm font-black text-black">{viewTeacher.emergencyContact}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-1">Address</p>
                      <p className="text-sm font-black text-black">{viewTeacher.address}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {editTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-green-500 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-green-500 border-b-2 border-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">EDIT TEACHER</h2>
              <Button
                onClick={() => setEditTeacher(null)}
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
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Employee ID</label>
                      <input
                        type="text"
                        value={editForm.employeeId || ""}
                        onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
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
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card className="bg-gray-50 border-2 border-gray-300 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-black text-black flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                      Professional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                      <select
                        value={editForm.subject || ""}
                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="History">History</option>
                        <option value="Geography">Geography</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Physical Education">Physical Education</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Experience</label>
                      <input
                        type="text"
                        value={editForm.experience || ""}
                        onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="e.g., 10 years"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Qualification</label>
                      <input
                        type="text"
                        value={editForm.qualification || ""}
                        onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="e.g., M.Sc, B.Ed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
                      <select
                        value={editForm.department || ""}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="Science & Mathematics">Science & Mathematics</option>
                        <option value="Languages & Literature">Languages & Literature</option>
                        <option value="Social Sciences">Social Sciences</option>
                        <option value="Arts & Humanities">Arts & Humanities</option>
                        <option value="Physical Education">Physical Education</option>
                        <option value="Computer Science">Computer Science</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                      <select
                        value={editForm.status || ""}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Salary</label>
                      <input
                        type="text"
                        value={editForm.salary || ""}
                        onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="e.g., ₹50,000"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Contact & Classes */}
                <Card className="bg-gray-50 border-2 border-gray-300 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-black text-black flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-green-600" />
                      Contact & Classes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Emergency Contact</label>
                      <input
                        type="tel"
                        value={editForm.emergencyContact || ""}
                        onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Classes Teaching</label>
                      <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border-2 border-gray-300 rounded-xl p-3">
                        {["9th A", "9th B", "10th A", "10th B", "11th A", "11th B", "12th A", "12th B"].map(
                          (className) => (
                            <div
                              key={className}
                              onClick={() => handleClassSelection(className)}
                              className={`p-2 border-2 rounded-lg cursor-pointer transition-all text-xs font-bold text-center ${
                                (editForm.classes || []).includes(className)
                                  ? "bg-green-100 border-green-500 text-green-700"
                                  : "bg-white border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              {className}
                            </div>
                          ),
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-600 mt-2">
                        Selected: {(editForm.classes || []).length > 0 ? (editForm.classes || []).join(", ") : "None"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Specializations */}
              <Card className="bg-gray-50 border-2 border-gray-300 rounded-xl mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-black text-black flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                    Specializations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border-2 border-gray-300 rounded-xl p-3">
                    {[
                      "Algebra",
                      "Geometry",
                      "Calculus",
                      "Statistics",
                      "Mechanics",
                      "Thermodynamics",
                      "Optics",
                      "Electronics",
                      "Organic Chemistry",
                      "Inorganic Chemistry",
                      "Physical Chemistry",
                      "Biochemistry",
                      "Literature",
                      "Grammar",
                      "Creative Writing",
                      "Linguistics",
                      "Ancient History",
                      "Modern History",
                      "World History",
                      "Indian History",
                      "Physical Geography",
                      "Human Geography",
                      "Environmental Science",
                      "Cartography",
                    ].map((specialization) => (
                      <div
                        key={specialization}
                        onClick={() => handleSpecializationToggle(specialization)}
                        className={`p-2 border-2 rounded-lg cursor-pointer transition-all text-xs font-bold text-center ${
                          (editForm.specializations || []).includes(specialization)
                            ? "bg-blue-100 border-blue-500 text-blue-700"
                            : "bg-white border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {specialization}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-gray-600 mt-2">
                    Selected:{" "}
                    {(editForm.specializations || []).length > 0 ? (editForm.specializations || []).join(", ") : "None"}
                  </p>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t-2 border-gray-300">
                <Button
                  onClick={() => setEditTeacher(null)}
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
      {deleteTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-red-500 rounded-2xl max-w-md w-full">
            <div className="bg-red-500 border-b-2 border-white p-6">
              <h2 className="text-2xl font-black text-white">DELETE TEACHER</h2>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500 border-2 border-black rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-black mb-2">Are you sure?</h3>
                <p className="text-gray-600 font-bold">
                  You are about to delete <span className="font-black text-black">{deleteTeacher.name}</span> (ID:{" "}
                  {deleteTeacher.employeeId}). This action cannot be undone.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setDeleteTeacher(null)}
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
