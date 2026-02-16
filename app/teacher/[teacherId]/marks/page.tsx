"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  FileText,
  Search,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import MarkGradingModal from "@/components/teacher/MarkGradingModal";

type Assignment = {
  _id: string;
  title: string;
  subject: string;
  totalMarks: string;
  submissions: any[];
};

export default function MarksManagementPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.teacherId as string;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showMarkingModal, setShowMarkingModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/teacher/getAssignmentsForMarking`,
        {
          params: { teacherId },
        }
      );
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkClick = (submission: any) => {
    setSelectedSubmission(submission);
    setShowMarkingModal(true);
  };

  const handleSaveMarks = async (marksData: any) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/marks/updateMarks`,
        {
          submissionId: selectedSubmission._id,
          ...marksData,
        }
      );
      // Refresh assignments
      await fetchAssignments();
      setShowMarkingModal(false);
    } catch (error) {
      console.error("Error saving marks:", error);
      alert("Failed to save marks");
    }
  };

  const handleDeleteMarks = async (submissionId: string) => {
    if (!confirm("Are you sure you want to delete the marks?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/marks/deleteMarks`,
        {
          params: { submissionId },
        }
      );
      await fetchAssignments();
    } catch (error) {
      console.error("Error deleting marks:", error);
      alert("Failed to delete marks");
    }
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-2">
              Marks Management
            </h1>
            <p className="text-gray-300">Give and manage student marks</p>
          </div>
          <Button
            onClick={() => router.back()}
            className="bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search assignments..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Assignments List */}
        {filteredAssignments.length === 0 ? (
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-xl font-bold text-gray-600 mb-2">
                {searchTerm ? "No assignments found" : "No assignments yet"}
              </p>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search"
                  : "Assignments will appear here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <Card
                key={assignment._id}
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-black text-black">
                        {assignment.title}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">
                        Subject: <span className="font-bold">{assignment.subject}</span>
                      </p>
                      <p className="text-gray-600">
                        Total Marks: <span className="font-bold">{assignment.totalMarks}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-green-600">
                        {
                          assignment.submissions.filter(
                            (s) => s.status === "graded"
                          ).length
                        }{" "}
                        / {assignment.submissions.length}
                      </div>
                      <p className="text-sm text-gray-600">Graded</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {assignment.submissions.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      No submissions yet
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-2 px-3 font-bold text-black">
                              Student
                            </th>
                            <th className="text-center py-2 px-3 font-bold text-black">
                              Marks
                            </th>
                            <th className="text-center py-2 px-3 font-bold text-black">
                              Status
                            </th>
                            <th className="text-center py-2 px-3 font-bold text-black">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {assignment.submissions.map((submission) => (
                            <tr
                              key={submission._id}
                              className="border-b border-gray-200 hover:bg-gray-100"
                            >
                              <td className="py-3 px-3">
                                <div className="font-bold text-black">
                                  {submission.submittedBy?.firstName}{" "}
                                  {submission.submittedBy?.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {submission.submittedBy?.email}
                                </div>
                              </td>
                              <td className="text-center py-3 px-3">
                                <div className="font-black text-green-600 text-lg">
                                  {submission.marksScored}
                                </div>
                              </td>
                              <td className="text-center py-3 px-3">
                                <span
                                  className={`px-3 py-1 rounded-lg font-bold text-xs border-2 ${
                                    submission.status === "graded"
                                      ? "bg-green-100 border-green-500 text-green-700"
                                      : submission.status === "submitted"
                                        ? "bg-blue-100 border-blue-500 text-blue-700"
                                        : "bg-gray-100 border-gray-500 text-gray-700"
                                  }`}
                                >
                                  {submission.status}
                                </span>
                              </td>
                              <td className="text-center py-3 px-3 space-x-2">
                                <Button
                                  onClick={() => handleMarkClick(submission)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-1 rounded text-xs border-2 border-black"
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Mark
                                </Button>
                                {submission.marksScored > 0 && (
                                  <Button
                                    onClick={() =>
                                      handleDeleteMarks(submission._id)
                                    }
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded text-xs border-2 border-black"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Marking Modal */}
        {showMarkingModal && selectedSubmission && (
          <MarkGradingModal
            submission={selectedSubmission}
            totalMarks={parseInt(
              filteredAssignments.find(
                (a) =>
                  a._id ===
                  assignments.find(
                    (asn) =>
                      asn.submissions.find(
                        (s) => s._id === selectedSubmission._id
                      )
                  )?._id
              )?.totalMarks || "100"
            )}
            onClose={() => {
              setShowMarkingModal(false);
              setSelectedSubmission(null);
            }}
            onSave={handleSaveMarks}
          />
        )}
      </div>
    </div>
  );
}
