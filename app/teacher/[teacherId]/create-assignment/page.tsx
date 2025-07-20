"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Users, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreateAssignment() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    dueDate: "",
    description: "",
    instructions: "",
    maxMarks: "",
    selectedClasses: [] as string[],
  })

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const teacherData = localStorage.getItem("teacherData")

    if (userType !== "teacher" || !teacherData) {
      router.push("/")
      return
    }

    const parsedTeacher = JSON.parse(teacherData)
    setTeacher(parsedTeacher)
    setFormData((prev) => ({ ...prev, subject: parsedTeacher.subject }))
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating assignment:", formData)
    router.push("/teacher")
  }

  const handleClassSelection = (className: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(className)
        ? prev.selectedClasses.filter((c) => c !== className)
        : [...prev.selectedClasses, className],
    }))
  }

  const getSubjectColor = (subject: string) => {
    const colors = {
      Mathematics: "from-blue-500 to-blue-600",
      Science: "from-green-500 to-green-600",
      English: "from-purple-500 to-purple-600",
      History: "from-orange-500 to-orange-600",
    }
    return colors[subject as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-2">
              Create Assignment
            </h1>
            <p className="text-xl font-semibold text-white">Add a new assignment for your students</p>
            <p className="text-lg font-medium text-gray-300">
              Teacher: {teacher.name} ({teacher.subject})
            </p>
          </div>
          <Button
            onClick={() => router.push("/teacher")}
            className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-green-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Assignment Form - Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-3xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-black flex items-center">
                <FileText className="w-6 h-6 mr-3 text-green-600" />
                Assignment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Assignment Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-3 border-2 border-gray-300 font-semibold bg-white text-black rounded-xl focus:border-green-500 focus:ring-0"
                      placeholder="Enter assignment title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      className="w-full p-3 border-2 border-gray-300 font-semibold bg-gray-100 text-gray-600 rounded-xl"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full p-3 border-2 border-gray-300 font-semibold bg-white text-black rounded-xl focus:border-green-500 focus:ring-0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Maximum Marks</label>
                    <input
                      type="number"
                      value={formData.maxMarks}
                      onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                      className="w-full p-3 border-2 border-gray-300 font-semibold bg-white text-black rounded-xl focus:border-green-500 focus:ring-0"
                      placeholder="Enter max marks"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 font-semibold bg-white text-black h-24 rounded-xl focus:border-green-500 focus:ring-0"
                    placeholder="Enter assignment description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Instructions</label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 font-semibold bg-white text-black h-32 rounded-xl focus:border-green-500 focus:ring-0"
                    placeholder="Enter detailed instructions for students"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={formData.selectedClasses.length === 0}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-black rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Assignment
                  </Button>
                  <Button
                    type="button"
                    onClick={() => router.push("/teacher")}
                    className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Class Selection */}
            <Card
              className={`bg-gradient-to-br ${getSubjectColor(teacher.subject)} border-2 border-white rounded-2xl shadow-lg`}
            >
              <CardHeader>
                <CardTitle className="text-xl font-black text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Select Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {teacher.classes.map((className: string) => (
                    <div
                      key={className}
                      onClick={() => handleClassSelection(className)}
                      className={`p-3 border-2 font-bold text-center cursor-pointer rounded-xl transition-all duration-300 ${
                        formData.selectedClasses.includes(className)
                          ? "bg-white text-black border-black shadow-lg"
                          : "bg-white/20 text-white border-white/30 hover:bg-white/30"
                      }`}
                    >
                      Class {className}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/90 mt-3 font-semibold">
                  Selected: {formData.selectedClasses.length > 0 ? formData.selectedClasses.join(", ") : "None"}
                </p>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-black text-black flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-green-600" />
                  Attach Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 p-6 text-center bg-gray-50 rounded-xl hover:border-green-500 transition-colors duration-300">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="font-semibold text-gray-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  <input type="file" className="hidden" multiple accept=".pdf,.doc,.docx" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
