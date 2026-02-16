"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Check } from "lucide-react";

interface MarkGradingModalProps {
  submission: any;
  totalMarks: number;
  onClose: () => void;
  onSave: (data: {
    marksScored: number;
    feedback: string;
    status: "pending" | "submitted" | "graded";
  }) => void;
}

export default function MarkGradingModal({
  submission,
  totalMarks,
  onClose,
  onSave,
}: MarkGradingModalProps) {
  const [marksScored, setMarksScored] = useState(submission.marksScored || 0);
  const [feedback, setFeedback] = useState(submission.feedback || "");
  const [status, setStatus] = useState(submission.status || "graded");
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (marksScored < 0) {
      newErrors.push("Marks cannot be negative");
    }
    if (marksScored > totalMarks) {
      newErrors.push(`Marks cannot exceed ${totalMarks}`);
    }
    if (feedback.trim().length === 0 && marksScored > 0) {
      newErrors.push("Please provide feedback when giving marks");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSave({
      marksScored: parseInt(marksScored.toString()),
      feedback,
      status: status as "pending" | "submitted" | "graded",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white border-2 border-green-500 rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <CardHeader className="flex flex-row justify-between items-center pb-3 border-b-2 border-gray-200">
          <div>
            <CardTitle className="text-2xl font-black text-black">
              Grade Submission
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {submission.submittedBy?.firstName}{" "}
              {submission.submittedBy?.lastName}
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
        <CardContent className="pt-6 space-y-4">
          {/* Submission Link */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Submission Link:
            </label>
            <a
              href={submission.submissionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm break-all"
            >
              {submission.submissionLink}
            </a>
          </div>

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

          {/* Marks Input */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Marks Scored (out of {totalMarks}):
            </label>
            <input
              type="number"
              min="0"
              max={totalMarks}
              value={marksScored}
              onChange={(e) => setMarksScored(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 font-bold text-lg"
            />
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Status:
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as "pending" | "submitted" | "graded"
                )
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 font-semibold"
            >
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>
          </div>

          {/* Feedback Textarea */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Feedback:
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide constructive feedback to the student..."
              rows={4}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-bold border-2 border-black rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-black rounded-lg flex items-center justify-center"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Marks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
