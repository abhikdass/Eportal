import React, { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  onLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  },
}) => {
  const [username, setUsername] = useState<string>("EC Officer");
  
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setUsername(storedName);
  }, []);

  // Fetch students list from API
  const fetchStudents = async () => {
    try {
      setIsLoadingStudents(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ec/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch students");

      const data = await response.json();
      
      // Handle different response formats
      const studentsArray = Array.isArray(data) ? data : (data.students || data.data || []);
      
      // Transform API data to match the expected format
      const formattedStudents = studentsArray.map((student: any, index: number) => ({
        id: index + 1,
        name: student.name || "Unknown",
        email: student.username || student.email || "N/A", // Store username in email field for display
        department: student.department || "N/A",
        year: student.year || "N/A",
      }));

      setStudents(formattedStudents);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setAlert({ type: "error", message: "Failed to load students list" });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Fetch candidates list from API
  const fetchCandidates = async () => {
    try {
      setIsLoadingCandidates(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ec/candidates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch candidates");

      const data = await response.json();
      
      // Handle the specific response format with pending, approved, rejected arrays
      const allCandidates = [
        ...(data.pending || []).map((candidate: any) => ({ ...candidate, status: "Pending" })),
        ...(data.approved || []).map((candidate: any) => ({ ...candidate, status: "Approved" })),
        ...(data.rejected || []).map((candidate: any) => ({ ...candidate, status: "Rejected" })),
      ];
      
      // Transform API data to match the expected format
      const formattedCandidates = allCandidates.map((candidate: any, index: number) => ({
        id: index + 1,
        name: candidate.name || "Unknown",
        position: candidate.position || "N/A",
        status: candidate.status || "Pending",
        email: candidate.email || "N/A",
        department: candidate.department || "N/A",
        studentId: candidate.StudentId || "N/A",
        phone: candidate.phone || "N/A",
        statement: candidate.statement || "N/A",
        rejectionReason: candidate.rejectionReason || "",
        userId: candidate.userId,
        _id: candidate._id,
      }));

      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      setAlert({ type: "error", message: "Failed to load candidates list" });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsLoadingCandidates(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCandidates();
    fetchElections();
  }, []);

  // Fetch elections list from API
  const fetchElections = async () => {
    try {
      setIsLoadingElections(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/elections/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch elections");

      const data = await response.json();
      setElections(data);
    } catch (error) {
      console.error("Failed to fetch elections:", error);
      setAlert({ type: "error", message: "Failed to load elections list" });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsLoadingElections(false);
    }
  };

  // Create new election
  const handleCreateElection = async () => {
    if (!newElection.title || !newElection.description || !newElection.post || 
        !newElection.nominationStartDate || !newElection.nominationEndDate ||
        !newElection.campaignStartDate || !newElection.campaignEndDate ||
        !newElection.votingDate || !newElection.resultAnnouncementDate) {
      setAlert({ type: "error", message: "Please fill in all fields!" });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/elections/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newElection.title,
          description: newElection.description,
          post: newElection.post,
          type: newElection.type,
          nominationStartDate: new Date(newElection.nominationStartDate).toISOString(),
          nominationEndDate: new Date(newElection.nominationEndDate).toISOString(),
          campaignStartDate: new Date(newElection.campaignStartDate).toISOString(),
          campaignEndDate: new Date(newElection.campaignEndDate).toISOString(),
          votingDate: new Date(newElection.votingDate).toISOString(),
          resultAnnouncementDate: new Date(newElection.resultAnnouncementDate).toISOString(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create election");

      await fetchElections();
      setNewElection({
        title: "",
        description: "",
        post: "",
        type: "Student Council",
        nominationStartDate: "",
        nominationEndDate: "",
        campaignStartDate: "",
        campaignEndDate: "",
        votingDate: "",
        resultAnnouncementDate: "",
      });
      setShowCreateElectionForm(false);
      setAlert({ type: "success", message: "Election created successfully!" });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({ type: "error", message: error.message });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle election status
  const handleToggleElectionStatus = async (electionId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/elections/${electionId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update election status");

      await fetchElections();
      setAlert({
        type: "success",
        message: `Election ${!currentStatus ? "activated" : "deactivated"} successfully!`,
      });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({ type: "error", message: error.message });
      setTimeout(() => setAlert(null), 3000);
    }
  };
  const [activeTab, setActiveTab] = useState<string>("home");
  const [elections, setElections] = useState([]);
  const [isLoadingElections, setIsLoadingElections] = useState(true);
  const [showCreateElectionForm, setShowCreateElectionForm] = useState(false);
  const [newElection, setNewElection] = useState({
    title: "",
    description: "",
    post: "",
    type: "Student Council",
    nominationStartDate: "",
    nominationEndDate: "",
    campaignStartDate: "",
    campaignEndDate: "",
    votingDate: "",
    resultAnnouncementDate: "",
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [electionDates, setElectionDates] = useState({
    nominationStart: "2024-07-01",
    nominationEnd: "2024-07-15",
    campaignStart: "2024-07-16",
    campaignEnd: "2024-07-30",
    votingDate: "2024-08-01",
    resultDate: "2024-08-02",
  });

  const [candidates, setCandidates] = useState([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);

  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);

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
    username: "",
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
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const menuItems = [
    { id: "home", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    {
      id: "elections",
      label: "Election Management",
      icon: <Calendar className="h-5 w-5" />,
    },
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

  const handleCandidateApproval = async (
    id: number,
    status: "Approved" | "Rejected",
  ) => {
    try {
      // Find the candidate to get their _id
      const candidate = candidates.find(c => c.id === id);
      if (!candidate) return;

      if (status === "Rejected") {
        // Show rejection modal for reason
        setSelectedCandidateId(id);
        setShowRejectModal(true);
        return;
      }

      // Handle approval
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ec/candidate/${candidate._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: status.toLowerCase(),
        }),
      });

      if (!response.ok) throw new Error("Failed to update candidate status");

      // Refresh candidates list from API
      await fetchCandidates();
      
      setAlert({
        type: "success",
        message: `Candidate ${status.toLowerCase()} successfully!`,
      });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message || "Failed to update candidate status",
      });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  // Handle rejection with reason
  const handleRejectWithReason = async () => {
    if (!rejectionReason.trim()) {
      setAlert({ type: "error", message: "Please provide a rejection reason!" });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    try {
      const candidate = candidates.find(c => c.id === selectedCandidateId);
      if (!candidate) return;

      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ec/candidate/${candidate._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "rejected",
          reason: rejectionReason,
        }),
      });

      if (!response.ok) throw new Error("Failed to reject candidate");

      // Refresh candidates list from API
      await fetchCandidates();
      
      setAlert({
        type: "success",
        message: "Candidate rejected successfully!",
      });
      setTimeout(() => setAlert(null), 3000);

      // Reset modal state
      setShowRejectModal(false);
      setSelectedCandidateId(null);
      setRejectionReason("");
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message || "Failed to reject candidate",
      });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const generatePassword = (): string => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.username || !newStudent.department || !newStudent.year) {
      setAlert({ type: "error", message: "Please fill in all fields!" });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    setIsLoading(true);
    const password = generatePassword();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newStudent.name,
          username: newStudent.username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register student");
      }

      // Refresh students list from API
      await fetchStudents();

      // Reset form and show success
      setNewStudent({ name: "", username: "", department: "", year: "" });
      setShowAddStudentForm(false);
      setGeneratedPassword(password);
      setShowPasswordModal(true);
      setAlert({ type: "success", message: "Student registered successfully!" });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({ type: "error", message: error.message });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsLoading(false);
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
          <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">
            <UserCog className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
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
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EC Officer Dashboard
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                  title="Active Elections"
                  value={elections.filter((e: any) => e.active).length}
                  icon={<Calendar className="h-6 w-6 text-purple-600" />}
                  color="bg-purple-500"
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
                      {isLoadingCandidates ? (
                        <div className="flex items-center justify-center p-3">
                          <div className="text-sm text-muted-foreground">Loading candidates...</div>
                        </div>
                      ) : candidates.length === 0 ? (
                        <div className="flex items-center justify-center p-3">
                          <div className="text-sm text-muted-foreground">No candidates found</div>
                        </div>
                      ) : (
                        candidates.slice(0, 3).map((candidate) => (
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
                        ))
                      )}
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

          {/* Election Management */}
          {activeTab === "elections" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Election Management
              </h1>

              <div className="grid grid-cols-1 gap-6">
                {/* Create New Election */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Create New Election</CardTitle>
                      <Button
                        onClick={() => setShowCreateElectionForm(!showCreateElectionForm)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Election
                      </Button>
                    </div>
                  </CardHeader>
                  {showCreateElectionForm && (
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="election-title">Election Title</Label>
                          <Input
                            id="election-title"
                            value={newElection.title}
                            onChange={(e) =>
                              setNewElection({ ...newElection, title: e.target.value })
                            }
                            placeholder="Student Council Election 2024"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="election-description">Description</Label>
                          <Textarea
                            id="election-description"
                            value={newElection.description}
                            onChange={(e) =>
                              setNewElection({ ...newElection, description: e.target.value })
                            }
                            placeholder="Annual student council election description"
                          />
                        </div>
                        <div>
                          <Label htmlFor="election-post">Positions</Label>
                          <Input
                            id="election-post"
                            value={newElection.post}
                            onChange={(e) =>
                              setNewElection({ ...newElection, post: e.target.value })
                            }
                            placeholder="President, Vice President, Secretary"
                          />
                        </div>
                        <div>
                          <Label htmlFor="election-type">Election Type</Label>
                          <Input
                            id="election-type"
                            value={newElection.type}
                            onChange={(e) =>
                              setNewElection({ ...newElection, type: e.target.value })
                            }
                            placeholder="Student Council"
                          />
                        </div>
                        <div>
                          <Label htmlFor="nomination-start">Nomination Start</Label>
                          <Input
                            id="nomination-start"
                            type="datetime-local"
                            value={newElection.nominationStartDate}
                            onChange={(e) =>
                              setNewElection({ ...newElection, nominationStartDate: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="nomination-end">Nomination End</Label>
                          <Input
                            id="nomination-end"
                            type="datetime-local"
                            value={newElection.nominationEndDate}
                            onChange={(e) =>
                              setNewElection({ ...newElection, nominationEndDate: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="campaign-start">Campaign Start</Label>
                          <Input
                            id="campaign-start"
                            type="datetime-local"
                            value={newElection.campaignStartDate}
                            onChange={(e) =>
                              setNewElection({ ...newElection, campaignStartDate: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="campaign-end">Campaign End</Label>
                          <Input
                            id="campaign-end"
                            type="datetime-local"
                            value={newElection.campaignEndDate}
                            onChange={(e) =>
                              setNewElection({ ...newElection, campaignEndDate: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="voting-date">Voting Date</Label>
                          <Input
                            id="voting-date"
                            type="datetime-local"
                            value={newElection.votingDate}
                            onChange={(e) =>
                              setNewElection({ ...newElection, votingDate: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="result-date">Result Announcement</Label>
                          <Input
                            id="result-date"
                            type="datetime-local"
                            value={newElection.resultAnnouncementDate}
                            onChange={(e) =>
                              setNewElection({ ...newElection, resultAnnouncementDate: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-6">
                        <Button
                          onClick={handleCreateElection}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isLoading ? "Creating..." : "Create Election"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowCreateElectionForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Existing Elections */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Existing Elections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoadingElections ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="text-sm text-muted-foreground">Loading elections...</div>
                        </div>
                      ) : elections.length === 0 ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="text-sm text-muted-foreground">No elections found</div>
                        </div>
                      ) : (
                        elections.map((election: any) => (
                          <div
                            key={election._id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <h3 className="font-medium">{election.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {election.description}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Positions: {election.post}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    election.active
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
                                  }`}
                                >
                                  {election.active ? "Active" : "Inactive"}
                                </span>
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                  {election.type}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleElectionStatus(election._id, election.active)}
                                className={
                                  election.active
                                    ? "text-orange-500 hover:text-orange-600"
                                    : "text-green-500 hover:text-green-600"
                                }
                              >
                                {election.active ? "Deactivate" : "Activate"}
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
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
                    {isLoadingCandidates ? (
                      <div className="flex items-center justify-center p-4">
                        <div className="text-sm text-muted-foreground">Loading candidates...</div>
                      </div>
                    ) : candidates.length === 0 ? (
                      <div className="flex items-center justify-center p-4">
                        <div className="text-sm text-muted-foreground">No candidates found</div>
                      </div>
                    ) : (
                      candidates.map((candidate) => (
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
                              Student ID: {candidate.studentId} • Phone: {candidate.phone}
                            </p>
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                              {candidate.position}
                            </span>
                            {candidate.statement && (
                              <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
                                Statement: {candidate.statement}
                              </p>
                            )}
                            {candidate.status === "Rejected" && candidate.rejectionReason && (
                              <p className="text-xs text-red-600 mt-1">
                                Rejection Reason: {candidate.rejectionReason}
                              </p>
                            )}
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
                    ))
                    )}
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
                            placeholder="Username"
                            type="text"
                            value={newStudent.username}
                            onChange={(e) =>
                              setNewStudent({
                                ...newStudent,
                                username: e.target.value,
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
                              disabled={isLoading}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isLoading ? "Adding..." : "Add"}
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
                      {isLoadingStudents ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="text-sm text-muted-foreground">Loading students...</div>
                        </div>
                      ) : students.length === 0 ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="text-sm text-muted-foreground">No students found</div>
                        </div>
                      ) : (
                        students.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Username: {student.email}
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
                        ))
                      )}
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

      {/* Rejection Reason Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Candidate Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this candidate application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a detailed reason for rejection..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedCandidateId(null);
                  setRejectionReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectWithReason}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reject Candidate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Student Registration Successful</DialogTitle>
            <DialogDescription>
              The student has been successfully registered. Please share the following credentials with them:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="space-y-2">
                <div>
                  <Label className="text-sm font-medium text-green-800 dark:text-green-200">
                    Username
                  </Label>
                  <p className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border">
                    {newStudent.username}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-800 dark:text-green-200">
                    Generated Password
                  </Label>
                  <p className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border">
                    {generatedPassword}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
              ⚠️ Please save these credentials securely. The password will not be shown again.
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`Username: ${newStudent.username}\nPassword: ${generatedPassword}`);
                  setAlert({ type: "success", message: "Credentials copied to clipboard!" });
                  setTimeout(() => setAlert(null), 3000);
                }}
              >
                Copy Credentials
              </Button>
              <Button
                onClick={() => {
                  setShowPasswordModal(false);
                  setGeneratedPassword("");
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ECOfficerDashboard;
