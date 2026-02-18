"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Layers,
  Edit,
  Eye,
  Users,
  BookOpen,
  Search,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import BatchModalWithSyllabus from "@/components/shared/BatchModalWithSyllabus";
import BatchDetailModal from "@/components/shared/BatchDetailModal";

type Batch = {
  _id: string;
  name: string;
  subject: string;
  standard: string;
  students: any[];
  teacher: string;
  syllabus: any[];
  status: string;
};

export default function TeacherBatchesPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.teacherId as string;
  console.log(teacherId);

  const [batches, setBatches] = useState<Batch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [studentMap, setStudentMap] = useState<{ [key: string]: any }>({});
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/batch/getBatchData`,
      );
      const map: { [key: string]: any } = {};
      await Promise.all(
        response.data.map(async (batch: Batch) => {
          const studentResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/getStudentDisplayData`,
            {
              params: {
                studentIds: batch.students,
              },
              paramsSerializer: (params) =>
                params.studentIds
                  .map((id: string) => `studentIds=${id}`)
                  .join("&"),
            },
          );

          Object.entries(studentResponse.data).forEach(([k, v]) => {
            map[k] = v;
          });
        }),
      );
      setStudentMap(map);
      // Filter batches for current teacher
      const teacherBatches = response.data.filter(
        (batch: Batch) => batch.teacher === teacherId,
      );
      console.log(teacherBatches);
      console.log(studentMap);
      setBatches(teacherBatches);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBatch = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleViewBatch = (batch: Batch) => {
    setSelectedBatch(batch);
    setShowDetailModal(true);
  };

  const handleViewBatchToEdit = () => {
    setIsEditMode(true);
    setShowDetailModal(false);
    setShowModal(true);
  };

  const handleSaveBatch = async (data: any) => {
    try {
      console.log(data);
      if (isEditMode && selectedBatch) {
        // Update batch
        await axios.put(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/batch/updateBatchData`,
          {
            batchId: selectedBatch._id,
            ...data,
          },
        );
        // Update syllabus separately
        // await axios.put(
        //   `${process.env.NEXT_PUBLIC_DOMAIN}/api/batch/updateSyllabus`,
        //   {
        //     batchId: selectedBatch._id,
        //     syllabus: data.syllabus,
        //   },
        // );
      } else {
        // Create new batch
        await axios.post(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/batch/createBatch`,
          data,
        );
      }
      await fetchBatches();
      setShowModal(false);
      setSelectedBatch(null);
    } catch (error) {
      console.error("Error saving batch:", error);
      alert("Failed to save batch");
    }
  };

  const filteredBatches = batches.filter(
    (batch) =>
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.subject.toLowerCase().includes(searchTerm.toLowerCase()),
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
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-2">
              My Batches
            </h1>
            <p className="text-gray-300">
              View and manage your teaching batches
            </p>
          </div>
          <Button
            onClick={() => router.back()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold border-2 border-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-orange-500 rounded-2xl shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search batches..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Batches List */}

        {filteredBatches.length === 0 ? (
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-orange-500 rounded-2xl shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <Layers className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-xl font-bold text-gray-600 mb-2">
                {searchTerm ? "No batches found" : "No batches yet"}
              </p>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search"
                  : "Batches will appear here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-4">
            {filteredBatches.map((batch) => (
              <Card
                key={batch._id}
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-orange-500 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-black text-black">
                        {batch.name}
                      </CardTitle>
                      <div className="flex gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-600">Subject</p>
                          <p className="font-bold text-black">
                            {batch.subject}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Standard</p>
                          <p className="font-bold text-black">
                            {batch.standard}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p
                            className={`font-bold ${
                              batch.status === "Active"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {batch.status}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-orange-600">
                        {batch.students?.length || 0}
                      </div>
                      <p className="text-sm text-gray-600">
                        Student{batch.students?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Students List */}
                  {batch.students && batch.students.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 h-30 overflow-y-auto">
                      <p className="text-sm font-bold text-blue-700 mb-2">
                        <Users className="w-4 h-4 inline mr-1" />
                        Students Enrolled:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {batch.students.map((student, idx: number) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold"
                          >
                            {studentMap[student]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Syllabus List */}
                  {batch.syllabus && batch.syllabus.length >= 0 && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200 h-50 overflow-y-auto flex justify-start items-center">
                      <p className="text-sm font-bold text-green-700">
                        <BookOpen className="w-4 h-4 inline mr-1" />
                        Syllabus covered:
                      </p>
                      <p className="font-extrabold ml-2 text-green-800">
                        {(batch.syllabus.filter(
                          (syllabus: any) => syllabus.topicCovered,
                        ).length /
                          batch.syllabus.length) *
                          100}%
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => handleViewBatch(batch)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-2 rounded text-sm border-2 border-black"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleEditBatch(batch)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-2 rounded text-sm border-2 border-black"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Batch Detail Modal */}
        {showDetailModal && selectedBatch && (
          <BatchDetailModal
            isOpen={showDetailModal}
            batch={selectedBatch}
            studentMap={studentMap}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedBatch(null);
            }}
            onEdit={handleViewBatchToEdit}
          />
        )}

        {/* Batch Edit Modal */}
        {showModal && (
          <BatchModalWithSyllabus
            isOpen={showModal}
            isEditMode={isEditMode}
            initialData={selectedBatch}
            onClose={() => {
              setShowModal(false);
              setSelectedBatch(null);
            }}
            onSave={handleSaveBatch}
          />
        )}
      </div>
    </div>
  );
}
