"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  MessageSquare,
  Search,
  Edit,
  Trash2,
  Star,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import StudentFeedbackModal from "@/components/teacher/StudentFeedbackModal";

type Student = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  standard: string;
  batchId: string;
  batchName: string;
};

export default function StudentFeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.teacherId as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [feedbackMap, setFeedbackMap] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/teacher/getStudentsForFeedback`,
        {
          params: { teacherId },
        }
      );
      setStudents(response.data.students);
      // Fetch existing feedback for each student
      await fetchAllFeedback(response.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFeedback = async (studentList: Student[]) => {
    try {
      const feedbackPromises = studentList.map((student) =>
        axios.get(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/feedback/getFeedback`,
          {
            params: {
              studentId: student._id,
              teacherId: teacherId,
            },
          }
        )
      );

      const responses = await Promise.all(feedbackPromises);
      const newFeedbackMap: any = {};

      responses.forEach((res, idx) => {
        if (res.data) {
          newFeedbackMap[studentList[idx]._id] = res.data;
        }
      });

      setFeedbackMap(newFeedbackMap);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const handleEditFeedback = (student: Student) => {
    setSelectedStudent(student);
    setShowFeedbackModal(true);
  };

  const handleSaveFeedback = async (feedbackData: any) => {
    if (!selectedStudent) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/feedback/createFeedback`,
        {
          student: selectedStudent._id,
          teacher: teacherId,
          batch: selectedStudent.batchId,
          ...feedbackData,
        }
      );
      // Update local feedback map
      setFeedbackMap((prev: any) => ({
        ...prev,
        [selectedStudent._id]: {
          ...feedbackData,
          student: selectedStudent,
        },
      }));
      setShowFeedbackModal(false);
    } catch (error) {
      console.error("Error saving feedback:", error);
      alert("Failed to save feedback");
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/feedback/deleteFeedback`,
        {
          params: { feedbackId },
        }
      );
      // Remove from feedback map
      const studentId = Object.keys(feedbackMap).find(
        (key) => feedbackMap[key]._id === feedbackId
      );
      if (studentId) {
        setFeedbackMap((prev: any) => {
          const updated = { ...prev };
          delete updated[studentId];
          return updated;
        });
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("Failed to delete feedback");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

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
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-2">
              Student Feedback
            </h1>
            <p className="text-gray-300">
              Provide feedback and ratings for student performance
            </p>
          </div>
          <Button
            onClick={() => router.back()}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold border-2 border-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-purple-500 rounded-2xl shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-purple-500 rounded-2xl shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-xl font-bold text-gray-600 mb-2">
                {searchTerm ? "No students found" : "No students yet"}
              </p>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search"
                  : "Students will appear here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => {
              const feedback = feedbackMap[student._id];
              return (
                <Card
                  key={student._id}
                  className="bg-gradient-to-br from-white to-gray-50 border-2 border-purple-500 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-black text-black">
                      {student.firstName} {student.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <p className="text-sm text-gray-500">
                      {student.batchName} - {student.standard}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {feedback ? (
                      <div className="space-y-3 bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div>
                          <p className="text-xs font-bold text-purple-700 mb-1">
                            PERFORMANCE RATING
                          </p>
                          <div className="flex items-center gap-2">
                            {renderStars(feedback.performanceRating)}
                            <span className="text-sm font-bold text-purple-700">
                              {feedback.performanceRating}/5
                            </span>
                          </div>
                        </div>

                        {feedback.feedback && (
                          <div>
                            <p className="text-xs font-bold text-purple-700 mb-1">
                              FEEDBACK
                            </p>
                            <p className="text-sm text-black line-clamp-3">
                              {feedback.feedback}
                            </p>
                          </div>
                        )}

                        {feedback.strengths?.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-green-700 mb-1">
                              STRENGTHS
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {feedback.strengths.map((strength: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                                >
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {feedback.areasForImprovement?.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-orange-700 mb-1">
                              AREAS FOR IMPROVEMENT
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {feedback.areasForImprovement.map((area: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
                                >
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4 text-sm">
                        No feedback provided yet
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleEditFeedback(student)}
                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold px-3 py-2 rounded text-sm border-2 border-black"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        {feedback ? "Edit" : "Add"}
                      </Button>
                      {feedback && (
                        <Button
                          onClick={() => handleDeleteFeedback(feedback._id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-2 rounded text-sm border-2 border-black"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && selectedStudent && (
          <StudentFeedbackModal
            student={selectedStudent}
            existingFeedback={feedbackMap[selectedStudent._id]}
            onClose={() => {
              setShowFeedbackModal(false);
              setSelectedStudent(null);
            }}
            onSave={handleSaveFeedback}
          />
        )}
      </div>
    </div>
  );
}
