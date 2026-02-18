"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface SyllabusChapter {
  _id?: string;
  chapterName: string;
  topicCovered?: boolean;
  order: number;
}

interface BatchModalWithSyllabusProps {
  isOpen: boolean;
  isEditMode: boolean;
  initialData?: any;
  availableStudents?: any[];
  availableTeachers?: any[];
  onClose: () => void;
  onSave: (data: {
    name: string;
    subject: string;
    standard: string;
    students: string[];
    teacher: string;
    syllabus: SyllabusChapter[];
  }) => void;
}

export default function BatchModalWithSyllabus({
  isOpen,
  isEditMode,
  initialData,
  availableStudents,
  availableTeachers,
  onClose,
  onSave,
}: BatchModalWithSyllabusProps) {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    standard: "",
    students: [] as string[],
    teacher: "",
  });

  const [syllabus, setSyllabus] = useState<SyllabusChapter[]>([]);
  const [newChapterName, setNewChapterName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name || "",
        subject: initialData.subject || "",
        standard: initialData.standard || "",
        students: initialData.students || [],
        teacher: initialData.teacher || "",
      });
      setSyllabus(initialData.syllabus || []);
    } else {
      setFormData({
        name: "",
        subject: "",
        standard: "",
        students: [],
        teacher: "",
      });
      setSyllabus([]);
    }
    setNewChapterName("");
    setErrors([]);
  }, [isOpen, isEditMode, initialData]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push("Batch name is required");
    if (!formData.subject.trim()) newErrors.push("Subject is required");
    if (!formData.standard.trim()) newErrors.push("Standard is required");
    if (formData.students.length === 0) newErrors.push("Select at least one student");
    if (!formData.teacher) newErrors.push("Select a teacher");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleAddChapter = () => {
    if (newChapterName.trim()) {
      const newChapter: SyllabusChapter = {
        chapterName: newChapterName.trim(),
        topicCovered: false,
        order: syllabus.length,
      };
      setSyllabus([...syllabus, newChapter]);
      setNewChapterName("");
    }
  };

  const handleRemoveChapter = (index: number) => {
    setSyllabus(syllabus.filter((_, i) => i !== index));
  };

  const handleMoveChapter = (index: number, direction: "up" | "down") => {
    const newSyllabus = [...syllabus];
    if (direction === "up" && index > 0) {
      [newSyllabus[index], newSyllabus[index - 1]] = [
        newSyllabus[index - 1],
        newSyllabus[index],
      ];
    } else if (direction === "down" && index < syllabus.length - 1) {
      [newSyllabus[index], newSyllabus[index + 1]] = [
        newSyllabus[index + 1],
        newSyllabus[index],
      ];
    }
    setSyllabus(newSyllabus);
  };

  const handleToggleTopic = (index: number) => {
    const newSyllabus = [...syllabus];
    newSyllabus[index].topicCovered = !newSyllabus[index].topicCovered;
    setSyllabus(newSyllabus);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const processedSyllabus = syllabus.map((chapter, index) => ({
      chapterName: chapter.chapterName,
      topicCovered: chapter.topicCovered || false,
      order: index,
    }));
    console.log("processedSyllabus: ",processedSyllabus);

    onSave({
      ...formData,
      syllabus: processedSyllabus,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-2 border-green-500 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <CardHeader className="flex flex-row justify-between items-center pb-3 border-b-2 border-gray-200 sticky top-0 bg-white">
          <CardTitle className="text-2xl font-black text-black">
            {isEditMode ? "Edit Batch" : "Create New Batch"}
          </CardTitle>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </CardHeader>

        {/* Content */}
        <CardContent className="pt-6 space-y-4">
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
              {errors.map((error, idx) => (
                <p key={idx} className="text-red-700 text-sm font-semibold">
                  {error}
                </p>
              ))}
            </div>
          )}

          {/* Batch Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
            <h3 className="font-black text-black mb-4">Batch Details</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="col-span-2">
                <label className="block text-sm font-bold text-black mb-2">
                  Batch Name:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Class 10-A"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Subject:
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="e.g., Mathematics"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Standard */}
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Standard:
                </label>
                <input
                  type="text"
                  value={formData.standard}
                  onChange={(e) =>
                    setFormData({ ...formData, standard: e.target.value })
                  }
                  placeholder="e.g., 10"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Teacher */}
              {availableTeachers && availableTeachers.length > 0 && (
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-black mb-2">
                    Teacher:
                  </label>
                  <select
                    value={formData.teacher}
                    onChange={(e) =>
                      setFormData({ ...formData, teacher: e.target.value })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select a teacher</option>
                    {availableTeachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.fullName || teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Students Selection */}
          {availableStudents && availableStudents.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <h3 className="font-black text-black mb-4">Select Students:</h3>
              <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                {availableStudents.map((student) => (
                  <label
                    key={student._id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.students.includes(student._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            students: [...formData.students, student._id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            students: formData.students.filter(
                              (id) => id !== student._id
                            ),
                          });
                        }
                      }}
                      className="w-4 h-4 rounded border-2 border-blue-300"
                    />
                    <span className="text-sm font-semibold text-black">
                      {student.firstName} {student.lastName}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Syllabus Section */}
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <h3 className="font-black text-black mb-4">Syllabus (Chapters)</h3>

            {/* Add Chapter Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                placeholder="Enter chapter name..."
                className="flex-1 px-3 py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddChapter();
                  }
                }}
              />
              <Button
                onClick={handleAddChapter}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 rounded border-2 border-black"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Syllabus List */}
            {syllabus.length === 0 ? (
              <p className="text-center text-gray-600 py-4">
                No chapters added yet
              </p>
            ) : (
              <div className="space-y-2">
                {syllabus.map((chapter, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white p-3 rounded-lg border-2 border-green-200"
                  >
                    <input
                      type="checkbox"
                      checked={chapter.topicCovered || false}
                      onChange={() => handleToggleTopic(index)}
                      className="w-4 h-4 rounded border-2 border-green-300"
                    />
                    <span
                      className={`flex-1 font-semibold ${
                        chapter.topicCovered
                          ? "line-through text-gray-400"
                          : "text-black"
                      }`}
                    >
                      {chapter.chapterName}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleMoveChapter(index, "up")}
                        disabled={index === 0}
                        className="bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 text-white font-bold px-2 py-1 rounded text-xs border border-black"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleMoveChapter(index, "down")}
                        disabled={index === syllabus.length - 1}
                        className="bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 text-white font-bold px-2 py-1 rounded text-xs border border-black"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleRemoveChapter(index)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 rounded text-xs border border-black"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
            <Button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-bold border-2 border-black rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-black rounded-lg"
            >
              {isEditMode ? "Update" : "Create"} Batch
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
