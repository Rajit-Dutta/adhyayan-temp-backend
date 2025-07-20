"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock students data for each teacher's classes
const CLASS_STUDENTS = {
  "10A": [
    { id: 1, name: "Aarav Sharma", rollNo: "10A001" },
    { id: 2, name: "Priya Patel", rollNo: "10A002" },
    { id: 3, name: "Arjun Singh", rollNo: "10A003" },
    { id: 4, name: "Kavya Reddy", rollNo: "10A004" },
    { id: 5, name: "Rohit Kumar", rollNo: "10A005" },
  ],
  "10B": [
    { id: 6, name: "Sneha Gupta", rollNo: "10B001" },
    { id: 7, name: "Vikram Joshi", rollNo: "10B002" },
    { id: 8, name: "Ananya Das", rollNo: "10B003" },
    { id: 9, name: "Karan Mehta", rollNo: "10B004" },
  ],
  "9A": [
    { id: 10, name: "Riya Agarwal", rollNo: "9A001" },
    { id: 11, name: "Siddharth Rao", rollNo: "9A002" },
    { id: 12, name: "Meera Nair", rollNo: "9A003" },
  ],
  "9B": [
    { id: 13, name: "Aditya Verma", rollNo: "9B001" },
    { id: 14, name: "Pooja Sharma", rollNo: "9B002" },
  ],
  "11A": [
    { id: 15, name: "Rahul Bansal", rollNo: "11A001" },
    { id: 16, name: "Divya Iyer", rollNo: "11A002" },
  ],
  "11B": [
    { id: 17, name: "Harsh Agrawal", rollNo: "11B001" },
    { id: 18, name: "Shreya Kapoor", rollNo: "11B002" },
  ],
  "12A": [
    { id: 19, name: "Nikhil Pandey", rollNo: "12A001" },
    { id: 20, name: "Sakshi Jain", rollNo: "12A002" },
  ],
  "12B": [
    { id: 21, name: "Varun Sinha", rollNo: "12B001" },
    { id: 22, name: "Tanya Malhotra", rollNo: "12B002" },
  ],
}

// Mock assignment data
const ASSIGNMENT_DATA = {
  1: {
    title: "Algebra Fundamentals",
    subject: "Mathematics",
    dueDate: "2024-01-15",
    maxMarks: 100,
    classes: ["10A", "10B"],
  },
  3: {
    title: "Chemical Reactions Lab",
    subject: "Science",
    dueDate: "2024-01-12",
    maxMarks: 50,
    classes: ["9A", "9B"],
  },
  5: {
    title: "Shakespeare Essay",
    subject: "English",
    dueDate: "2024-01-22",
    maxMarks: 75,
    classes: ["11A", "11B"],
  },
  6: {
    title: "World War II Analysis",
    subject: "History",
    dueDate: "2024-01-25",
    maxMarks: 80,
    classes: ["10B", "11A"],
  },
}

export default function AssignmentGrading({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [assignment, setAssignment] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])

  useEffect(() => {
    // Check authentication
    const userType = localStorage.getItem("userType")
    const teacherData = localStorage.getItem("teacherData")

    if (userType !== "teacher" || !teacherData) {
      router.push("/")
      return
    }

    const parsedTeacher = JSON.parse(teacherData)
    setTeacher(parsedTeacher)

    // Get assignment data
    const assignmentId = Number.parseInt(params.id)
    const assignmentData = ASSIGNMENT_DATA[assignmentId as keyof typeof ASSIGNMENT_DATA]

    if (assignmentData) {
      setAssignment(assignmentData)

      // Get students from all classes for this assignment
      const allStudents: any[] = []
      assignmentData.classes.forEach((className) => {
        const classStudents = CLASS_STUDENTS[className as keyof typeof CLASS_STUDENTS] || []
        classStudents.forEach((student) => {
          allStudents.push({
            ...student,
            className,
            submitted: Math.random() > 0.3, // Random submission status
            submissionDate: Math.random() > 0.5 ? "2024-01-14" : "",
            grade: "",
            remarks: "",
            marks: "",
          })
        })
      })
      setStudents(allStudents)
    }
  }, [router, params.id])

  if (!teacher || !assignment) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-bold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-green-500 mb-2">{assignment.title}</h1>
            <p className="text-xl font-bold text-white">Grade student submissions</p>
            <p className="text-lg font-bold text-gray-300">Teacher: {teacher.name}</p>
          </div>
          <Button
            onClick={() => router.push("/teacher")}
            className="bg-white hover:bg-gray-100 text-black font-black border-4 border-green-500 shadow-[4px_4px_0px_0px_#22c55e] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#22c55e] transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO ASSIGNMENTS
          </Button>
        </div>

        {/* Assignment Info */}
        <Card className="bg-green-500 border-4 border-white shadow-[4px_4px_0px_0px_#fff] mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-white">{assignment.subject}</div>
                <div className="text-sm font-bold text-white">SUBJECT</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">{assignment.dueDate}</div>
                <div className="text-sm font-bold text-white">DUE DATE</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">{assignment.maxMarks}</div>
                <div className="text-sm font-bold text-white">MAX MARKS</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">{assignment.classes.join(", ")}</div>
                <div className="text-sm font-bold text-white">CLASSES</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">
                  {students.filter((s) => s.submitted).length}/{students.length}
                </div>
                <div className="text-sm font-bold text-white">SUBMITTED</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Grading */}
        <Card className="bg-white border-4 border-green-500 shadow-[8px_8px_0px_0px_#22c55e]">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black">STUDENT SUBMISSIONS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="bg-gray-100 border-4 border-black p-6 shadow-[4px_4px_0px_0px_#000]">
                  <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center">
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-black text-black">{student.name}</h3>
                      <p className="font-bold text-gray-700">Roll No: {student.rollNo}</p>
                      <p className="font-bold text-green-600">Class: {student.className}</p>
                      {student.submitted && (
                        <p className="font-bold text-gray-600">Submitted: {student.submissionDate}</p>
                      )}
                      <span
                        className={`inline-block px-2 py-1 border-2 border-black font-black text-xs mt-2 ${
                          student.submitted ? "bg-green-300" : "bg-red-300"
                        }`}
                      >
                        {student.submitted ? "SUBMITTED" : "NOT SUBMITTED"}
                      </span>
                    </div>

                    {student.submitted && (
                      <div>
                        <Button className="bg-blue-500 text-white font-black border-2 border-black text-xs px-3 py-2 hover:bg-blue-600">
                          <Eye className="w-3 h-3 mr-1" />
                          VIEW
                        </Button>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-black text-black mb-1">MARKS</label>
                      <input
                        type="number"
                        max={assignment.maxMarks}
                        defaultValue={student.marks}
                        className="w-full p-2 border-4 border-black font-bold text-center bg-white"
                        placeholder={`/${assignment.maxMarks}`}
                        disabled={!student.submitted}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-black text-black mb-1">GRADE</label>
                      <select
                        defaultValue={student.grade}
                        className="w-full p-2 border-4 border-black font-bold bg-white"
                        disabled={!student.submitted}
                      >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                      </select>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-black text-black mb-1">REMARKS</label>
                      <input
                        type="text"
                        defaultValue={student.remarks}
                        className="w-full p-2 border-4 border-black font-bold bg-white"
                        placeholder="Add remarks"
                        disabled={!student.submitted}
                      />
                    </div>

                    <div>
                      <Button
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-black border-4 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000] transition-all"
                        disabled={!student.submitted}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        SAVE
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
