"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  X,
  Users,
  BookOpen,
  User,
  FileText,
  Calendar,
  Badge,
} from "lucide-react";

interface BatchDetailModalProps {
  isOpen: boolean;
  batch: any;
  studentMap:any;
  onClose: () => void;
  onEdit: () => void;
}

export default function BatchDetailModal({
  isOpen,
  batch,
  studentMap,
  onClose,
  onEdit,
}: BatchDetailModalProps) {
  if (!isOpen || !batch) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="bg-gradient-to-br from-white to-gray-50 border-3 border-green-500 rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <CardHeader className="flex flex-row justify-between items-start pb-4 border-b-3 border-green-500 bg-gradient-to-r from-green-50 to-white">
          <div>
            <CardTitle className="text-3xl font-black text-black mb-2">
              {batch.name}
            </CardTitle>
            <div className="flex gap-3 flex-wrap">
              <Badge className="bg-green-500 text-white px-3 py-1 rounded-full font-bold">
                {batch.subject}
              </Badge>
              <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full font-bold">
                {batch.standard}
              </Badge>
              <Badge
                className={`${
                  batch.status === "Active"
                    ? "bg-emerald-500"
                    : "bg-red-500"
                } text-white px-3 py-1 rounded-full font-bold`}
              >
                {batch.status}
              </Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Batch Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-blue-700">Subject</span>
              </div>
              <p className="text-xl font-black text-blue-900">{batch.subject}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-bold text-purple-700">
                  Standard
                </span>
              </div>
              <p className="text-xl font-black text-purple-900">
                {batch.standard}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-bold text-orange-700">
                  Total Students
                </span>
              </div>
              <p className="text-xl font-black text-orange-900">
                {batch.students?.length || 0}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-sm font-bold text-green-700">Status</span>
              </div>
              <p
                className={`text-xl font-black ${
                  batch.status === "Active"
                    ? "text-green-900"
                    : "text-red-900"
                }`}
              >
                {batch.status}
              </p>
            </div>
          </div>

          {/* Students Section */}
          {batch.students && batch.students.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-black text-blue-900">
                  Enrolled Students ({batch.students.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {batch.students.map((student: any, idx:number) => (
                  <div
                    key={idx}
                    className="bg-white p-3 rounded-lg border-2 border-blue-100 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-bold text-blue-900">
                      {studentMap[student]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Syllabus Section */}
          {batch.syllabus && batch.syllabus.length > 0 && (
            <div className="bg-green-50 p-4 h-60 rounded-xl border-2 border-green-200 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-black text-green-900">
                  Syllabus ({batch.syllabus.length} chapters)
                </h3>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {batch.syllabus.map((chapter: any, idx: number) => (
                  <div
                    key={chapter._id || idx}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                      chapter.topicCovered
                        ? "bg-green-200 border-green-400"
                        : "bg-white border-green-100"
                    }`}
                  >
                    <span className="font-bold text-lg text-green-700 flex-shrink-0">
                      {idx + 1}.
                    </span>
                    <span
                      className={`font-bold ${
                        chapter.topicCovered
                          ? "line-through text-green-800"
                          : "text-green-900"
                      }`}
                    >
                      {chapter.chapterName}
                    </span>
                    {chapter.topicCovered && (
                      <span className="text-xs font-black bg-green-600 text-white px-2 py-1 rounded ml-auto">
                        COVERED
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t-3 border-green-200">
            <Button
              onClick={onEdit}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-3 rounded-xl border-2 border-white transition"
            >
              Edit Batch
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-3 rounded-xl border-2 border-white transition"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
