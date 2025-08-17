"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  GraduationCap,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Users,
  Phone,
  Save,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  interface Teacher extends Document {
    _id: string;
    fullName: string;
    subject: string;
    email: string;
    password: string;
    phoneNumber: number;
    classesToTeach: string[];
    isVerified: boolean;
    forgotPasswordToken?: string;
    forgotPasswordExpiry?: Date;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }

  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [deleteTeacher, setDeleteTeacher] = useState<Teacher | null>(null);
  const [editForm, setEditForm] = useState<Partial<Teacher>>({});

  useEffect(() => {
    fetchAdminData();
    fetchTeacherDetails();
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

  const fetchTeacherDetails = async () => {
    try {
      const teacherRes = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getTeacherDetails`
      );
      setTeachers(teacherRes.data);
      console.log(teacherRes.data);
    } catch (error) {
      console.error("Error during student data fetch:", error);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      filterSubject === "" || teacher.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const handleView = (teacher: any) => {
    setViewTeacher(teacher);
    console.log(teacher);
  };

  const handleEdit = (teacher: any) => {
    setEditTeacher(teacher);
    setEditForm({ ...teacher });
  };

  const handleDelete = (teacher: any) => {
    setDeleteTeacher(teacher);
  };

  const confirmDelete = () => {
    setTeachers(teachers.filter((t) => t._id !== deleteTeacher?._id));
    setDeleteTeacher(null);
  };

  const saveEdit = () => {
    setTeachers(
      teachers.map((t: any) =>
        t.id === editTeacher?._id ? { ...editForm } : t
      )
    );
    setEditTeacher(null);
    setEditForm({});
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "Active":
        return "bg-green-100 border-green-300 text-green-700";
      case "On Leave":
        return "bg-yellow-100 border-yellow-300 text-yellow-700";
      case "Inactive":
        return "bg-red-100 border-red-300 text-red-700";
      default:
        return "bg-gray-100 border-gray-300 text-gray-700";
    }
  };

  const handleClassSelection = (className: any) => {
    const currentClasses = editForm.classesToTeach || [];
    if (currentClasses.includes(className)) {
      setEditForm({
        ...editForm,
        classesToTeach: currentClasses.filter((c) => c !== className),
      });
    } else {
      setEditForm({
        ...editForm,
        classesToTeach: [...currentClasses, className],
      });
    }
  };

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
                <h1 className="text-3xl font-black text-white">
                  TEACHER MANAGEMENT
                </h1>
                <p className="text-lg font-bold text-green-100">
                  Manage faculty and teaching staff
                </p>
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
                  placeholder="Search teachers by name, email, or employee ID..."
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
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center hover:bg-green-600 transition-colors">
            <GraduationCap className="w-10 h-10 text-white mx-auto mb-3" />
            <div className="text-4xl font-black text-white">
              {teachers.length}
            </div>
            <div className="text-sm font-bold text-green-100">
              Total Teachers
            </div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <div className="text-4xl font-black text-black">
              {/* {teachers.filter((t) => t.status === "Active").length} */}
            </div>
            <div className="text-sm font-bold text-gray-700">
              Active Teachers
            </div>
          </Card>
          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center hover:bg-green-600 transition-colors">
            <div className="text-4xl font-black text-white">
              {new Set(teachers.map((t) => t.subject)).size}
            </div>
            <div className="text-sm font-bold text-green-100">Subjects</div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <div className="text-4xl font-black text-black">
              {teachers.reduce((sum, t) => sum + t.classesToTeach.length, 0)}
            </div>
            <div className="text-sm font-bold text-gray-700">Total Classes</div>
          </Card>
        </div>

        {/* Teachers List */}
        <Card className="bg-white border-2 border-green-500 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-black flex items-center">
              <GraduationCap className="w-8 h-8 mr-4 text-green-600" />
              Faculty Database ({filteredTeachers.length} teachers)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredTeachers.map((teacher, ind) => (
                <Card
                  key={ind}
                  className="bg-gray-50 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center">
                      <div className="lg:col-span-2 flex items-center space-x-4">
                        <div className="w-16 h-16 bg-green-500 border-2 border-black rounded-xl flex items-center justify-center">
                          <span className="text-white font-black text-lg">
                            {teacher.fullName?.split(",")[0]?.charAt(0)}
                            {teacher.fullName
                              ?.split(",")
                              [teacher.fullName?.split(",").length - 1]?.charAt(
                                0
                              )}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-black mb-1">
                            {teacher.fullName}
                          </h3>
                          <p className="text-gray-600 font-bold text-sm mb-1">
                            {teacher.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="bg-green-100 border-2 border-green-300 text-green-700 px-4 py-2 font-black text-sm rounded-xl">
                          {teacher.subject}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700 font-bold">
                          {teacher.phoneNumber}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <BookOpen className="w-5 h-5 text-green-600" />
                          <span className="text-green-600 font-black text-sm">
                            {teacher.classesToTeach.join(", ")}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        {/* <span
                          className={`px-4 py-2 border-2 font-black text-sm rounded-xl ${
                            teacher.status === "Active"
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-yellow-100 border-yellow-300 text-yellow-700"
                          }`}
                        >
                          {teacher.status}
                        </span> */}
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
          <div className="bg-white border-2 border-green-500 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-green-500 border-b-2 border-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">
                TEACHER DETAILS
              </h2>
              <Button
                onClick={() => setViewTeacher(null)}
                className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              {/* Teacher Avatar and Name */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-green-500 border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="text-white font-black text-3xl">
                    {viewTeacher.fullName?.split(",")[0]?.charAt(0)}
                    {viewTeacher.fullName
                      ?.split(",")
                      [viewTeacher.fullName?.split(",").length - 1]?.charAt(0)}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-black mb-2">
                  {viewTeacher.fullName}
                </h3>
                <div className="flex justify-center items-center space-x-3">
                  <span className="bg-green-100 border-2 border-green-300 text-green-700 px-4 py-2 font-black text-sm rounded-xl">
                    {viewTeacher.subject}
                  </span>
                  {viewTeacher.isVerified && (
                    <span className="bg-blue-100 border-2 border-blue-300 text-blue-700 px-4 py-2 font-black text-sm rounded-xl">
                      ✓ VERIFIED
                    </span>
                  )}
                </div>
              </div>

              {/* Teacher Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <p className="text-xs font-bold text-gray-600 mb-2">
                        Email Address
                      </p>
                      <p className="text-lg font-black text-black break-all bg-white border-2 border-gray-300 rounded-lg p-3">
                        {viewTeacher.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-2">
                        Phone Number
                      </p>
                      <p className="text-lg font-black text-black bg-white border-2 border-gray-300 rounded-lg p-3">
                        {viewTeacher.phoneNumber}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Teaching Information */}
                <Card className="bg-gray-50 border-2 border-gray-300 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-black text-black flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                      Teaching Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-2">
                        Subject
                      </p>
                      <span className="inline-block bg-green-100 border-2 border-green-300 text-green-700 px-4 py-3 font-black text-lg rounded-xl">
                        {viewTeacher.subject}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-2">
                        Verification Status
                      </p>
                      <span
                        className={`inline-block px-4 py-3 border-2 font-black text-lg rounded-xl ${
                          viewTeacher.isVerified
                            ? "bg-green-100 border-green-300 text-green-700"
                            : "bg-red-100 border-red-300 text-red-700"
                        }`}
                      >
                        {viewTeacher.isVerified
                          ? "✓ VERIFIED"
                          : "✗ NOT VERIFIED"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Classes Teaching */}
              <Card className="bg-gray-50 border-2 border-gray-300 rounded-xl mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-black text-black flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Classes Teaching ({viewTeacher.classesToTeach[0].length}{" "}
                    classes)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {viewTeacher.classesToTeach[0].map((className : string) => (
                      <div
                        key={className}
                        className="bg-green-100 border-2 border-green-300 text-green-700 px-4 py-3 font-black text-center rounded-xl shadow-[2px_2px_0px_0px_#22c55e]"
                      >
                        {className}
                      </div>
                    ))}
                  </div>
                  {viewTeacher.classesToTeach.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 font-bold text-lg">
                        No classes assigned
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mt-8 pt-6 border-t-2 border-gray-300">
                <Button
                  onClick={() => {
                    setViewTeacher(null);
                    handleEdit(viewTeacher);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black rounded-xl px-8 py-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] transition-all"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Teacher
                </Button>
                <Button
                  onClick={() => setViewTeacher(null)}
                  className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl px-8 py-3"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {editTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-green-500 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.fullName || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editForm.subject || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Physical Education">
                      Physical Education
                    </option>
                    <option value="Art">Art</option>
                    <option value="Music">Music</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={editForm.phoneNumber || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        phoneNumber: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Classes to Teach */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Classes to Teach <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2 border-2 border-gray-300 rounded-xl p-4">
                    {[
                      "9th A",
                      "9th B",
                      "10th A",
                      "10th B",
                      "11th A",
                      "11th B",
                      "12th A",
                      "12th B",
                    ].map((className) => (
                      <div
                        key={className}
                        onClick={() => handleClassSelection(className)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-sm font-bold text-center hover:scale-105 ${
                          (editForm.classesToTeach || []).includes(className)
                            ? "bg-green-100 border-green-500 text-green-700 shadow-[2px_2px_0px_0px_#22c55e]"
                            : "bg-white border-gray-300 hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000]"
                        }`}
                      >
                        {className}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-gray-600 mt-3">
                    Selected Classes:{" "}
                    {(editForm.classesToTeach || []).length > 0
                      ? (editForm.classesToTeach || []).join(", ")
                      : "None"}
                  </p>
                </div>

                {/* Is Verified */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 border-2 border-gray-300 rounded-xl">
                  <input
                    type="checkbox"
                    id="isVerified"
                    checked={editForm.isVerified || false}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isVerified: e.target.checked })
                    }
                    className="w-6 h-6 text-green-600 border-2 border-black rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="isVerified"
                    className="font-black text-black text-lg"
                  >
                    Verified Teacher
                  </label>
                  <div className="text-sm font-bold text-gray-600">
                    {editForm.isVerified
                      ? "✓ This teacher is verified"
                      : "○ Not verified"}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t-2 border-gray-300">
                <Button
                  onClick={() => setEditTeacher(null)}
                  className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl px-8 py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveEdit}
                  className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black rounded-xl px-8 py-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] transition-all"
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
                <h3 className="text-xl font-black text-black mb-2">
                  Are you sure?
                </h3>
                <p className="text-gray-600 font-bold">
                  You are about to delete{" "}
                  <span className="font-black text-black">
                    {deleteTeacher.fullName}
                  </span>
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
  );
}
