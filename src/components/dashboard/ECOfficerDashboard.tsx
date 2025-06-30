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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/"); // Redirect to homepage
    }
    const storedName = localStorage.getItem("name");
    if (storedName) setUsername(storedName);
  }, []);

   const fetchElectionResults = async (electionId: string) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/declare-results/${electionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Election results data:", data); // Debug log
          setElectionResults(data); // Store the full response data
          
        } else if (response.status === 400) {
          const errorData = await response.json();
          setAlert({ 
            type: "error", 
            message: `Results will be available at ${new Date(errorData.availableAt).toLocaleString()}` 
          });
          setTimeout(() => setAlert(null), 5000);
        } else {
          const errorData = await response.json();
          setAlert({ 
            type: "error", 
            message: errorData.message || "Failed to fetch election results" 
          });
          setTimeout(() => setAlert(null), 3000);
        }
      } catch (error) {
        console.error("Failed to fetch election results:", error);
        setAlert({ type: "error", message: "Failed to load election results" });
        setTimeout(() => setAlert(null), 3000);
      }
    };
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
        _id: student._id,
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
      if (!response.ok) throw new Error(data.error || "Failed to create election");

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

  const handleDeleteElection = async (electionId: string) => {
    try {
      // Confirm deletion
      const confirmDelete = window.confirm("Are you sure you want to delete this election? This action cannot be undone.");
      if (!confirmDelete) return;

      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ec/election/${electionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete election");
      }

      // Refresh elections list after successful deletion
      await fetchElections();
      setAlert({
        type: "success",
        message: "Election deleted successfully!",
      });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error("Failed to delete election:", error);
      setAlert({ 
        type: "error", 
        message: error.message || "Failed to delete election" 
      });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  // Fetch candidates for a specific election
  const fetchElectionCandidates = async (electionId: string) => {
    try {
      setIsLoadingElectionCandidates(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ec/candidate/${electionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch election candidates");

      const data = await response.json();
      setElectionCandidates(data);
    } catch (error) {
      console.error("Failed to fetch election candidates:", error);
      setAlert({ type: "error", message: "Failed to load election candidates" });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsLoadingElectionCandidates(false);
    }
  };

  // Open election details modal
  const openElectionDetails = (election: any) => {
    setSelectedElection(election);
    fetchElectionCandidates(election._id);
    setShowElectionDetailsModal(true);
  };

  const [activeTab, setActiveTab] = useState<string>("home");
  const [elections, setElections] = useState([]);
  const [isLoadingElections, setIsLoadingElections] = useState(true);
  const [showCreateElectionForm, setShowCreateElectionForm] = useState(false);
  // Add new state for election details and candidates
  const [electionResults, setElectionResults] = useState<any>(null);
  
  const [showElectionDetailsModal, setShowElectionDetailsModal] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [electionCandidates, setElectionCandidates] = useState([]);
  const [isLoadingElectionCandidates, setIsLoadingElectionCandidates] = useState(false);
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

  const [newStudent, setNewStudent] = useState({
    "_id": "",
    name: "",
    username: "",
    department: "",
    year: "",
  });
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
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
          department: newStudent.department,
          year: newStudent.year,
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
      setNewStudent({_id:"", name: "", username: "", department: "", year: "" });
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

 
const handleRemoveStudent = async (id: number) => {
  try {
    const student = students.find((s) => s.id === id);
    console.log("Removing student:", student);
    if (!student || !student._id) return;

    const token = localStorage.getItem("token");
    // Use student._id for API call
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ec/students/${student._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to remove student");
    }

    await fetchStudents();
    setAlert({ type: "success", message: data.message || "Student removed successfully!" });
    setTimeout(() => setAlert(null), 3000);
  } catch (error: any) {
    setAlert({ type: "error", message: error.message || "Failed to remove student" });
    setTimeout(() => setAlert(null), 3000);
  }
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
                          ).toLocaleString()}{" "}
                          -{" "}
                          {new Date(
                            electionDates.nominationEnd,
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <span className="font-medium">Campaign Period</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            electionDates.campaignStart,
                          ).toLocaleString()}{" "}
                          -{" "}
                          {new Date(
                            electionDates.campaignEnd,
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="font-medium">Voting Day</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            electionDates.votingDate,
                          ).toLocaleString()}
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
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Election Management
      </h1>
      <Button
        onClick={() => setShowCreateElectionForm(!showCreateElectionForm)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Election
      </Button>
    </div>

    {/* Create Election Form */}
    {showCreateElectionForm && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Create New Election</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Election Title</Label>
                <Input
                  id="title"
                  value={newElection.title}
                  onChange={(e) =>
                    setNewElection({ ...newElection, title: e.target.value })
                  }
                  placeholder="Student Council Election 2024"
                />
              </div>
              <div>
                <Label htmlFor="type">Election Type</Label>
                <Select
                  value={newElection.type}
                  onValueChange={(value) =>
                    setNewElection({ ...newElection, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select election type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student Council">Student Council</SelectItem>
                    <SelectItem value="Class Representative">Class Representative</SelectItem>
                    <SelectItem value="Department Representative">Department Representative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newElection.description}
                  onChange={(e) =>
                    setNewElection({ ...newElection, description: e.target.value })
                  }
                  placeholder="Annual student council election for academic year 2024-25"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="post">Positions/Posts</Label>
                <Select
                  value={newElection.post}
                  onValueChange={(value) =>
                    setNewElection({ ...newElection, post: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select election post" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="President">President</SelectItem>
                    <SelectItem value="Vice President">Vice President</SelectItem>
                    <SelectItem value="Secretary">Secretary</SelectItem>
                    <SelectItem value="Treasurer">Treasurer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nominationStart">Nomination Start Date</Label>
                <Input
                  id="nominationStart"
                  type="datetime-local"
                  value={newElection.nominationStartDate}
                  onChange={(e) =>
                    setNewElection({ ...newElection, nominationStartDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="nominationEnd">Nomination End Date</Label>
                <Input
                  id="nominationEnd"
                  type="datetime-local"
                  value={newElection.nominationEndDate}
                  onChange={(e) =>
                    setNewElection({ ...newElection, nominationEndDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="campaignStart">Campaign Start Date</Label>
                <Input
                  id="campaignStart"
                  type="datetime-local"
                  value={newElection.campaignStartDate}
                  onChange={(e) =>
                    setNewElection({ ...newElection, campaignStartDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="campaignEnd">Campaign End Date</Label>
                <Input
                  id="campaignEnd"
                  type="datetime-local"
                  value={newElection.campaignEndDate}
                  onChange={(e) =>
                    setNewElection({ ...newElection, campaignEndDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="votingDate">Voting Date</Label>
                <Input
                  id="votingDate"
                  type="datetime-local"
                  value={newElection.votingDate}
                  onChange={(e) =>
                    setNewElection({ ...newElection, votingDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="resultDate">Result Announcement Date</Label>
                <Input
                  id="resultDate"
                  type="datetime-local"
                  value={newElection.resultAnnouncementDate}
                  onChange={(e) =>
                    setNewElection({ ...newElection, resultAnnouncementDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
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
        </Card>
      </motion.div>
    )}

    {/* Elections List */}
    <Card>
      <CardHeader>
        <CardTitle>All Elections</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingElections ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading elections...</p>
          </div>
        ) : elections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No elections found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {elections.map((election) => (
              <motion.div
                key={election._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{election.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {election.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {election.type}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {election.post}
                    </span>
                    <span>
                      Voting: {new Date(election.votingDate).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      election.active
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
                    }`}
                  >
                    {election.active ? "Active" : "Inactive"}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openElectionDetails(election)}
                    className="text-blue-600 hover:text-blue-700 border-blue-200 mr-2"
                  >
                    Open
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleElectionStatus(election._id, election.active)}
                    className={
                      election.active
                        ? "text-red-600 hover:text-red-700 border-red-200"
                        : "text-green-600 hover:text-green-700 border-green-200"
                    }
                  >
                    {election.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteElection(election._id)}
                    className="text-red-600 hover:text-red-700 border-red-200"
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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

              <div className="grid grid-cols-1 gap-6">
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
                              <SelectItem value="1">1st Year</SelectItem>
                              <SelectItem value="2">2nd Year</SelectItem>
                              <SelectItem value="3">3rd Year</SelectItem>
                              <SelectItem value="4">4th Year</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={newStudent.department}
                            onValueChange={(value) =>
                              setNewStudent({ ...newStudent, department: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BCA">Computer Applications</SelectItem>
                              <SelectItem value="CSE">Computer Science</SelectItem>
                              <SelectItem value="ECE">Electronics</SelectItem>
                              <SelectItem value="ME">Mechanical</SelectItem>
                              <SelectItem value="CE">Civil Engineering</SelectItem>
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
                  navigator.clipboard.writeText(`Password: ${generatedPassword}`);
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

      {/* Rejection Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Candidate Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Reason for Rejection</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a detailed reason for rejecting this candidate application..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setSelectedCandidateId(null);
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

      {/* Election Details Modal */}
      <Dialog open={showElectionDetailsModal} onOpenChange={setShowElectionDetailsModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Election Details</DialogTitle>
          </DialogHeader>
          {selectedElection && (
            <div className="space-y-6">
              {/* Election Information */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{selectedElection.title}</h3>
                <p className="text-muted-foreground mb-4">{selectedElection.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">Position</h4>
                    <p>{selectedElection.post}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">Type</h4>
                    <p>{selectedElection.type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">Status</h4>
                    <p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedElection.active 
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {selectedElection.active ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Election Timeline */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Election Timeline</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="font-medium">Nomination Period</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(selectedElection.nominationStartDate).toLocaleString()} - {" "}
                      {new Date(selectedElection.nominationEndDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="font-medium">Campaign Period</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(selectedElection.campaignStartDate).toLocaleString()} - {" "}
                      {new Date(selectedElection.campaignEndDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <span className="font-medium">Voting Date</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(selectedElection.votingDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="font-medium">Results Announcement</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(selectedElection.resultAnnouncementDate).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Candidates Section */}
            </div>
          )}
          
          {/* Election Results Display */}
          {electionResults && (
            <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-900/20">
              <AlertDescription className="text-green-700 dark:text-green-300">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Election Results</h3>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    {electionResults.message && (
                      <p className="mb-3 font-medium text-green-600 dark:text-green-400">
                        {electionResults.message}
                      </p>
                    )}
                    
                    {electionResults.winners && electionResults.winners.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {electionResults.isTie ? "Tied Winners:" : "Winner:"}
                        </h4>
                        {electionResults.winners.map((winner: any, index: number) => (
                          <div key={index} className="bg-green-100 dark:bg-green-800 p-3 rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-lg">{winner.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Student ID: {winner.studentId}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Email: {winner.email}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                  {winner.voteCount}
                                </p>
                                <p className="text-xs text-gray-500">votes</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {electionResults.declaredAt && (
                          <p className="text-xs text-gray-500 mt-3">
                            Results declared on: {new Date(electionResults.declaredAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Fallback: Show raw JSON if structure is unexpected */}
                    {(!electionResults.winners || electionResults.winners.length === 0) && (
                      <div className="max-h-60 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(electionResults, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          
          {/* Dialog Footer */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="flex gap-2">
              {selectedElection && !electionResults && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchElectionResults(selectedElection._id)}
                >
                  View Results
                </Button>
              )}
            </div>
            <Button onClick={() => setShowElectionDetailsModal(false)}>
              Close
            </Button>
          </div>
          
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ECOfficerDashboard;
