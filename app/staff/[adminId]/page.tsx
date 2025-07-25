"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, GraduationCap, FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function StaffDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("students");
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, [router]);

  const fetchAdminData = async () => {
    try {
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getUserType`,
        {
          withCredentials: true,
        }
      );

      console.log("User data:", userRes.data);

      const { userType, email } = userRes.data.jwtDecoded;

      console.log(userType, email);

      if (userType !== "admin") {
        router.push("/");
        return;
      }

      const adminRes = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/getAdminData`,
        {
          params: { email },
        }
      );

      const adminPayload = adminRes.data.teacherData;
      setAdmin(adminPayload); // Assuming this is the parsed object already
      if (userType === "admin" && adminPayload) {
        const parsedAdmin = adminPayload;
        console.log("Admin member logged in:", parsedAdmin);
      }
    } catch (error) {
      console.error("Error during admin dashboard data fetch:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-green-500 mb-2">
              STAFF PANEL
            </h1>
            <p className="text-xl font-bold text-white">
              Manage students, teachers, and question papers
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-white hover:bg-gray-100 text-black font-black border-4 border-green-500 shadow-[4px_4px_0px_0px_#22c55e] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#22c55e] transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO DASHBOARD
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 flex-wrap">
          <Button
            onClick={() => setActiveTab("students")}
            className={`font-black border-4 border-green-500 shadow-[4px_4px_0px_0px_#22c55e] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#22c55e] transition-all ${
              activeTab === "students"
                ? "bg-green-500 text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            STUDENTS
          </Button>
          <Button
            onClick={() => setActiveTab("teachers")}
            className={`font-black border-4 border-green-500 shadow-[4px_4px_0px_0px_#22c55e] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#22c55e] transition-all ${
              activeTab === "teachers"
                ? "bg-green-500 text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            TEACHERS
          </Button>
          <Button
            onClick={() => setActiveTab("questions")}
            className={`font-black border-4 border-green-500 shadow-[4px_4px_0px_0px_#22c55e] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#22c55e] transition-all ${
              activeTab === "questions"
                ? "bg-green-500 text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            QUESTION PAPERS
          </Button>
        </div>

        {activeTab === "students" && <StudentManager />}
        {activeTab === "teachers" && <TeacherManager />}
        {activeTab === "questions" && <QuestionPaperManager />}
      </div>
    </div>
  );
}

function StudentManager() {
  const [students] = useState([
    {
      id: 1,
      name: "Aarav Sharma",
      email: "aarav@adhyayan.edu",
      grade: "10th",
      section: "A",
      phone: "9876543210",
      rollNo: "2024001",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@adhyayan.edu",
      grade: "10th",
      section: "B",
      phone: "9876543211",
      rollNo: "2024002",
    },
    {
      id: 3,
      name: "Arjun Singh",
      email: "arjun@adhyayan.edu",
      grade: "9th",
      section: "A",
      phone: "9876543212",
      rollNo: "2024003",
    },
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Add Student Form */}
      <Card className="lg:col-span-1 bg-green-500 border-4 border-white shadow-[8px_8px_0px_0px_#fff]">
        <CardHeader>
          <CardTitle className="text-xl font-black text-white">
            ADD STUDENT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-black text-white mb-1">
              FULL NAME
            </label>
            <input
              className="w-full p-2 border-4 border-black font-bold bg-white text-black"
              placeholder="Student name"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-white mb-1">
              EMAIL
            </label>
            <input
              className="w-full p-2 border-4 border-black font-bold bg-white text-black"
              placeholder="Email address"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-white mb-1">
              ROLL NUMBER
            </label>
            <input
              className="w-full p-2 border-4 border-black font-bold bg-white text-black"
              placeholder="Roll number"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-white mb-1">
              GRADE
            </label>
            <select className="w-full p-2 border-4 border-black font-bold bg-white text-black">
              <option>9th</option>
              <option>10th</option>
              <option>11th</option>
              <option>12th</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-black text-white mb-1">
              SECTION
            </label>
            <select className="w-full p-2 border-4 border-black font-bold bg-white text-black">
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-black text-white mb-1">
              PHONE
            </label>
            <input
              className="w-full p-2 border-4 border-black font-bold bg-white text-black"
              placeholder="Phone number"
            />
          </div>
          <Button className="w-full bg-black text-white font-black border-4 border-white shadow-[4px_4px_0px_0px_#fff] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#fff] transition-all">
            <Plus className="w-4 h-4 mr-2" />
            ADD STUDENT
          </Button>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card className="lg:col-span-3 bg-white border-4 border-green-500 shadow-[8px_8px_0px_0px_#22c55e]">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-black">
            STUDENT DATABASE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-gray-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]"
              >
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-black text-black">
                      {student.name}
                    </h3>
                    <p className="font-bold text-gray-700">{student.email}</p>
                    <p className="font-bold text-gray-600">
                      Roll: {student.rollNo}
                    </p>
                  </div>
                  <div>
                    <span className="bg-green-300 border-2 border-black px-2 py-1 font-black text-sm">
                      {student.grade}
                    </span>
                  </div>
                  <div>
                    <span className="bg-white border-2 border-black px-2 py-1 font-black text-sm">
                      SEC {student.section}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-700">{student.phone}</p>
                  </div>
                  <div className="md:col-span-2 flex space-x-2">
                    <Button className="bg-green-500 text-white font-black border-2 border-black text-xs px-2 py-1 hover:bg-green-600">
                      EDIT
                    </Button>
                    <Button className="bg-red-500 text-white font-black border-2 border-black text-xs px-2 py-1 hover:bg-red-600">
                      DELETE
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeacherManager() {
  const [teachers] = useState([
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      email: "rajesh@adhyayan.edu",
      subject: "Mathematics",
      phone: "9876543200",
      empId: "EMP001",
      status: "Active",
    },
    {
      id: 2,
      name: "Prof. Sunita Sharma",
      email: "sunita@adhyayan.edu",
      subject: "Science",
      phone: "9876543201",
      empId: "EMP002",
      status: "Active",
    },
    {
      id: 3,
      name: "Ms. Kavita Singh",
      email: "kavita@adhyayan.edu",
      subject: "English",
      phone: "9876543202",
      empId: "EMP003",
      status: "Active",
    },
    {
      id: 4,
      name: "Mr. Amit Verma",
      email: "amit@adhyayan.edu",
      subject: "History",
      phone: "9876543203",
      empId: "EMP004",
      status: "Active",
    },
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Add Teacher Form */}
      <Card className="lg:col-span-1 bg-white border-2 border-green-500 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-black text-black">
            ADD TEACHER
          </CardTitle>
          <p className="text-sm font-semibold text-gray-600">
            Or approve new registrations
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-black text-black mb-1">
              FULL NAME
            </label>
            <input
              className="w-full p-3 border-2 border-gray-300 font-semibold bg-white text-black rounded-xl focus:border-green-500"
              placeholder="Teacher name"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-black mb-1">
              EMAIL
            </label>
            <input
              className="w-full p-3 border-2 border-gray-300 font-semibold bg-white text-black rounded-xl focus:border-green-500"
              placeholder="Email address"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-black mb-1">
              EMPLOYEE ID
            </label>
            <input
              className="w-full p-3 border-2 border-gray-300 font-semibold bg-white text-black rounded-xl focus:border-green-500"
              placeholder="Employee ID"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-black mb-1">
              SUBJECT
            </label>
            <select className="w-full p-3 border-2 border-gray-300 font-semibold bg-white text-black rounded-xl focus:border-green-500">
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>History</option>
              <option>Geography</option>
              <option>Chemistry</option>
              <option>Physics</option>
              <option>Biology</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-black text-black mb-1">
              PHONE
            </label>
            <input
              className="w-full p-3 border-2 border-gray-300 font-semibold bg-white text-black rounded-xl focus:border-green-500"
              placeholder="Phone number"
            />
          </div>
          <Button className="w-full bg-green-500 text-white font-black border-2 border-black rounded-xl shadow-lg hover:bg-green-600 hover:translate-y-[-2px] transition-all duration-300">
            <Plus className="w-4 h-4 mr-2" />
            ADD TEACHER
          </Button>
        </CardContent>
      </Card>

      {/* Teacher List */}
      <Card className="lg:col-span-3 bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-white">
            TEACHER DATABASE
          </CardTitle>
          <p className="text-green-100 font-semibold">
            Manage all registered teachers
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white border-2 border-black p-4 rounded-xl shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-black text-black">
                      {teacher.name}
                    </h3>
                    <p className="font-semibold text-gray-700">
                      {teacher.email}
                    </p>
                    <p className="font-semibold text-gray-600">
                      ID: {teacher.empId}
                    </p>
                  </div>
                  <div>
                    <span className="bg-green-100 border-2 border-green-300 text-green-700 px-3 py-1 font-black text-sm rounded-lg">
                      {teacher.subject}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">
                      {teacher.phone}
                    </p>
                  </div>
                  <div>
                    <span className="bg-green-100 border-2 border-green-300 text-green-700 px-2 py-1 font-bold text-xs rounded-lg">
                      {teacher.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="bg-green-500 text-white font-bold border-2 border-black text-xs px-3 py-1 rounded-lg hover:bg-green-600 transition-colors">
                      EDIT
                    </Button>
                    <Button className="bg-red-500 text-white font-bold border-2 border-black text-xs px-3 py-1 rounded-lg hover:bg-red-600 transition-colors">
                      DELETE
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuestionPaperManager() {
  const [questionPapers] = useState([
    {
      id: 1,
      title: "Mathematics Mid-Term Exam",
      subject: "Mathematics",
      grade: "10th",
      questions: 25,
      difficulty: "Medium",
      createdDate: "2024-01-10",
    },
    {
      id: 2,
      title: "Science Final Exam",
      subject: "Science",
      grade: "9th",
      questions: 30,
      difficulty: "Hard",
      createdDate: "2024-01-08",
    },
    {
      id: 3,
      title: "English Grammar Test",
      subject: "English",
      grade: "11th",
      questions: 20,
      difficulty: "Easy",
      createdDate: "2024-01-05",
    },
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Add Question Paper Form */}
      <Card className="lg:col-span-1 bg-white border-4 border-green-500 shadow-[8px_8px_0px_0px_#22c55e]">
        <CardHeader>
          <CardTitle className="text-xl font-black text-black">
            UPLOAD QUESTION PAPER
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-black text-black mb-1">
              PAPER TITLE
            </label>
            <input
              className="w-full p-2 border-4 border-black font-bold bg-gray-100 text-black"
              placeholder="Question paper title"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-black mb-1">
              SUBJECT
            </label>
            <select className="w-full p-2 border-4 border-black font-bold bg-gray-100 text-black">
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>History</option>
              <option>Chemistry</option>
              <option>Physics</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-black text-black mb-1">
              GRADE
            </label>
            <select className="w-full p-2 border-4 border-black font-bold bg-gray-100 text-black">
              <option>9th</option>
              <option>10th</option>
              <option>11th</option>
              <option>12th</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-black text-black mb-1">
              DIFFICULTY
            </label>
            <select className="w-full p-2 border-4 border-black font-bold bg-gray-100 text-black">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-black text-black mb-1">
              TOTAL QUESTIONS
            </label>
            <input
              type="number"
              className="w-full p-2 border-4 border-black font-bold bg-gray-100 text-black"
              placeholder="Number of questions"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-black mb-1">
              UPLOAD FILE
            </label>
            <input
              type="file"
              className="w-full p-2 border-4 border-black font-bold bg-gray-100 text-black"
              accept=".pdf,.doc,.docx"
            />
          </div>
          <Button className="w-full bg-green-500 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] transition-all">
            <Plus className="w-4 h-4 mr-2" />
            UPLOAD PAPER
          </Button>
        </CardContent>
      </Card>

      {/* Question Paper List */}
      <Card className="lg:col-span-3 bg-green-500 border-4 border-white shadow-[8px_8px_0px_0px_#fff]">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-white">
            QUESTION PAPER BANK
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questionPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]"
              >
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-black text-black">
                      {paper.title}
                    </h3>
                    <p className="font-bold text-gray-700">
                      {paper.subject} - {paper.grade}
                    </p>
                    <p className="font-bold text-gray-600">
                      Created: {paper.createdDate}
                    </p>
                  </div>
                  <div>
                    <span className="bg-green-300 border-2 border-black px-2 py-1 font-black text-sm">
                      {paper.questions} Q's
                    </span>
                  </div>
                  <div>
                    <span
                      className={`border-2 border-black px-2 py-1 font-black text-sm ${
                        paper.difficulty === "Easy"
                          ? "bg-green-300"
                          : paper.difficulty === "Medium"
                          ? "bg-yellow-300"
                          : "bg-red-300"
                      }`}
                    >
                      {paper.difficulty}
                    </span>
                  </div>
                  <div className="md:col-span-3 flex space-x-2">
                    <Button className="bg-green-500 text-white font-black border-2 border-black text-xs px-2 py-1 hover:bg-green-600">
                      VIEW
                    </Button>
                    <Button className="bg-blue-500 text-white font-black border-2 border-black text-xs px-2 py-1 hover:bg-blue-600">
                      DOWNLOAD
                    </Button>
                    <Button className="bg-yellow-500 text-black font-black border-2 border-black text-xs px-2 py-1 hover:bg-yellow-600">
                      EDIT
                    </Button>
                    <Button className="bg-red-500 text-white font-black border-2 border-black text-xs px-2 py-1 hover:bg-red-600">
                      DELETE
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
