"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Plus, Search, Download, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

export default function QuestionPapersPage() {
  const router = useRouter()
  const [questionPapers, setQuestionPapers] = useState([
    {
      id: 1,
      title: "Mathematics Mid-Term Exam",
      subject: "Mathematics",
      grade: "10th",
      questions: 25,
      difficulty: "Medium",
      createdDate: "2024-01-10",
      createdBy: "Dr. Rajesh Kumar",
      status: "Published",
      downloads: 45,
    },
    {
      id: 2,
      title: "Science Final Exam",
      subject: "Science",
      grade: "9th",
      questions: 30,
      difficulty: "Hard",
      createdDate: "2024-01-08",
      createdBy: "Prof. Sunita Sharma",
      status: "Draft",
      downloads: 12,
    },
    {
      id: 3,
      title: "English Grammar Test",
      subject: "English",
      grade: "11th",
      questions: 20,
      difficulty: "Easy",
      createdDate: "2024-01-05",
      createdBy: "Ms. Kavita Singh",
      status: "Published",
      downloads: 78,
    },
    {
      id: 4,
      title: "History Chapter Assessment",
      subject: "History",
      grade: "12th",
      questions: 35,
      difficulty: "Medium",
      createdDate: "2024-01-03",
      createdBy: "Mr. Amit Verma",
      status: "Published",
      downloads: 23,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [filterGrade, setFilterGrade] = useState("")

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "admin") {
      router.push("/")
      return
    }
  }, [router])

  const filteredPapers = questionPapers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = filterSubject === "" || paper.subject === filterSubject
    const matchesGrade = filterGrade === "" || paper.grade === filterGrade
    return matchesSearch && matchesSubject && matchesGrade
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 border-green-300 text-green-700"
      case "Medium":
        return "bg-yellow-100 border-yellow-300 text-yellow-700"
      case "Hard":
        return "bg-red-100 border-red-300 text-red-700"
      default:
        return "bg-gray-100 border-gray-300 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-2">
              QUESTION PAPERS
            </h1>
            <p className="text-xl font-semibold text-white">Manage examination question papers and assessments</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-white hover:bg-gray-100 text-black font-bold border-2 border-green-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search question papers by title or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                >
                  <option value="">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold focus:border-green-500 focus:ring-0"
                >
                  <option value="">All Grades</option>
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
                <Button className="bg-green-500 hover:bg-green-600 text-white font-bold border-2 border-black rounded-xl px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Paper
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg p-6 text-center">
            <FileText className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-black text-white">{questionPapers.length}</div>
            <div className="text-sm font-semibold text-white/90">Total Papers</div>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-black text-black">
              {questionPapers.filter((p) => p.status === "Published").length}
            </div>
            <div className="text-sm font-semibold text-gray-600">Published</div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-2 border-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-black text-white">
              {questionPapers.reduce((sum, p) => sum + p.questions, 0)}
            </div>
            <div className="text-sm font-semibold text-white/90">Total Questions</div>
          </Card>
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-black text-black">
              {questionPapers.reduce((sum, p) => sum + p.downloads, 0)}
            </div>
            <div className="text-sm font-semibold text-gray-600">Downloads</div>
          </Card>
        </div>

        {/* Question Papers List */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500 rounded-3xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black flex items-center">
              <FileText className="w-6 h-6 mr-3 text-green-600" />
              Question Paper Bank ({filteredPapers.length} papers)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPapers.map((paper) => (
                <Card
                  key={paper.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-center">
                      <div className="lg:col-span-2">
                        <h3 className="text-xl font-black text-black mb-1">{paper.title}</h3>
                        <p className="font-semibold text-gray-600 mb-1">
                          {paper.subject} - {paper.grade}
                        </p>
                        <p className="font-semibold text-green-600 text-sm">By: {paper.createdBy}</p>
                      </div>
                      <div className="text-center">
                        <span className="bg-blue-100 border-2 border-blue-300 text-blue-700 px-3 py-1 font-black text-sm rounded-lg">
                          {paper.questions} Q's
                        </span>
                      </div>
                      <div className="text-center">
                        <span
                          className={`px-3 py-1 border-2 font-bold text-sm rounded-lg ${getDifficultyColor(paper.difficulty)}`}
                        >
                          {paper.difficulty}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-700 text-sm">{paper.createdDate}</p>
                      </div>
                      <div className="text-center">
                        <span
                          className={`px-3 py-1 border-2 font-bold text-sm rounded-lg ${
                            paper.status === "Published"
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-yellow-100 border-yellow-300 text-yellow-700"
                          }`}
                        >
                          {paper.status}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-purple-600 text-sm">{paper.downloads} downloads</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button className="bg-green-500 text-white font-bold border-2 border-black text-xs px-2 py-2 rounded-lg hover:bg-green-600 transition-colors">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button className="bg-blue-500 text-white font-bold border-2 border-black text-xs px-2 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button className="bg-yellow-500 text-black font-bold border-2 border-black text-xs px-2 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
                          Edit
                        </Button>
                        <Button className="bg-red-500 text-white font-bold border-2 border-black text-xs px-2 py-2 rounded-lg hover:bg-red-600 transition-colors">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
