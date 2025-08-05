"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function QuestionPapersPage() {
  const router = useRouter();
  type QuestionPaper = {
    _id: number;
    title: string;
    subject: string;
    grade: string;
    createdDate: string;
    createdBy: string;
    assignedTo?: string[];
    totalMarks?: number;
    isSubmissionInClass?: boolean;
    isSubmissionOpen?: boolean;
    questionPaperLink?: string;
  };

  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [teachers, setTeachers] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [displayedBatches, setDisplayedBatches] = useState<{
    [key: string]: string;
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
    fetchAdminData();
    fetchTeacherNames();
    fetchBatchDetails();
    fetchQuestionPaperDetails();
  }, []);

  const fetchAdminData = async () => {
    try {
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getUserType`,
        {
          withCredentials: true,
        }
      );

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

  const fetchTeacherNames = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getTeacherData`
      );
      setTeachers(response.data.teacherData);
    } catch (error) {
      console.error("Error in fetching teacher details:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  };

  const fetchBatchDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getBatchData`
      );
      console.log("Inside batches -> ", response.data);
      setBatches(response.data.batchData);
    } catch (error) {
      console.error("Error in fetching teacher details:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  };

  const fetchQuestionPaperDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/assignment/getAssignment`
      );
      const assignmentData = response.data;
      setQuestionPapers(assignmentData);
      await fetchingTeacherAndBatchDisplayDetails(assignmentData);
    } catch (error) {
      console.error("Error in fetching assignment details:", error);
    }
  };

  const fetchingTeacherAndBatchDisplayDetails = async (
    assignmentData: any[]
  ) => {
    console.log(assignmentData);
    try {
      // 🔹 Fetch teacher names
      const teacherPromises = assignmentData.map((assignment) =>
        axios.get(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/getTeacherDisplayData`,
          {
            params: { teacherId: assignment.assignedBy },
          }
        )
      );
      const teacherResponses = await Promise.all(teacherPromises);
      const teacherMap: { [key: string]: string } = {};
      teacherResponses.forEach((res, i) => {
        teacherMap[assignmentData[i].assignedBy] = res.data;
      });
      setDisplayedTeacher(teacherMap);

      // 🔹 Gather all unique batch IDs
      const allBatchIds = [
        ...new Set(
          assignmentData.flatMap((assignment) =>
            assignment.assignedTo.map((id: any) => String(id))
          )
        ),
      ];

      // 🔹 Fetch student name map
      const batchRes = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getBatchData`,
        {
          params: {
            batchIds: allBatchIds,
          },
          paramsSerializer: (params) =>
            params.batchIds.map((id: string) => `batchIds=${id}`).join("&"),
        }
      );

      setDisplayedBatches(batchRes.data); // a map { studentId: "Name" }
    } catch (error) {
      console.error(
        "Error in fetching teacher or batch display details:",
        error
      );
    }
  };

  const filteredPapers = questionPapers.filter((paper) => {
    const title = paper?.title?.toLowerCase() ?? "";
    const createdBy = paper?.createdBy?.toLowerCase() ?? "";
    const search = searchTerm.toLowerCase();
    const matchesSearch = title.includes(search) || createdBy.includes(search);
    const matchesSubject = !filterSubject || paper.subject === filterSubject;
    const matchesGrade = !filterGrade || paper.grade === filterGrade;
    return matchesSearch && matchesSubject && matchesGrade;
  });

  const handleViewBatch = (batch: any) => {
    setSelectedAssignment(batch);
    setShowViewModal(true);
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
                  QUESTION PAPERS
                </h1>
                <p className="text-lg font-bold text-green-100">
                  Manage examination question papers and assessments
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl">
                <Download className="w-5 h-5 mr-2" />
                Export
              </Button>
              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black rounded-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Upload Paper
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
                  placeholder="Search question papers by title or creator..."
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
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                  className="px-4 py-4 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none bg-white"
                >
                  <option value="">All Grades</option>
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-green-500 border-2 border-white rounded-xl p-6 text-center hover:bg-green-600 transition-colors">
            <FileText className="w-10 h-10 text-white mx-auto mb-3" />
            <div className="text-4xl font-black text-white">
              {questionPapers.length}
            </div>
            <div className="text-sm font-bold text-green-100">Total Papers</div>
          </Card>
        </div>

        {/* Question Papers List */}
        <Card className="bg-white border-2 border-green-500 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-black flex items-center">
              <FileText className="w-8 h-8 mr-4 text-green-600" />
              Question Paper Bank ({filteredPapers.length} papers)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredPapers.map((paper) => (
                <Card
                  key={paper._id}
                  className="bg-gray-50 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center">
                      <div className="lg:col-span-2">
                        <h3 className="text-xl font-black text-black mb-1">
                          {paper.title}
                        </h3>
                        <p className="text-gray-600 font-bold text-sm mb-1">
                          {paper.subject} - {paper.grade}
                        </p>
                        <p className="text-green-600 font-black text-sm">
                          {/* By: {paper.assignedBy} */}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-gray-700 font-bold text-sm">
                          {paper.createdDate}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleViewBatch(paper)}
                          className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black text-xs px-2 py-2 rounded-xl"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black text-xs px-2 py-2 rounded-xl">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black text-xs px-2 py-2 rounded-xl">
                          Edit
                        </Button>
                        <Button className="bg-black hover:bg-gray-800 text-white font-black border-2 border-gray-300 text-xs px-2 py-2 rounded-xl">
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

        {/* View Batch Modal */}
        {showViewModal && selectedAssignment && (
          <ViewBatchModal
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

// Upload Paper Modal Component
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
      formData.questionPaperLink as File
    );

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/assignment/createAssignment`,
        newAssignment
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

function ViewBatchModal({
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
            BATCH DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Batch Info */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <h3 className="font-black text-black mb-2">
                  Batch Information
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
            </div>

            {/* Assignment List */}
            <div>
              <h3 className="font-black text-black mb-4">
                Students in Batch ({assignment.assignedTo.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assignment.assignedTo.map((a: any, i: any) => (
                  <li key={a}>
                    {
                      displayedBatches.batchData.find(
                        (batch: any) => batch._id === a
                      ).name
                    }
                  </li>
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
