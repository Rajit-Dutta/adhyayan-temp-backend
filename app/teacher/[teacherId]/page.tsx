"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  BookOpen,
  LogOut,
  Download,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

type QuestionPaper = {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  createdAt: string;
  assignedBy: string;
  assignedTo: string[];
  totalMarks?: number;
  isSubmissionInClass?: boolean;
  isSubmissionOpen?: boolean;
  questionPaperLink?: string;
};

export default function TeacherDashboard() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [teacherEmailID, setTeacherEmailID] = useState<any[]>([]);
  const [teacherName, setTeacherName] = useState<any[]>([]);
  const [displayedBatches, setDisplayedBatches] = useState<{
    [key: string]: string[];
  }>({});
  const [displayedTeacher, setDisplayedTeacher] = useState<{
    [key: string]: string;
  }>({});
  const [uploadFormData, setUploadFormData] = useState({
    title: "",
    subject: "",
    grade: "",
    assignedTo: [], // array of batch IDs like ['6887a8d35ad88efee4b9c1f2']
    assignedBy: "", // the admin ID (must be a stringified ObjectId)
    totalMarks: "",
    isSubmissionInClass: false,
    isSubmissionOpen: true,
    questionPaperLink: null,
  });

  useEffect(() => {
    fetchTeacherData();
    fetchQuestionPaperDetails();
  }, []);

  useEffect(() => {
    if (questionPapers.length > 0) {
      questionPapers.map((paper: QuestionPaper) => fetchBatchNames(paper._id));
    }
  }, [questionPapers]);

  const fetchTeacherData = async () => {
    try {
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getUserType`,
        {
          withCredentials: true,
        },
      );

      const { userType, fullName, email } = userRes.data.jwtDecoded;
      setTeacherEmailID(email);
      setTeacherName(fullName);
      console.log(fullName);

      if (userType !== "teacher") {
        router.push("/");
        return;
      }

      // Step 2: Get teacher data using email
      const teacherRes = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getTeacherData`,
      );

      console.log(teacherEmailID);

      const teacherPayload = teacherRes.data;
      setTeacher(teacherPayload); // Assuming this is the parsed object already
    } catch (error) {
      console.error("Error during teacher dashboard data fetch:", error);
      router.push("/");
    }
  };

  const fetchQuestionPaperDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/assignment/getAssignmentWRTTeacher`,
        {
          params: {
            email: teacherEmailID,
          },
        },
      );
      console.log("Here at 199 -> ", teacherEmailID);
      const assignmentData = response.data;
      setQuestionPapers(assignmentData);
      console.log(assignmentData);
    } catch (error) {
      console.error("Error in fetching assignment details:", error);
    }
  };

  const fetchBatchNames = async (assignmentID: string) => {
    try {
      const paper = questionPapers.find(
        (paper: QuestionPaper) => paper._id === assignmentID,
      );

      if (!paper || !paper.assignedTo) return;

      const batchNames = await Promise.all(
        paper.assignedTo.map(async (batchId: string) => {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/getBatchFromAssignment`,
            {
              params: { assignedTo: batchId },
            },
          );

          return response.data.assignedToData.name;
        }),
      );

      setDisplayedBatches((prev) => ({
        ...prev,
        [assignmentID]: batchNames,
      }));
    } catch (error) {
      console.error("Error in fetching batch names:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("teacherData");
    router.push("/");
  };

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  const getSubjectColor = (subject: string) => {
    const colors = {
      Mathematics: "from-blue-500 to-blue-600",
      Science: "from-green-500 to-green-600",
      English: "from-purple-500 to-purple-600",
      History: "from-orange-500 to-orange-600",
    };
    return (
      colors[subject as keyof typeof colors] || "from-gray-500 to-gray-600"
    );
  };

  const handleViewAssignment = (batch: any) => {
    setSelectedAssignment(batch);
    setShowViewModal(true);
  };

  const handleEditAssignment = (batch: any) => {
    setSelectedAssignment(batch);
    setShowEditModal(true);
  };

  const handleDeleteBatch = async (assignmentId: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/assignment/deleteAssignment`,
          {
            params: { id: assignmentId },
          },
        );
        console.log("Assignment deleted successfully:", response.data);

        setQuestionPapers((prevAssgn) =>
          prevAssgn.filter((assignment) => assignment._id !== assignmentId),
        );
      } catch (error) {
        console.error("Error deleting batch:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }
  };

  console.log("Displayed batches: ", displayedBatches);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-2">
              Welcome, {teacherName}
            </h1>
            <p className="text-xl font-semibold text-white">
              {teacher.subject} Teacher Dashboard
            </p>
            <p className="text-lg font-medium text-gray-300">
              Classes: {teacher.teacherData.classesToTeach?.join(", ")}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              //onClick={() => router.push("/dashboard")}
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
            className={`bg-gradient-to-br ${getSubjectColor(
              teacher.subject,
            )} border-2 border-white rounded-2xl shadow-lg p-6 text-center`}
          >
            <BookOpen className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-black text-white">
              {questionPapers.length}
            </div>
            <div className="text-sm font-semibold text-white/90">
              Total Assignments
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-black text-black">
              {questionPapers.filter((a) => a.isSubmissionOpen).length}
            </div>
            <div className="text-sm font-semibold text-gray-600">
              Active Assignments
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg p-6 text-center">
            <Users className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-black text-white">
              {/* {assignments.reduce((sum, a) => sum + a.submittedCount, 0)} */}
            </div>
            <div className="text-sm font-semibold text-white/90">
              Submissions
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-black text-black">
              {/* {assignments.reduce((sum, a) => sum + a.gradedCount, 0)} */}
            </div>
            <div className="text-sm font-semibold text-gray-600">Graded</div>
          </Card>
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
            {questionPapers.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl font-bold text-gray-600 mb-2">
                  No assignments created yet
                </p>
                <p className="text-gray-500">
                  Click "Create New Assignment" to get started
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {questionPapers.map((paper) => (
                  <Card
                    key={paper._id}
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <CardContent className="flex justify-between p-3">
                      <div className="grid grid-cols-2 lg:grid-cols-8 items-center">
                        <div className="lg:col-span-2">
                          <h3 className="text-xl font-black text-black mb-1">
                            {paper.title}
                          </h3>
                          <p className="font-semibold text-gray-600 mb-1">
                            Batches:{" "}
                            {displayedBatches[paper._id]
                              .sort()
                              .map((batch: any) => batch + " ")}
                          </p>
                        </div>
                        <div className="text-center">
                          <span className="bg-green-100 border-2 border-green-300 text-green-700 px-3 py-1 font-black text-sm rounded-lg">
                            {paper.subject}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="bg-white border-2 border-gray-300 text-gray-700 px-3 py-1 font-black text-sm rounded-lg text-wrap">
                            {paper.grade}
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-black text-green-600">
                            {paper.assignedTo?.length}
                          </div>
                          <div className="text-sm font-semibold text-gray-600">
                            Batch{paper.assignedTo?.length === 1 ? "" : "es"}
                          </div>
                        </div>
                        <div className="text-center">
                          <span
                            className={`px-3 py-1 border-2 font-bold text-sm rounded-lg ${
                              paper.isSubmissionOpen === true
                                ? "bg-green-100 border-green-300 text-green-700"
                                : "bg-red-100 border-red-300 text-red-700"
                            }`}
                          >
                            {paper.isSubmissionOpen ? "Open" : "Closed"}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-700 text-sm">
                            {
                              new Date(paper.createdAt)
                                .toISOString()
                                .split("T")[0]
                            }
                          </p>
                        </div>
                        <div className="flex">
                          <Button
                            onClick={() => handleViewAssignment(paper)}
                            className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black text-xs px-2 py-2 rounded-xl"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black text-xs px-2 py-2 rounded-xl">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleEditAssignment(paper)}
                            className="bg-blue-500 text-black font-bold border-2 border-black text-xs px-2 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteBatch(paper._id)}
                            className="mr-5 bg-red-500 text-black hover:text-white font-bold border-2 border-black text-xs px-2 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
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

        {/* Upload Paper Modal */}
        {showUploadModal && (
          <UploadPaperModal
            onClose={() => {
              setShowUploadModal(false);
            }}
            onSave={(newPaper) => {
              setQuestionPapers([...questionPapers, newPaper]); // ✅ no temp id
              setShowUploadModal(false);
            }}
            formData={uploadFormData}
            setFormData={setUploadFormData}
            teachers={teachers}
            batches={batches}
          />
        )}

        {/* Edit Batch Modal */}
        {showEditModal && selectedAssignment && (
          <EditPaperModal
            assignment={selectedAssignment}
            onClose={() => {
              setShowEditModal(false);
              setSelectedAssignment(null);
            }}
            onSave={(updatedBatch) => {
              setBatches(
                batches.map((b) =>
                  b.id === updatedBatch.id ? updatedBatch : b,
                ),
              );
              setShowEditModal(false);
              setSelectedAssignment(null);
            }}
            teachers={teachers}
            availableBatches={displayedBatches}
          />
        )}

        {/* View Batch Modal */}
        {showViewModal && selectedAssignment && (
          <ViewPaperModal
            assignment={selectedAssignment}
            onClose={() => {
              setShowViewModal(false);
              setSelectedAssignment(null);
            }}
            displayedTeacher={displayedTeacher}
            displayedBatches={displayedBatches}
          />
        )}
      </div>
    </div>
  );
}

function UploadPaperModal({
  onClose,
  onSave,
  formData,
  setFormData,
  teachers,
  batches,
}: {
  onClose: () => void;
  onSave: (paper: any) => void;
  formData: any;
  setFormData: (data: any) => void;
  teachers: any;
  batches: any;
}) {
  const handleBatchToggle = (batch: string) => {
    console.log("Initial formData -> ", formData.assignedTo);
    console.log(batch);
    if (formData.assignedTo.includes(batch)) {
      console.log("Inside formData includes");
      setFormData({
        ...formData,
        assignedTo: formData.assignedTo.filter((b: string) => b !== batch),
      });
    } else {
      console.log("Inside formData not includes");
      setFormData({
        ...formData,
        assignedTo: [...formData.assignedTo, batch],
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const questionPaperLink = e.target.files?.[0] || null;
    setFormData({ ...formData, questionPaperLink });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.questionPaperLink) {
      alert("Please select a file.");
      return;
    }

    const newAssignment = new FormData();

    newAssignment.append("title", formData.title);
    newAssignment.append("subject", formData.subject);
    newAssignment.append("grade", formData.grade);
    newAssignment.append("createdDate", new Date().toISOString().split("T")[0]);
    newAssignment.append("assignedTo", JSON.stringify(formData.assignedTo));
    newAssignment.append("assignedBy", formData.assignedBy);
    newAssignment.append("totalMarks", formData.totalMarks);
    newAssignment.append("isSubmissionInClass", formData.isSubmissionInClass);
    newAssignment.append("isSubmissionOpen", formData.isSubmissionOpen);
    newAssignment.append(
      "questionPaperLink",
      formData.questionPaperLink as File,
    );

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/assignment/createAssignment`,
        newAssignment,
      );
      console.log("Successfully created assignment -> ", response.data);
      onSave(response.data);
    } catch (error) {
      console.error("Error in creating an assignment:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-2 border-green-500 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-black text-black flex items-center">
            <Plus className="w-8 h-8 mr-4 text-green-600" />
            UPLOAD QUESTION PAPER
          </CardTitle>
          <p className="text-gray-600 font-bold text-lg">
            Create and assign a new question paper
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-black text-black mb-2">
                  Paper Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-4 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter question paper title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full p-4 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Grade *
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: e.target.value })
                  }
                  className="w-full p-4 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  required
                >
                  <option value="">Select Grade</option>
                  <option value="9th">9th</option>
                  <option value="10th">10th</option>
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Total Marks *
                </label>
                <input
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) =>
                    setFormData({ ...formData, totalMarks: e.target.value })
                  }
                  className="w-full p-4 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter total marks"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Assignment Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Assigned By *
                </label>
                <select
                  value={formData.assignedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedBy: e.target.value })
                  }
                  className="w-full p-4 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher: any) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <select
                multiple
                className="border-2 border-black rounded-xl p-4 max-h-32 overflow-y-auto bg-white"
              >
                {batches.map((batch: any) => (
                  <option
                    key={batch._id}
                    value={batch._id}
                    onClick={() => handleBatchToggle(batch)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-sm font-bold ${
                      formData.assignedTo.includes(batch)
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submission Settings */}
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-black">
              <h3 className="text-xl font-black text-black mb-4">
                Submission Settings
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isSubmissionInClass"
                    checked={formData.isSubmissionInClass}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isSubmissionInClass: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-green-600 border-2 border-black rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="isSubmissionInClass"
                    className="font-bold text-black"
                  >
                    In-Class Submission Required
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isSubmissionOpen"
                    checked={formData.isSubmissionOpen}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isSubmissionOpen: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-green-600 border-2 border-black rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="isSubmissionOpen"
                    className="font-bold text-black"
                  >
                    Submission Open
                  </label>
                </div>
              </div>

              <div className="mt-4 text-sm font-semibold text-gray-600">
                <p>
                  <strong>In-Class Submission:</strong> Students must submit
                  during class time
                </p>
                <p>
                  <strong>Submission Open:</strong> Students can currently
                  submit their answers
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-black text-black mb-2">
                Upload Question Paper File
              </label>
              <div className="border-2 border-dashed border-black rounded-xl p-8 text-center hover:border-green-500 transition-colors bg-white">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="text-6xl">📄</div>
                    <div className="font-black text-gray-700 text-lg">
                      {formData.questionPaperLink
                        ? formData.questionPaperLink.name
                        : "Click to upload or drag and drop"}
                    </div>
                    <div className="text-sm font-bold text-gray-500">
                      PDF, DOC, DOCX, TXT up to 10MB
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black rounded-xl px-8 py-4"
              >
                Upload Paper
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="bg-black hover:bg-gray-800 text-white font-black border-2 border-gray-300 rounded-xl px-8 py-4"
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

function EditPaperModal({
  assignment,
  onClose,
  onSave,
  availableBatches,
  teachers,
}: {
  assignment: any;
  onClose: () => void;
  onSave: (batch: any) => void;
  availableBatches: any;
  teachers: any;
}) {
  const [formData, setFormData] = useState({
    ...assignment,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const questionPaperLink = e.target.files?.[0] || null;
    setFormData({ ...formData, questionPaperLink });
  };

  const [selectedBatches, setSelectedBatches] = useState(
    availableBatches.batchData.filter((b: any) =>
      assignment.assignedTo.includes(b._id),
    ),
  );

  console.log("formData -> ", formData);

  const filteredBatches = availableBatches.batchData.filter(
    (batch: any) => formData.grade === "" || batch.standard === formData.grade,
  );

  console.log("Available batches -> ", availableBatches);
  console.log("Filtered batches -> ", filteredBatches);

  const handleBatchToggleEdit = (batch: any) => {
    const isSelected = selectedBatches.some((b: any) => b._id === batch._id);

    if (isSelected) {
      setSelectedBatches((prev: any[]) =>
        prev.filter((s: any) => s._id !== batch._id),
      );
    } else {
      setSelectedBatches((prev: any) => [...prev, batch]);
    }
  };
  console.log("Selected Batch -> ", selectedBatches);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateAssignment = new FormData();
    updateAssignment.append("title", formData.title);
    updateAssignment.append("subject", formData.subject);
    updateAssignment.append("grade", formData.grade);
    updateAssignment.append(
      "createdDate",
      new Date().toISOString().split("T")[0],
    );
    updateAssignment.append("assignedTo", JSON.stringify(selectedBatches));
    updateAssignment.append("assignedBy", formData.assignedBy);
    updateAssignment.append("totalMarks", formData.totalMarks);
    updateAssignment.append(
      "isSubmissionInClass",
      formData.isSubmissionInClass,
    );
    updateAssignment.append("isSubmissionOpen", formData.isSubmissionOpen);
    updateAssignment.append(
      "questionPaperLink",
      formData.questionPaperLink as File,
    );
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/assignment/updateAssignment`,
        updateAssignment,
      );
      console.log("Successfully created assignment -> ", response.data);
      onSave(updateAssignment);
    } catch (error) {
      console.error("Error in updating an assignment:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-2 border-green-500 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-black text-black flex items-center">
            <Plus className="w-8 h-8 mr-4 text-green-600" />
            EDIT QUESTION PAPER
          </CardTitle>
          <p className="text-gray-600 font-bold text-lg">
            Edit your question paper
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-black text-black mb-2">
                  Paper Title *
                </label>
                <input
                  type="text"
                  className="w-full p-4 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter question paper title"
                  required
                  defaultValue={formData.title}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full p-4 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Grade *
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: e.target.value })
                  }
                  className="w-full p-4 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  required
                >
                  <option value="">Select Grade</option>
                  <option value="9th">9th</option>
                  <option value="10th">10th</option>
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Total Marks *
                </label>
                <input
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) =>
                    setFormData({ ...formData, totalMarks: e.target.value })
                  }
                  className="w-full p-4 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter total marks"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Assignment Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-black mb-2">
                  Assigned By *
                </label>
                <select
                  value={formData.assignedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedBy: e.target.value })
                  }
                  className="w-full p-4 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher: any) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-black rounded-xl p-4 max-h-32 overflow-y-auto bg-white">
                {filteredBatches.map((batch: any) => {
                  const isSelected = selectedBatches.some(
                    (b: any) => b._id === batch._id,
                  );

                  return (
                    <div
                      key={batch._id}
                      onClick={() => handleBatchToggleEdit(batch)}
                      className={`border w-1/4 rounded m-2 p-2 cursor-pointer transition ${
                        isSelected ? "bg-green-200" : "bg-white"
                      }`}
                    >
                      <div className="font-semibold">{batch.name}</div>
                      <div className="text-sm text-gray-600">
                        {batch.standard}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submission Settings */}
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-black">
              <h3 className="text-xl font-black text-black mb-4">
                Submission Settings
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isSubmissionInClass"
                    checked={formData.isSubmissionInClass}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isSubmissionInClass: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-green-600 border-2 border-black rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="isSubmissionInClass"
                    className="font-bold text-black"
                  >
                    In-Class Submission Required
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isSubmissionOpen"
                    checked={formData.isSubmissionOpen}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isSubmissionOpen: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-green-600 border-2 border-black rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="isSubmissionOpen"
                    className="font-bold text-black"
                  >
                    Submission Open
                  </label>
                </div>
              </div>

              <div className="mt-4 text-sm font-semibold text-gray-600">
                <p>
                  <strong>In-Class Submission:</strong> Students must submit
                  during class time
                </p>
                <p>
                  <strong>Submission Open:</strong> Students can currently
                  submit their answers
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-black text-black mb-2">
                Upload Question Paper File
              </label>
              <div className="border-2 border-dashed border-black rounded-xl p-8 text-center hover:border-green-500 transition-colors bg-white">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="text-6xl">📄</div>
                    <div className="font-black text-gray-700 text-lg">
                      {formData.questionPaperLink
                        ? formData.questionPaperLink.name
                          ? formData.questionPaperLink.name
                          : formData.questionPaperLink.split("/").pop()
                        : "Click to upload or drag and drop"}
                    </div>
                    <div className="text-sm font-bold text-gray-500">
                      PDF, DOC, DOCX, TXT up to 10MB
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black rounded-xl px-8 py-4"
              >
                Upload Paper
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="bg-black hover:bg-gray-800 text-white font-black border-2 border-gray-300 rounded-xl px-8 py-4"
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

function ViewPaperModal({
  assignment,
  onClose,
  displayedBatches,
  displayedTeacher,
}: {
  assignment: any;
  onClose: () => void;
  displayedTeacher: any;
  displayedBatches: any;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-2 border-green-500 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-black">
            ASSIGNMENT DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Batch Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <h3 className="font-black text-black mb-2">
                  Assignment Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Title:</span>{" "}
                    {assignment.title}
                  </p>
                  <p>
                    <span className="font-semibold">Subject:</span>{" "}
                    {assignment.subject}
                  </p>
                  <p>
                    <span className="font-semibold">Standard:</span>{" "}
                    {assignment.grade}
                  </p>
                  <p>
                    <span className="font-semibold">Total Marks:</span>{" "}
                    {assignment.totalMarks}
                  </p>
                  <p>
                    <span className="font-semibold">Teacher:</span>{" "}
                    {displayedTeacher[assignment.assignedBy] || "NA"}
                  </p>
                  <p>
                    <span className="font-semibold">Created:</span>{" "}
                    {assignment.createdAt}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 text-wrap">
                <h3 className="font-black text-black mb-2">View question</h3>
                {/* <button
                  onClick={() =>
                    (window.location.href = `${assignment.questionPaperLink}`)
                  }
                >
                  Click here
                </button> */}
                <img src={assignment.questionPaperLink + ".jpg"} />
              </div>
            </div>

            {/* Assignment List */}
            <div>
              <h3 className="font-black text-black mb-4">
                Students in Batch ({assignment.assignedTo.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.isArray(displayedBatches.batchData) &&
                  assignment.assignedTo.map((a: any) => {
                    const batch = displayedBatches.batchData.find(
                      (batch: any) => batch._id === a,
                    );
                    return (
                      <li key={a}>
                        {batch
                          ? batch.name
                          : "Batch info not available (please refresh)"}
                      </li>
                    );
                  })}
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
