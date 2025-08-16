"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  X,
  BookOpen,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export interface Student {
  _id?: string | number; // sometimes you set Date.now()
  firstName?: string;
  lastName?: string;
  parentName?: string;
  parentPhone?: string;
  email?: string;
  password?: string;
  age?: number;
  isVerified?: boolean;
  standard?: string;
  phone?: string;
  subjects?: string;
  address?: string;
  DOB?: string;
  bloodGroup?: string;
  verifyTokenExpiry?: string;
  rememberMeExpiry?: string;
  createdAt?: string;
  updatedAt?: string;
  batch?: string; // you store batch here
  section?: string; // section used in filter/forms
  attendance?: number; // used in getAttendanceColor
  grades?: Record<string, string>; // map subjects → grades
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStandard, setFilterStandard] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState<Student | null>(null);
  const [displayedSections, setDisplayedSections] = useState<{
    [batchName: string]: string[];
  }>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    firstName: "",
    lastName: "",
    parentName: "",
    parentPhone: "",
    email: "",
    password: "",
    age: "",
    isVerified: false,
    standard: "",
    phone: "",
    subjects: "",
    address: "",
    DOB: "",
    bloodGroup: "",
    section: "",
    batch: "",
  });
  const [formErrors, setFormErrors] = useState<Student | null>(null);

  useEffect(() => {
    fetchAdminData();
    fetchStudentData();
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
        { params: { email } }
      );

      const adminPayload = adminRes.data.adminData;

      if (userType === "admin" && adminPayload) {
        const parsedAdmin = adminPayload;
        console.log("Admin member logged in:", parsedAdmin);
      }
    } catch (error) {
      console.error("Error during admin dashboard data fetch:", error);
    }
  };

  const fetchStudentData = async () => {
    try {
      const studentRes = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getStudentData`
      );
      setStudents(studentRes.data);
      await fetchingStudentToBatchNames(studentRes.data);
    } catch (error) {
      console.error("Error during student data fetch:", error);
    }
  };

  const fetchingStudentToBatchNames = async (studentData: any[]) => {
    try {
      // Flatten and get unique batch IDs from all students
      const allBatchIds = studentData.flatMap((student) =>
        Array.isArray(student.batch)
          ? student.batch
          : student.batch?.split(",") || []
      );
      const uniqueBatchIds = Array.from(new Set(allBatchIds));

      // Fetch batch details once for all unique batch IDs
      const batchResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getStudentSection`,
        { batchIds: uniqueBatchIds }
      );

      // Map batchId -> batchName
      const batchMap: { [batchId: string]: string } = {};
      batchResponse.data.forEach((batch: any) => {
        batchMap[batch._id] = batch.name;
      });

      // Build studentName -> array of batch names map
      const studentToBatchNamesMap: { [studentName: string]: string[] } = {};

      studentData.forEach((student) => {
        const studentName = `${student.firstName} ${student.lastName}`;
        const batches = Array.isArray(student.batch)
          ? student.batch
          : student.batch?.split(",") || [];
        const batchNames = batches.map(
          (batchId: any) => batchMap[batchId] || "Unknown Batch"
        );

        studentToBatchNamesMap[studentName] = batchNames;
      });

      console.log("Student to batch names map:", studentToBatchNamesMap);

      // Update state or use as needed
      setDisplayedSections(studentToBatchNamesMap);
    } catch (error) {
      console.error("Error fetching student to batch names:", error);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.standard?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStandard =
      filterStandard === "" || student.standard === filterStandard;
    return matchesSearch && matchesStandard;
  });

  const handleAddStudent = () => {
    const errors = validateAddForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const newStudent = {
        _id: Date.now(),
        name: `${addForm.firstName} ${addForm.lastName}`,
        grade: addForm.standard,
        section: addForm.section,
        batch: addForm.batch,
        email: addForm.email,
        phone: addForm.phone,
        dateOfBirth: addForm.DOB,
        address: addForm.address,
        parentName: addForm.parentName,
        parentPhone: addForm.parentPhone,
        status: "Active",
        subjects: addForm.subjects,
        grades: addForm.subjects.split(",").reduce((acc: any, subject) => {
          const grades = ["A+", "A", "B+", "B", "C+", "C"];
          acc[subject] = grades[Math.floor(Math.random() * grades.length)];
          return acc;
        }, {}),
        joinDate: new Date().toISOString().split("T")[0],
        bloodGroup: addForm.bloodGroup,
        emergencyContact: addForm.parentPhone,
        age: Number.parseInt(addForm.age),
        isVerified: addForm.isVerified,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setStudents([...students, newStudent]);
      setShowAddModal(false);
      setAddForm({
        firstName: "",
        lastName: "",
        parentName: "",
        parentPhone: "",
        email: "",
        password: "",
        age: "",
        isVerified: false,
        standard: "",
        phone: "",
        subjects: "",
        address: "",
        DOB: "",
        bloodGroup: "",
        section: "",
        batch: "",
      });
      setFormErrors({});
    }
  };

  const handleView = (student: any) => {
    setViewStudent(student);
  };

  const handleEdit = (student: any) => {
    setEditStudent(student);
    setEditForm({ ...student });
  };

  const handleDelete = (student: Student) => {
    setDeleteStudent(student);
  };

  const confirmDelete = () => {
    if (!deleteStudent) return;
    setStudents(students.filter((s: Student) => s._id !== deleteStudent._id));
    setDeleteStudent(null);
  };

  const saveEdit = () => {
    if (editStudent && editForm) {
      setStudents(
        students.map((s: any) =>
          s._id === editStudent._id ? ({ ...editForm } as Student) : s
        )
      );
    }
    setEditStudent(null);
    setEditForm(null);
  };

  const getAttendanceColor = (attendance: any) => {
    if (attendance >= 95) return "bg-green-100 border-green-300 text-green-700";
    if (attendance >= 85)
      return "bg-yellow-100 border-yellow-300 text-yellow-700";
    return "bg-red-100 border-red-300 text-red-700";
  };

  const getGradeColor = (grade: any) => {
    if (grade.startsWith("A"))
      return "bg-green-100 border-green-300 text-green-700";
    if (grade.startsWith("B"))
      return "bg-blue-100 border-blue-300 text-blue-700";
    if (grade.startsWith("C"))
      return "bg-yellow-100 border-yellow-300 text-yellow-700";
    return "bg-red-100 border-red-300 text-red-700";
  };

  const validateAddForm = () => {
    const errors: { [key: string]: string } = {};

    // Required field validations
    if (!addForm.firstName.trim()) errors.firstName = "First name is required";
    if (!addForm.lastName.trim()) errors.lastName = "Last name is required";
    if (!addForm.email.trim()) errors.email = "Email is required";
    if (!addForm.password.trim()) errors.password = "Password is required";
    if (!addForm.standard.trim())
      errors.standard = "Grade/Standard is required";
    if (!addForm.section.trim()) errors.section = "Section is required";
    if (!addForm.phone.trim()) errors.phone = "Phone number is required";
    if (!addForm.parentName.trim())
      errors.parentName = "Parent name is required";
    if (!addForm.parentPhone.trim())
      errors.parentPhone = "Parent phone is required";
    if (!addForm.address.trim()) errors.address = "Address is required";
    if (!addForm.DOB.trim()) errors.DOB = "Date of birth is required";
    if (!addForm.bloodGroup.trim())
      errors.bloodGroup = "Blood group is required";
    if (!addForm.age) errors.age = "Age is required";
    if (addForm.subjects.length === 0)
      errors.subjects = "At least one subject must be selected";

    // Format validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (addForm.email && !emailRegex.test(addForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^[+]?[\d\s-()]{10,}$/;
    if (addForm.phone && !phoneRegex.test(addForm.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    if (addForm.parentPhone && !phoneRegex.test(addForm.parentPhone)) {
      errors.parentPhone = "Please enter a valid parent phone number";
    }

    // Check for duplicate email and roll number
    const existingEmail = students.find(
      (s) => s.email?.toLowerCase() === addForm.email.toLowerCase()
    );
    if (existingEmail) errors.email = "Email already exists";

    // Age validation
    const ageNum = Number(addForm.age);
    if (addForm.age && (ageNum < 5 || ageNum > 25)) {
      errors.age = "Age must be between 5 and 25";
    }

    // Password validation
    if (addForm.password && addForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleSubjectToggle = (subject: any) => {
    if (addForm.subjects?.split(",").includes(subject)) {
      setAddForm({
        ...addForm,
        subjects: addForm.subjects
          .split(",")
          .filter((s) => s !== subject)
          .toString(),
      });
    } else {
      setAddForm({
        ...addForm,
        subjects: [...addForm.subjects?.split(","), subject].toString(),
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
                  STUDENT MANAGEMENT
                </h1>
                <p className="text-lg font-bold text-green-100">
                  Manage student records and academic information
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl"
              >
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
                    value={filterStandard}
                    onChange={(e) => setFilterStandard(e.target.value)}
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
            <div className="text-4xl font-black text-white">
              {students.length}
            </div>
            <div className="text-sm font-bold text-green-100">
              Total Students
            </div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            <div className="text-4xl font-black text-black">
              {students.filter((s) => s.isVerified).length}
            </div>
            <div className="text-sm font-bold text-gray-700">
              Active Students
            </div>
          </Card>
          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center hover:bg-green-600 transition-colors">
            <div className="text-4xl font-black text-white">4</div>
            <div className="text-sm font-bold text-green-100">Grades</div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
            {/* <div className="text-4xl font-black text-black">
              {Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)}%
            </div> */}
            <div className="text-sm font-bold text-gray-700">
              Avg Attendance
            </div>
          </Card>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, ind) => (
            <Card
              key={ind}
              className="bg-white border-2 border-green-500 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                {/* Student Avatar and Basic Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-green-500 border-2 border-black rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-xl">
                      {student.firstName?.charAt(0).toUpperCase()}
                      {student.lastName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-black mb-1">
                      {student.firstName} {student.lastName}
                    </h3>
                    {/* <p className="text-green-600 font-bold text-sm mb-1">Roll: {student.rollNumber}</p> */}
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 border-2 border-green-300 text-green-700 px-3 py-1 font-black text-xs rounded-lg">
                        {student.standard}
                      </span>
                      <span className="bg-white border-2 border-gray-300 text-gray-700 px-3 py-1 font-black text-xs rounded-lg">
                        {/* SEC {student.section} */}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-bold text-gray-700 truncate">
                      {student.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-bold text-gray-700">
                      {student.phone}
                    </span>
                  </div>
                </div>

                {/* Attendance and Status */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <div
                    // className={`px-3 py-2 border-2 font-black text-sm rounded-xl ${getAttendanceColor(student.attendance)}`}
                    >
                      {/* {student.attendance}% */}
                      1%
                    </div>
                    <p className="text-xs font-bold text-gray-600 mt-1">
                      Attendance
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 border-2 border-green-300 text-green-700 px-3 py-2 font-black text-sm rounded-xl">
                      {student.isVerified ? "Active" : "Inactive"}
                    </div>
                    <p className="text-xs font-bold text-gray-600 mt-1">
                      Status
                    </p>
                  </div>
                </div>

                {/* Subjects */}
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-600 mb-2">
                    Subjects ({student.subjects?.split(",").length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {student.subjects
                      ?.split(",")
                      .slice(0, 3)
                      .map((subject: any, ind: any) => (
                        <span
                          key={ind}
                          className="bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 text-xs font-bold rounded-lg"
                        >
                          {subject.toString()}
                        </span>
                      ))}
                    {student.subjects &&
                      student.subjects.split(",").length > 3 && (
                        <span className="bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 text-xs font-bold rounded-lg">
                          +{student.subjects.split(",").length - 3} more
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
              <h2 className="text-2xl font-black text-white">
                STUDENT DETAILS
              </h2>
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
                          {viewStudent.firstName?.charAt(0).toUpperCase()}
                          {viewStudent.lastName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-black">
                        {viewStudent.firstName} {viewStudent.lastName}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-1">
                          Date of Birth
                        </p>
                        <p className="text-sm font-black text-black">
                          {viewStudent.DOB
                            ? new Date(viewStudent.DOB).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-1">
                          Blood Group
                        </p>
                        <p className="text-sm font-black text-black">
                          {viewStudent.bloodGroup}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-1">
                          Join Date
                        </p>
                        <p className="text-sm font-black text-black">
                          {viewStudent.createdAt
                            ? new Date(
                                viewStudent.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
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
                        Grade {viewStudent.standard}
                      </span>
                      <span className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 font-black text-sm rounded-xl">
                        Section
                        {/* {viewStudent.batch} */}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-2">
                        Attendance
                      </p>
                      {/* <div
                        className={`px-4 py-2 border-2 font-black text-sm rounded-xl text-center
                           ${getAttendanceColor(
                          viewStudent.attendance
                        )}
                        `}
                      >
                        {viewStudent.attendance}%
                      </div> */}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-2">
                        Subjects
                      </p>
                      <div className="space-y-2">
                        {viewStudent.subjects?.split(",").map((subject) => (
                          <div
                            key={subject}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm font-bold text-black">
                              {subject}
                            </span>
                            {/* <span
                              className={`px-2 py-1 border-2 font-black text-xs rounded-lg ${getGradeColor(
                                viewStudent.grades[subject]
                              )}`}
                            >
                              {viewStudent.grades[subject]}
                            </span> */}
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
                      <p className="text-xs font-bold text-gray-600 mb-1">
                        Email
                      </p>
                      <p className="text-sm font-black text-black break-all">
                        {viewStudent.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-1">
                        Phone
                      </p>
                      <p className="text-sm font-black text-black">
                        {viewStudent.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-1">
                        Address
                      </p>
                      <p className="text-sm font-black text-black">
                        {viewStudent.address}
                      </p>
                    </div>
                    <div className="border-t-2 border-gray-300 pt-4">
                      <p className="text-xs font-bold text-gray-600 mb-2">
                        Parent/Guardian
                      </p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1">
                            Name
                          </p>
                          <p className="text-sm font-black text-black">
                            {viewStudent.parentName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1">
                            Phone
                          </p>
                          <p className="text-sm font-black text-black">
                            {viewStudent.parentPhone}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1">
                            Emergency Contact
                          </p>
                          <p className="text-sm font-black text-black">
                            {viewStudent.phone}
                          </p>
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      value={editForm?.firstName || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, firstName: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={editForm?.lastName || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lastName: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Grade
                      </label>
                      <select
                        value={editForm?.standard || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, standard: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="9th">9th Grade</option>
                        <option value="10th">10th Grade</option>
                        <option value="11th">11th Grade</option>
                        <option value="12th">12th Grade</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Section
                      </label>
                      <select
                        // value={editForm?.batch || ""}
                        // onChange={(e) =>
                        //   setEditForm({ ...editForm, section: e.target.value })
                        // }
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm?.email || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm?.phone || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editForm?.DOB || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, DOB: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Blood Group
                    </label>
                    <select
                      value={editForm?.bloodGroup || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bloodGroup: e.target.value })
                      }
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={editForm?.address || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Parent Name
                    </label>
                    <input
                      type="text"
                      value={editForm?.parentName || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, parentName: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Parent Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm?.parentPhone || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          parentPhone: e.target.value,
                        })
                      }
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
                <h3 className="text-xl font-black text-black mb-2">
                  Are you sure?
                </h3>
                <p className="text-gray-600 font-bold">
                  You are about to delete{" "}
                  <span className="font-black text-black">
                    {deleteStudent.firstName} {deleteStudent.lastName}
                  </span>
                  . This action cannot be undone.
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

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-green-500 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-green-500 border-b-2 border-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">
                ADD NEW STUDENT
              </h2>
              <Button
                onClick={() => {
                  setShowAddModal(false);
                  setAddForm({
                    firstName: "",
                    lastName: "",
                    parentName: "",
                    parentPhone: "",
                    email: "",
                    password: "",
                    age: "",
                    isVerified: false,
                    standard: "",
                    phone: "",
                    subjects: "",
                    address: "",
                    DOB: "",
                    bloodGroup: "",
                    section: "",
                    batch: "",
                  });
                  setFormErrors({});
                }}
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={addForm.firstName}
                          onChange={(e) =>
                            setAddForm({
                              ...addForm,
                              firstName: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                            formErrors?.firstName
                              ? "border-red-500"
                              : "border-black"
                          }`}
                          placeholder="Enter first name"
                        />
                        {formErrors?.firstName && (
                          <p className="text-red-500 text-xs font-bold mt-1">
                            {formErrors?.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={addForm.lastName}
                          onChange={(e) =>
                            setAddForm({ ...addForm, lastName: e.target.value })
                          }
                          className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                            formErrors?.lastName
                              ? "border-red-500"
                              : "border-black"
                          }`}
                          placeholder="Enter last name"
                        />
                        {formErrors?.lastName && (
                          <p className="text-red-500 text-xs font-bold mt-1">
                            {formErrors?.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={addForm.DOB}
                        onChange={(e) =>
                          setAddForm({ ...addForm, DOB: e.target.value })
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                          formErrors?.DOB ? "border-red-500" : "border-black"
                        }`}
                      />
                      {formErrors?.DOB && (
                        <p className="text-red-500 text-xs font-bold mt-1">
                          {formErrors?.DOB}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Age <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={addForm.age}
                          onChange={(e) =>
                            setAddForm({ ...addForm, age: e.target.value })
                          }
                          className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                            formErrors?.age ? "border-red-500" : "border-black"
                          }`}
                          placeholder="Enter age"
                          min="5"
                          max="25"
                        />
                        {formErrors?.age && (
                          <p className="text-red-500 text-xs font-bold mt-1">
                            {formErrors.age}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Blood Group <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={addForm.bloodGroup}
                          onChange={(e) =>
                            setAddForm({
                              ...addForm,
                              bloodGroup: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                            formErrors?.bloodGroup
                              ? "border-red-500"
                              : "border-black"
                          }`}
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                        {formErrors?.bloodGroup && (
                          <p className="text-red-500 text-xs font-bold mt-1">
                            {formErrors?.bloodGroup}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={addForm.address}
                        onChange={(e) =>
                          setAddForm({ ...addForm, address: e.target.value })
                        }
                        rows={3}
                        className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                          formErrors?.address
                            ? "border-red-500"
                            : "border-black"
                        }`}
                        placeholder="Enter full address"
                      />
                      {formErrors?.address && (
                        <p className="text-red-500 text-xs font-bold mt-1">
                          {formErrors?.address}
                        </p>
                      )}
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Grade/Standard <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={addForm.standard}
                          onChange={(e) =>
                            setAddForm({ ...addForm, standard: e.target.value })
                          }
                          className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                            formErrors?.standard
                              ? "border-red-500"
                              : "border-black"
                          }`}
                        >
                          <option value="">Select Grade</option>
                          <option value="9th">9th Grade</option>
                          <option value="10th">10th Grade</option>
                          <option value="11th">11th Grade</option>
                          <option value="12th">12th Grade</option>
                        </select>
                        {formErrors?.standard && (
                          <p className="text-red-500 text-xs font-bold mt-1">
                            {formErrors?.standard}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Section <span className="text-red-500">*</span>
                        </label>
                        {/* <select
                          value={addForm.section}
                          onChange={(e) =>
                            setAddForm({ ...addForm, section: e.target.value })
                          }
                          className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                            formErrors?.section
                              ? "border-red-500"
                              : "border-black"
                          }`}
                        >
                          <option value="">Select Section</option>
                          <option value="A">Section A</option>
                          <option value="B">Section B</option>
                          <option value="C">Section C</option>
                        </select>
                        {formErrors?.section && (
                          <p className="text-red-500 text-xs font-bold mt-1">
                            {formErrors?.section}
                          </p>
                        )} */}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Subjects <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border-2 border-gray-300 rounded-xl p-3">
                        {[
                          "Mathematics",
                          "Science",
                          "English",
                          "Physics",
                          "Chemistry",
                          "Biology",
                          "Computer Science",
                        ].map((subject) => (
                          <div
                            key={subject}
                            onClick={() => handleSubjectToggle(subject)}
                            className={`p-2 border-2 rounded-lg cursor-pointer transition-all text-sm font-bold text-center ${
                              addForm.subjects.split(",").includes(subject)
                                ? "bg-green-100 border-green-500 text-green-700"
                                : "bg-white border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {subject}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs font-bold text-gray-600 mt-2">
                        Selected:{" "}
                        {addForm.subjects.length > 0
                          ? addForm.subjects.split(",").join(", ")
                          : "None"}
                      </p>
                      {formErrors?.subjects && (
                        <p className="text-red-500 text-xs font-bold mt-1">
                          {formErrors?.subjects}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="isVerified"
                        checked={addForm.isVerified}
                        onChange={(e) =>
                          setAddForm({
                            ...addForm,
                            isVerified: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-green-600 border-2 border-black rounded focus:ring-green-500"
                      />
                      <label
                        htmlFor="isVerified"
                        className="font-bold text-black"
                      >
                        Mark as Verified Student
                      </label>
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
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={addForm.email}
                        onChange={(e) =>
                          setAddForm({ ...addForm, email: e.target.value })
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                          formErrors?.email ? "border-red-500" : "border-black"
                        }`}
                        placeholder="Enter email address"
                      />
                      {formErrors?.email && (
                        <p className="text-red-500 text-xs font-bold mt-1">
                          {formErrors?.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={addForm.password}
                        onChange={(e) =>
                          setAddForm({ ...addForm, password: e.target.value })
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                          formErrors?.password
                            ? "border-red-500"
                            : "border-black"
                        }`}
                        placeholder="Enter password (min 6 characters)"
                      />
                      {formErrors?.password && (
                        <p className="text-red-500 text-xs font-bold mt-1">
                          {formErrors?.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={addForm.phone}
                        onChange={(e) =>
                          setAddForm({ ...addForm, phone: e.target.value })
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                          formErrors?.phone ? "border-red-500" : "border-black"
                        }`}
                        placeholder="Enter phone number"
                      />
                      {formErrors?.phone && (
                        <p className="text-red-500 text-xs font-bold mt-1">
                          {formErrors?.phone}
                        </p>
                      )}
                    </div>

                    <div className="border-t-2 border-gray-300 pt-4">
                      <h4 className="text-sm font-black text-black mb-3">
                        Parent/Guardian Information
                      </h4>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Parent Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={addForm.parentName}
                          onChange={(e) =>
                            setAddForm({
                              ...addForm,
                              parentName: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                            formErrors?.parentName
                              ? "border-red-500"
                              : "border-black"
                          }`}
                          placeholder="Enter parent/guardian name"
                        />
                        {formErrors?.parentName && (
                          <p className="text-red-500 text-xs font-bold mt-1">
                            {formErrors?.parentName}
                          </p>
                        )}
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Parent Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={addForm.parentPhone}
                          onChange={(e) =>
                            setAddForm({
                              ...addForm,
                              parentPhone: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 ${
                            formErrors?.parentPhone
                              ? "border-red-500"
                              : "border-black"
                          }`}
                          placeholder="Enter parent phone number"
                        />
                        {formErrors?.parentPhone && (
                          <p className="text-red-500 text-xs font-bold mt-1">
                            {formErrors?.parentPhone}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t-2 border-gray-300">
                <Button
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm({
                      firstName: "",
                      lastName: "",
                      parentName: "",
                      parentPhone: "",
                      email: "",
                      password: "",
                      age: "",
                      isVerified: false,
                      standard: "",
                      phone: "",
                      subjects: "",
                      address: "",
                      DOB: "",
                      bloodGroup: "",
                      section: "",
                      batch: "",
                    });
                    setFormErrors({});
                  }}
                  className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddStudent}
                  className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black rounded-xl px-6 py-3"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
