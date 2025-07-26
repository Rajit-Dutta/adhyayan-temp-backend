"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Mock data for batches
const INITIAL_BATCHES = [
  {
    id: 1,
    name: "Mathematics Advanced - 10A",
    subject: "Mathematics",
    standard: "10th",
    section: "A",
    teacher: "Dr. Rajesh Kumar",
    students: [
      { id: 1, name: "Aarav Sharma", rollNo: "2024001" },
      { id: 2, name: "Priya Patel", rollNo: "2024002" },
      { id: 4, name: "Kavya Reddy", rollNo: "2024004" },
      { id: 5, name: "Rohit Kumar", rollNo: "2024005" },
    ],
    createdDate: "2024-01-15",
    status: "Active",
    description: "Advanced mathematics batch for high-performing students",
  },
  {
    id: 2,
    name: "Science Remedial - 9A",
    subject: "Science",
    standard: "9th",
    section: "A",
    teacher: "Prof. Sunita Sharma",
    students: [
      { id: 3, name: "Arjun Singh", rollNo: "2024003" },
      { id: 6, name: "Sneha Gupta", rollNo: "2024006" },
    ],
    createdDate: "2024-01-12",
    status: "Active",
    description: "Remedial science batch for additional support",
  },
  {
    id: 3,
    name: "English Literature - 11A",
    subject: "English",
    standard: "11th",
    section: "A",
    teacher: "Ms. Kavita Singh",
    students: [
      { id: 7, name: "Vikram Joshi", rollNo: "2024007" },
      { id: 8, name: "Ananya Das", rollNo: "2024008" },
      { id: 9, name: "Karan Mehta", rollNo: "2024009" },
    ],
    createdDate: "2024-01-10",
    status: "Active",
    description: "Literature focused English batch",
  },
  {
    id: 4,
    name: "History Research - 12B",
    subject: "History",
    standard: "12th",
    section: "B",
    teacher: "Mr. Amit Verma",
    students: [{ id: 10, name: "Riya Agarwal", rollNo: "2024010" }],
    createdDate: "2024-01-08",
    status: "Inactive",
    description: "Research-oriented history batch",
  },
];

const TEACHERS = [
  "Dr. Rajesh Kumar",
  "Prof. Sunita Sharma",
  "Ms. Kavita Singh",
  "Mr. Amit Verma",
];

export default function BatchesPage() {
  const router = useRouter();
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStandard, setFilterStandard] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminData();
    fetchStudentDetails();
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

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/getStudentData"
      );
      setAvailableStudents(response.data);
    } catch (error) {
      console.error("Error in fetching student details", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  };

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStandard =
      filterStandard === "" || batch.standard === filterStandard;
    const matchesSubject =
      filterSubject === "" || batch.subject === filterSubject;
    const matchesStatus = filterStatus === "" || batch.status === filterStatus;
    return matchesSearch && matchesStandard && matchesSubject && matchesStatus;
  });

  const handleDeleteBatch = (batchId: number) => {
    if (confirm("Are you sure you want to delete this batch?")) {
      setBatches(batches.filter((batch) => batch.id !== batchId));
    }
  };

  const handleEditBatch = (batch: any) => {
    setSelectedBatch(batch);
    setShowEditModal(true);
  };

  const handleViewBatch = (batch: any) => {
    setSelectedBatch(batch);
    setShowViewModal(true);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-green-500 border-b-2 border-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
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
                  BATCH MANAGEMENT
                </h1>
                <p className="text-lg font-bold text-green-100">
                  Organize students into subject-specific batches
                </p>
              </div>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search batches by name, teacher, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                <select
                  value={filterStandard}
                  onChange={(e) => setFilterStandard(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                >
                  <option value="">All Standards</option>
                  <option value="9th">9th Standard</option>
                  <option value="10th">10th Standard</option>
                  <option value="11th">11th Standard</option>
                  <option value="12th">12th Standard</option>
                </select>
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
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-black rounded-xl px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Batch
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-black text-white">
              {batches.length}
            </div>
            <div className="text-sm font-semibold text-white/90">
              Total Batches
            </div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-black">
              {batches.filter((b) => b.status === "Active").length}
            </div>
            <div className="text-sm font-semibold text-gray-600">
              Active Batches
            </div>
          </Card>
          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-white">
              {batches.reduce((sum, b) => sum + b.students.length, 0)}
            </div>
            <div className="text-sm font-semibold text-white/90">
              Total Students
            </div>
          </Card>
          <Card className="bg-white border-2 border-green-500 rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-black">
              {new Set(batches.map((b) => b.subject)).size}
            </div>
            <div className="text-sm font-semibold text-gray-600">Subjects</div>
          </Card>
        </div>

        {/* Batches List */}
        <Card className="bg-white border-2 border-green-500 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black flex items-center">
              <Users className="w-6 h-6 mr-3 text-green-600" />
              Batch Database ({filteredBatches.length} batches)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBatches.map((batch) => (
                <Card
                  key={batch.id}
                  className="bg-gray-50 border-2 border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center">
                      <div className="lg:col-span-2">
                        <h3 className="text-xl font-black text-black mb-1">
                          {batch.name}
                        </h3>
                        <p className="font-semibold text-gray-600 mb-1">
                          Teacher: {batch.teacher}
                        </p>
                        <p className="font-semibold text-green-600 text-sm">
                          {batch.description}
                        </p>
                      </div>
                      <div className="text-center">
                        <span className="bg-green-100 border-2 border-green-300 text-green-700 px-3 py-1 font-black text-sm rounded-lg">
                          {batch.subject}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="bg-white border-2 border-gray-300 text-gray-700 px-3 py-1 font-black text-sm rounded-lg">
                          {batch.standard} {batch.section}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-green-600">
                          {batch.students.length}
                        </div>
                        <div className="text-sm font-semibold text-gray-600">
                          Students
                        </div>
                      </div>
                      <div className="text-center">
                        <span
                          className={`px-3 py-1 border-2 font-bold text-sm rounded-lg ${
                            batch.status === "Active"
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-red-100 border-red-300 text-red-700"
                          }`}
                        >
                          {batch.status}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-700 text-sm">
                          {batch.createdDate}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleViewBatch(batch)}
                          className="bg-green-500 text-white font-bold border-2 border-black text-xs px-2 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleEditBatch(batch)}
                          className="bg-white text-black font-bold border-2 border-black text-xs px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteBatch(batch.id)}
                          className="bg-black text-white font-bold border-2 border-gray-300 text-xs px-2 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Batch Modal */}
        {showCreateModal && (
          <CreateBatchModal
            onClose={() => setShowCreateModal(false)}
            onSave={(newBatch) => {
              setBatches([...batches, { ...newBatch, id: Date.now() }]);
              setShowCreateModal(false);
            }}
            availableStudents={availableStudents}
          />
        )}

        {/* Edit Batch Modal */}
        {showEditModal && selectedBatch && (
          <EditBatchModal
            batch={selectedBatch}
            onClose={() => {
              setShowEditModal(false);
              setSelectedBatch(null);
            }}
            onSave={(updatedBatch) => {
              setBatches(
                batches.map((b) =>
                  b.id === updatedBatch.id ? updatedBatch : b
                )
              );
              setShowEditModal(false);
              setSelectedBatch(null);
            }}
            availableStudents={availableStudents}
          />
        )}

        {/* View Batch Modal */}
        {showViewModal && selectedBatch && (
          <ViewBatchModal
            batch={selectedBatch}
            onClose={() => {
              setShowViewModal(false);
              setSelectedBatch(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Create Batch Modal Component
function CreateBatchModal({
  onClose,
  onSave,
  availableStudents
}: {
  onClose: () => void;
  onSave: (batch: any) => void;
  availableStudents:any
}) {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    standard: "",
    section: "",
    teacher: "",
    description: "",
    status: "Active",
    students: [] as any[],
  });

  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

  const filteredStudents = availableStudents.filter(
    (student:any) =>
      formData.standard === "" || student.standard === formData.standard
  );

  const handleStudentToggle = (student: any) => {
    if (selectedStudents.find((s) => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      students: selectedStudents,
      createdDate: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-2 border-green-500 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-black">
            CREATE NEW BATCH
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Batch Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                  placeholder="Enter batch name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Standard
                </label>
                <select
                  value={formData.standard}
                  onChange={(e) =>
                    setFormData({ ...formData, standard: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                  required
                >
                  <option value="">Select Standard</option>
                  <option value="9th">9th Standard</option>
                  <option value="10th">10th Standard</option>
                  <option value="11th">11th Standard</option>
                  <option value="12th">12th Standard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Section
                </label>
                <select
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                  required
                >
                  <option value="">Select Section</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Teacher
                </label>
                <select
                  value={formData.teacher}
                  onChange={(e) =>
                    setFormData({ ...formData, teacher: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                  required
                >
                  <option value="">Select Teacher</option>
                  {TEACHERS.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0 h-24"
                placeholder="Enter batch description"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Select Students ({selectedStudents.length} selected)
              </label>
              <div className="border-2 border-gray-300 rounded-xl p-4 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredStudents.map((student:any) => (
                    <div
                      key={student.id}
                      onClick={() => handleStudentToggle(student)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedStudents.find((s) => s.id === student.id)
                          ? "bg-green-100 border-green-500 text-green-700"
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-semibold">{student.name}</div>
                      <div className="text-sm text-gray-600">
                        {student.rollNo} - {student.standard} {student.section}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-black rounded-xl px-8"
              >
                Create Batch
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold border-2 border-black rounded-xl px-8"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Edit Batch Modal Component
function EditBatchModal({
  batch,
  onClose,
  onSave,
  availableStudents
}: {
  batch: any;
  onClose: () => void;
  onSave: (batch: any) => void;
  availableStudents:any
}) {
  const [formData, setFormData] = useState({
    ...batch,
  });
  const [selectedStudents, setSelectedStudents] = useState(batch.students);

  const filteredStudents = availableStudents.filter(
    (student:any) =>
      formData.standard === "" || student.standard === formData.standard
  );

  const handleStudentToggle = (student: any) => {
    if (selectedStudents.find((s: any) => s.id === student.id)) {
      setSelectedStudents(
        selectedStudents.filter((s: any) => s.id !== student.id)
      );
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      students: selectedStudents,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-2 border-green-500 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-black">
            EDIT BATCH
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Batch Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                  required
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Standard
                </label>
                <select
                  value={formData.standard}
                  onChange={(e) =>
                    setFormData({ ...formData, standard: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                  required
                >
                  <option value="9th">9th Standard</option>
                  <option value="10th">10th Standard</option>
                  <option value="11th">11th Standard</option>
                  <option value="12th">12th Standard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Section
                </label>
                <select
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                  required
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Teacher
                </label>
                <select
                  value={formData.teacher}
                  onChange={(e) =>
                    setFormData({ ...formData, teacher: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                  required
                >
                  {TEACHERS.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0 h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Select Students ({selectedStudents.length} selected)
              </label>
              <div className="border-2 border-gray-300 rounded-xl p-4 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredStudents.map((student:any) => (
                    <div
                      key={student.id}
                      onClick={() => handleStudentToggle(student)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedStudents.find((s: any) => s.id === student.id)
                          ? "bg-green-100 border-green-500 text-green-700"
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-semibold">{student.name}</div>
                      <div className="text-sm text-gray-600">
                        {student.rollNo} - {student.standard} {student.section}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-black rounded-xl px-8"
              >
                Update Batch
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold border-2 border-black rounded-xl px-8"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// View Batch Modal Component
function ViewBatchModal({
  batch,
  onClose,
}: {
  batch: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-2 border-green-500 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-black">
            BATCH DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Batch Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <h3 className="font-black text-black mb-2">
                  Batch Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Name:</span> {batch.name}
                  </p>
                  <p>
                    <span className="font-semibold">Subject:</span>{" "}
                    {batch.subject}
                  </p>
                  <p>
                    <span className="font-semibold">Standard:</span>{" "}
                    {batch.standard}
                  </p>
                  <p>
                    <span className="font-semibold">Section:</span>{" "}
                    {batch.section}
                  </p>
                  <p>
                    <span className="font-semibold">Teacher:</span>{" "}
                    {batch.teacher}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-sm font-bold ${
                        batch.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Created:</span>{" "}
                    {batch.createdDate}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <h3 className="font-black text-black mb-2">Description</h3>
                <p className="text-gray-700">{batch.description}</p>
              </div>
            </div>

            {/* Students List */}
            <div>
              <h3 className="font-black text-black mb-4">
                Students in Batch ({batch.students.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {batch.students.map((student: any) => (
                  <div
                    key={student.id}
                    className="bg-green-50 border-2 border-green-200 p-3 rounded-xl"
                  >
                    <div className="font-semibold text-green-700">
                      {student.name}
                    </div>
                    <div className="text-sm text-green-600">
                      Roll No: {student.rollNo}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold border-2 border-black rounded-xl px-8"
              >
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
