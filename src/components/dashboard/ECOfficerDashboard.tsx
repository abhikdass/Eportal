import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserCog,
  Calendar,
  CheckCircle,
  XCircle,
  Database,
  Users,
  LogOut,
  Home,
  Clock,
  UserCheck,
  UserX,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Save,
  FileText,
  GraduationCap,
  BookOpen,
} from "lucide-react";

interface ECOfficerDashboardProps {
  username?: string;
  onLogout?: () => void;
}

const ECOfficerDashboard: React.FC<ECOfficerDashboardProps> = ({
  username = "EC Officer",
  onLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem("ecOfficerAuth");
    // Navigate to home
    window.location.href = "/";
  },
}) => {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [electionDates, setElectionDates] = useState({
    nominationStart: "2024-07-01",
    nominationEnd: "2024-07-15",
    campaignStart: "2024-07-16",
    campaignEnd: "2024-07-30",
    votingDate: "2024-08-01",
    resultDate: "2024-08-02",
  });

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      position: "President",
      status: "Pending",
      email: "alice@example.com",
      department: "Computer Science",
    },
    {
      id: 2,
      name: "Bob Smith",
      position: "Vice President",
      status: "Approved",
      email: "bob@example.com",
      department: "Engineering",
    },
    {
      id: 3,
      name: "Carol Davis",
      position: "Secretary",
      status: "Pending",
      email: "carol@example.com",
      department: "Business",
    },
    {
      id: 4,
      name: "David Wilson",
      position: "Treasurer",
      status: "Rejected",
      email: "david@example.com",
      department: "Economics",
    },
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@student.edu",
      department: "Computer Science",
      year: "3rd Year",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@student.edu",
      department: "Engineering",
      year: "2nd Year",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@student.edu",
      department: "Business",
      year: "4th Year",
    },
  ]);

  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      email: "sarah@faculty.edu",
      department: "Computer Science",
      position: "Professor",
    },
    {
      id: 2,
      name: "Prof. Robert Brown",
      email: "robert@faculty.edu",
      department: "Engineering",
      position: "Associate Professor",
    },
  ]);

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
  });
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
  });
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const menuItems = [
    { id: "home", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    {
      id: "dates",
      label: "Election Dates",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      id: "candidates",
      label: "Candidate Approval",
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      id: "database",
      label: "Database Management",
      icon: <Database className="h-5 w-5" />,
    },
  ];

  const handleDateSave = () => {
    setAlert({
      type: "success",
      message: "Election dates updated successfully!",
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleCandidateApproval = (
    id: number,
    status: "Approved" | "Rejected",
  ) => {
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === id ? { ...candidate, status } : candidate,
      ),
    );
    setAlert({
      type: "success",
      message: `Candidate ${status.toLowerCase()} successfully!`,
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleAddStudent = () => {
    if (
      newStudent.name &&
      newStudent.email &&
      newStudent.department &&
      newStudent.year
    ) {
      const newId = Math.max(...students.map((s) => s.id)) + 1;
      setStudents([...students, { id: newId, ...newStudent }]);
      setNewStudent({ name: "", email: "", department: "", year: "" });
      setShowAddStudentForm(false);
      setAlert({ type: "success", message: "Student added successfully!" });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleAddTeacher = () => {
    if (
      newTeacher.name &&
      newTeacher.email &&
      newTeacher.department &&
      newTeacher.position
    ) {
      const newId = Math.max(...teachers.map((t) => t.id)) + 1;
      setTeachers([...teachers, { id: newId, ...newTeacher }]);
      setNewTeacher({ name: "", email: "", department: "", position: "" });
      setShowAddTeacherForm(false);
      setAlert({ type: "success", message: "Teacher added successfully!" });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleRemoveStudent = (id: number) => {
    setStudents(students.filter((student) => student.id !== id));
    setAlert({ type: "success", message: "Student removed successfully!" });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleRemoveTeacher = (id: number) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
    setAlert({ type: "success", message: "Teacher removed successfully!" });
    setTimeout(() => setAlert(null), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }) => (
    <motion.div variants={itemVariants}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            <div
              className={`p-3 rounded-full ${color.replace("bg-", "bg-").replace("-500", "-100")} dark:${color.replace("bg-", "bg-").replace("-500", "-900")}`}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 shadow-xl border-r border-white/20 p-4 flex flex-col"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
<<<<<<< HEAD
          <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">
            <UserCog className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
=======
          <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
            <UserCog className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
>>>>>>> 1a4c064 (New changes made)
            EC Officer Panel
          </h1>
        </div>

        <div className="flex-1">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                    : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
                {activeTab === item.id && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Button>
            ))}
          </nav>
        </div>

        <Separator className="my-4" />

        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
              />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                EC Officer
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 p-6 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {alert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert
                className={
                  alert.type === "success"
                    ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                    : "border-red-200 bg-red-50 dark:bg-red-900/20"
                }
              >
                <AlertDescription
                  className={
                    alert.type === "success"
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }
                >
                  {alert.message}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Dashboard Home */}
          {activeTab === "home" && (
            <motion.div variants={itemVariants}>
<<<<<<< HEAD
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
=======
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
>>>>>>> 1a4c064 (New changes made)
                EC Officer Dashboard
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Pending Candidates"
                  value={
                    candidates.filter((c) => c.status === "Pending").length
                  }
                  icon={<Clock className="h-6 w-6 text-orange-600" />}
                  color="bg-orange-500"
                />
                <StatCard
                  title="Approved Candidates"
                  value={
                    candidates.filter((c) => c.status === "Approved").length
                  }
                  icon={<CheckCircle className="h-6 w-6 text-green-600" />}
                  color="bg-green-500"
                />
                <StatCard
                  title="Total Students"
                  value={students.length}
                  icon={<GraduationCap className="h-6 w-6 text-blue-600" />}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Total Teachers"
                  value={teachers.length}
                  icon={<BookOpen className="h-6 w-6 text-purple-600" />}
                  color="bg-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Recent Candidate Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {candidates.slice(0, 3).map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {candidate.position}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              candidate.status === "Approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                : candidate.status === "Rejected"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                  : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
                            }`}
                          >
                            {candidate.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Election Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="font-medium">Nomination Period</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            electionDates.nominationStart,
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            electionDates.nominationEnd,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <span className="font-medium">Campaign Period</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            electionDates.campaignStart,
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            electionDates.campaignEnd,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="font-medium">Voting Day</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            electionDates.votingDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Election Dates */}
          {activeTab === "dates" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Set Election Dates
              </h1>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Election Schedule Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nomination-start">
                        Nomination Start Date
                      </Label>
                      <Input
                        id="nomination-start"
                        type="date"
                        value={electionDates.nominationStart}
                        onChange={(e) =>
                          setElectionDates({
                            ...electionDates,
                            nominationStart: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="nomination-end">
                        Nomination End Date
                      </Label>
                      <Input
                        id="nomination-end"
                        type="date"
                        value={electionDates.nominationEnd}
                        onChange={(e) =>
                          setElectionDates({
                            ...electionDates,
                            nominationEnd: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="campaign-start">
                        Campaign Start Date
                      </Label>
                      <Input
                        id="campaign-start"
                        type="date"
                        value={electionDates.campaignStart}
                        onChange={(e) =>
                          setElectionDates({
                            ...electionDates,
                            campaignStart: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="campaign-end">Campaign End Date</Label>
                      <Input
                        id="campaign-end"
                        type="date"
                        value={electionDates.campaignEnd}
                        onChange={(e) =>
                          setElectionDates({
                            ...electionDates,
                            campaignEnd: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="voting-date">Voting Date</Label>
                      <Input
                        id="voting-date"
                        type="date"
                        value={electionDates.votingDate}
                        onChange={(e) =>
                          setElectionDates({
                            ...electionDates,
                            votingDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="result-date">
                        Result Announcement Date
                      </Label>
                      <Input
                        id="result-date"
                        type="date"
                        value={electionDates.resultDate}
                        onChange={(e) =>
                          setElectionDates({
                            ...electionDates,
                            resultDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleDateSave}
                    className="mt-6 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 transition-all duration-300"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Election Dates
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Candidate Approval */}
          {activeTab === "candidates" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Candidate Approval Portal
              </h1>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Candidate Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidates.map((candidate) => (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                              {candidate.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{candidate.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {candidate.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {candidate.department}
                            </p>
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                              {candidate.position}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${
                              candidate.status === "Approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                : candidate.status === "Rejected"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                  : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
                            }`}
                          >
                            {candidate.status}
                          </span>
                          {candidate.status === "Pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleCandidateApproval(
                                    candidate.id,
                                    "Approved",
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleCandidateApproval(
                                    candidate.id,
                                    "Rejected",
                                  )
                                }
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Database Management */}
          {activeTab === "database" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Database Management
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Students Management */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Students Management
                      </CardTitle>
                      <Button
                        size="sm"
                        onClick={() =>
                          setShowAddStudentForm(!showAddStudentForm)
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Student
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showAddStudentForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20"
                      >
                        <div className="grid grid-cols-1 gap-3">
                          <Input
                            placeholder="Student Name"
                            value={newStudent.name}
                            onChange={(e) =>
                              setNewStudent({
                                ...newStudent,
                                name: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Email"
                            type="email"
                            value={newStudent.email}
                            onChange={(e) =>
                              setNewStudent({
                                ...newStudent,
                                email: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Department"
                            value={newStudent.department}
                            onChange={(e) =>
                              setNewStudent({
                                ...newStudent,
                                department: e.target.value,
                              })
                            }
                          />
                          <Select
                            value={newStudent.year}
                            onValueChange={(value) =>
                              setNewStudent({ ...newStudent, year: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1st Year">1st Year</SelectItem>
                              <SelectItem value="2nd Year">2nd Year</SelectItem>
                              <SelectItem value="3rd Year">3rd Year</SelectItem>
                              <SelectItem value="4th Year">4th Year</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleAddStudent}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowAddStudentForm(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {students.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {student.department} - {student.year}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveStudent(student.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Teachers Management */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Teachers Management
                      </CardTitle>
                      <Button
                        size="sm"
                        onClick={() =>
                          setShowAddTeacherForm(!showAddTeacherForm)
                        }
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Teacher
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showAddTeacherForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-4 p-4 border rounded-lg bg-purple-50 dark:bg-purple-900/20"
                      >
                        <div className="grid grid-cols-1 gap-3">
                          <Input
                            placeholder="Teacher Name"
                            value={newTeacher.name}
                            onChange={(e) =>
                              setNewTeacher({
                                ...newTeacher,
                                name: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Email"
                            type="email"
                            value={newTeacher.email}
                            onChange={(e) =>
                              setNewTeacher({
                                ...newTeacher,
                                email: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Department"
                            value={newTeacher.department}
                            onChange={(e) =>
                              setNewTeacher({
                                ...newTeacher,
                                department: e.target.value,
                              })
                            }
                          />
                          <Select
                            value={newTeacher.position}
                            onValueChange={(value) =>
                              setNewTeacher({ ...newTeacher, position: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Professor">
                                Professor
                              </SelectItem>
                              <SelectItem value="Associate Professor">
                                Associate Professor
                              </SelectItem>
                              <SelectItem value="Assistant Professor">
                                Assistant Professor
                              </SelectItem>
                              <SelectItem value="Lecturer">Lecturer</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleAddTeacher}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowAddTeacherForm(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {teachers.map((teacher) => (
                        <div
                          key={teacher.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {teacher.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {teacher.department} - {teacher.position}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveTeacher(teacher.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ECOfficerDashboard;
