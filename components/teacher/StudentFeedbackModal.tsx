"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Star, Trash2 } from "lucide-react";

interface StudentFeedbackModalProps {
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  existingFeedback?: any;
  onClose: () => void;
  onSave: (data: {
    feedback: string;
    performanceRating: number;
    strengths: string[];
    areasForImprovement: string[];
  }) => void;
}

export default function StudentFeedbackModal({
  student,
  existingFeedback,
  onClose,
  onSave,
}: StudentFeedbackModalProps) {
  const [feedback, setFeedback] = useState(existingFeedback?.feedback || "");
  const [performanceRating, setPerformanceRating] = useState(
    existingFeedback?.performanceRating || 3
  );
  const [strengths, setStrengths] = useState<string[]>(
    existingFeedback?.strengths || []
  );
  const [newStrength, setNewStrength] = useState("");
  const [areasForImprovement, setAreasForImprovement] = useState<string[]>(
    existingFeedback?.areasForImprovement || []
  );
  const [newArea, setNewArea] = useState("");

  const handleAddStrength = () => {
    if (newStrength.trim()) {
      setStrengths([...strengths, newStrength.trim()]);
      setNewStrength("");
    }
  };

  const handleRemoveStrength = (index: number) => {
    setStrengths(strengths.filter((_, i) => i !== index));
  };

  const handleAddArea = () => {
    if (newArea.trim()) {
      setAreasForImprovement([...areasForImprovement, newArea.trim()]);
      setNewArea("");
    }
  };

  const handleRemoveArea = (index: number) => {
    setAreasForImprovement(areasForImprovement.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSave({
      feedback,
      performanceRating,
      strengths,
      areasForImprovement,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-2 border-purple-500 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <CardHeader className="flex flex-row justify-between items-center pb-3 border-b-2 border-gray-200 sticky top-0 bg-white">
          <div>
            <CardTitle className="text-2xl font-black text-black">
              Student Feedback
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {student.firstName} {student.lastName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </CardHeader>

        {/* Content */}
        <CardContent className="pt-6 space-y-6">
          {/* Overall Feedback */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Overall Feedback:
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide comprehensive feedback about the student's overall performance..."
              rows={4}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Performance Rating */}
          <div>
            <label className="block text-sm font-bold text-black mb-3">
              Performance Rating:
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setPerformanceRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= performanceRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-lg font-bold text-black">
                {performanceRating}/5
              </span>
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <label className="block text-sm font-bold text-green-700 mb-3">
              Strengths:
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                placeholder="Add a strength..."
                className="flex-1 px-3 py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddStrength();
                  }
                }}
              />
              <Button
                onClick={handleAddStrength}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 rounded border-2 border-black"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {strengths.map((strength, idx) => (
                <div
                  key={idx}
                  className="bg-green-200 text-green-700 px-3 py-1 rounded-lg font-semibold flex items-center gap-2"
                >
                  {strength}
                  <button
                    onClick={() => handleRemoveStrength(idx)}
                    className="hover:text-green-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
            <label className="block text-sm font-bold text-orange-700 mb-3">
              Areas for Improvement:
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Add an area for improvement..."
                className="flex-1 px-3 py-2 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddArea();
                  }
                }}
              />
              <Button
                onClick={handleAddArea}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 rounded border-2 border-black"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {areasForImprovement.map((area, idx) => (
                <div
                  key={idx}
                  className="bg-orange-200 text-orange-700 px-3 py-1 rounded-lg font-semibold flex items-center gap-2"
                >
                  {area}
                  <button
                    onClick={() => handleRemoveArea(idx)}
                    className="hover:text-orange-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
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
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold border-2 border-black rounded-lg"
            >
              Save Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
