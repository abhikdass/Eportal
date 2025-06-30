import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart3,
  Users,
  Vote,
  FileEdit,
  Info,
  LogOut,
  ChevronRight,
  Home,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import CandidateApplications from "./CandidateApplications";
import CandidateForm from "./CandidateForm";
import VotePortal from "./VotePortal";
import { useNavigate } from "react-router-dom";
interface UserDashboardProps {
  username?: string;
  onLogout?: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("userAuth");
    window.location.href = "/";
  },
}) => {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [username, setUsername] = useState<string>("Student");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  // Election data state
  const [activeElection, setActiveElection] = useState<any>(null);
  const [elections, setElections] = useState<any[]>([]);
  const [electionResults, setElectionResults] = useState<any>(null);
  const [liveStats, setLiveStats] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [voteStatus, setVoteStatus] = useState<any>(null);
  const [resultAnnouncement, setResultAnnouncement] = useState<boolean>(false);
  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingElections, setIsLoadingElections] = useState<boolean>(true);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
     const storedName = localStorage.getItem("name");
    if (storedName) setUsername(storedName);
  if (localStorage.getItem("token") === null) {
      navigate("/"); // Redirect to homepage
    }
    // Initial data load
    fetchElections();
    fetchMyApplications();
    fetchActiveElection();
  }, []);

  // Fetch all elections
  const fetchElections = async () => {
    try {
      setIsLoadingElections(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/elections/all`);
      
      if (response.ok) {
        const data = await response.json();
        setElections(data);
      }
    } catch (error) {
      console.error("Failed to fetch elections:", error);
    } finally {
      setIsLoadingElections(false);
    }
  };

  // Fetch active election
  const fetchActiveElection = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/elections/active`);
      
      if (response.ok) {
        const data = await response.json();
        setActiveElection(data);
        if (data) {
          fetchCandidatesForElection(data._id);
          fetchVoteStatus(data._id);
          fetchLiveStats(data._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch active election:", error);
    }
  };

  // Fetch candidates for an election
  const fetchCandidatesForElection = async (electionId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/candidates/${electionId}`);


      if (response.ok) {
        const data = await response.json();
        // console.log("Candidates API response:", data); // Debug log
        const candidatesData = data.candidates || data;
        const candidatesArray = Array.isArray(candidatesData) ? candidatesData : [];
        const approvedCandidates = candidatesArray.filter((candidate) => 
          !candidate.status || candidate.status === 'approved'
        );
        console.log("Processed candidates:", approvedCandidates); // Debug log
        setCandidates(approvedCandidates);
      } else {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`Failed to fetch candidates: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    }
  };

  // Fetch my candidate applications
  const fetchMyApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/my-applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMyApplications(data);
      }
    } catch (error) {
      console.error("Failed to fetch my applications:", error);
    }
  };

  // Check vote status for an election
  const fetchVoteStatus = async (electionId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/status/${electionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVoteStatus(data);
      }
    } catch (error) {
      console.error("Failed to fetch vote status:", error);
    }
  };

  // Fetch live statistics
  const fetchLiveStats = async (electionId: string) => {
    try {
      setIsLoadingStats(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/live-count/${electionId}`);
      
      if (response.ok) {
        const data = await response.json();
        setLiveStats(data);
        setResultAnnouncement(data.status);

      }
    } catch (error) {
      console.error("Failed to fetch live stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Fetch election results
  const fetchElectionResults = async (electionId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/results/${electionId}`);
      
      if (response.ok) {
        const data = await response.json();
        setElectionResults(data);
      } else if (response.status === 400) {
        const errorData = await response.json();
        setAlert({ 
          type: "error", 
          message: `Results will be available at ${new Date(errorData.availableAt).toLocaleString()}` 
        });
        setTimeout(() => setAlert(null), 5000);
      }
    } catch (error) {
      console.error("Failed to fetch election results:", error);
      setAlert({ type: "error", message: "Failed to load election results" });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  // Refresh data periodically for live updates
  useEffect(() => {
    if (!resultAnnouncement && activeElection && activeTab === "stats") {
    console.log("Lives Updates:", resultAnnouncement);
      const interval = setInterval(() => {
        fetchLiveStats(activeElection._id);
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [activeElection, activeTab, resultAnnouncement]);

  // Refresh data when tab changes
  useEffect(() => {
    if (activeTab === "home") {
      fetchActiveElection();
      fetchMyApplications();
    } else if (activeTab === "participants" && activeElection) {
      fetchCandidatesForElection(activeElection._id);
    } else if (activeTab === "stats" && activeElection) {
      fetchLiveStats(activeElection._id);
      fetchElectionResults(activeElection._id);
    }
  }, [activeTab]);

  const menuItems = [
    { id: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
    {
      id: "candidate",
      label: "Apply Candidate Form",
      icon: <FileEdit className="h-5 w-5" />,
    },
    {
      id: "MyApplications",
      label: "My Applications",
      icon: <User className="h-5 w-5" />,
    },
    { id: "vote", label: "Vote Portal", icon: <Vote className="h-5 w-5" /> },
    {
      id: "participants",
      label: "Participants",
      icon: <Users className="h-5 w-5" />,
    },
    { id: "stats", label: "Stats", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "about", label: "About", icon: <Info className="h-5 w-5" /> },
  ];

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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-full bg-primary/10">
            <Vote className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold">Election Portal</h1>
        </div>

        <div className="flex-1">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${activeTab === item.id ? "bg-primary/10 text-primary" : ""}`}
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
          
          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">QUICK ACTIONS</p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => {
                fetchElections();
                fetchActiveElection();
                fetchMyApplications();
                setAlert({ type: "success", message: "Data refreshed!" });
                setTimeout(() => setAlert(null), 2000);
              }}
              disabled={isLoading}
            >
              <Clock className="mr-2 h-3 w-3" />
              {isLoading ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
              />
              <AvatarFallback>
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
          className="max-w-6xl mx-auto"
        >
          {/* Home Tab */}
          {activeTab === "home" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6">Welcome, {username}!</h1>
              
              {alert && (
                <Alert className={`mb-6 ${alert.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                        <Vote className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Active Election</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activeElection ? activeElection.title : "No active election"}
                        </p>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={() => setActiveTab("vote")}
                      disabled={!activeElection}
                    >
                      {voteStatus?.hasVoted ? "View Vote" : "Cast Your Vote"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                        <FileEdit className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">My Applications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {myApplications.length} application(s)
                        </p>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => setActiveTab("candidate")}
                    >
                      {myApplications.length > 0 ? "View Applications" : "Apply Now"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                        <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Live Statistics</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {liveStats ? `${liveStats.totalVotes} votes cast` : "No data available"}
                        </p>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => setActiveTab("stats")}
                    >
                      View Stats
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* My Applications Status */}
              {myApplications.length > 0 && (
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">My Candidate Applications</h2>
                    <div className="space-y-4">
                      {myApplications.map((application: any) => (
                        <div
                          key={application._id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div>
                            <h3 className="font-medium">{application.position}</h3>
                            <p className="text-sm text-muted-foreground">
                              {application.electionId?.title || "Election"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Applied: {new Date(application.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${
                              application.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                : application.status === "rejected"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                  : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
                            }`}
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="mt-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Election Timeline</h2>
                  {activeElection ? (
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                      {[
                        {
                          date: new Date(activeElection.nominationStartDate).toLocaleString(),
                          title: "Nominations Open",
                          status: new Date() > new Date(activeElection.nominationStartDate) ? "completed" : "upcoming",
                        },
                        {
                          date: new Date(activeElection.nominationEndDate).toLocaleString(),
                          title: "Nominations Close",
                          status: new Date() > new Date(activeElection.nominationEndDate) ? "completed" : 
                                 new Date() > new Date(activeElection.nominationStartDate) ? "current" : "upcoming",
                        },
                        {
                          date: new Date(activeElection.campaignStartDate).toLocaleString(),
                          title: "Campaigning Begins",
                          status: new Date() > new Date(activeElection.campaignStartDate) ? "completed" : 
                                 new Date() > new Date(activeElection.nominationEndDate) ? "current" : "upcoming",
                        },
                        {
                          date: new Date(activeElection.campaignEndDate).toLocaleString(),
                          title: "Campaigning Ends",
                          status: new Date() > new Date(activeElection.campaignEndDate) ? "completed" : 
                                 new Date() > new Date(activeElection.campaignStartDate) ? "current" : "upcoming",
                        },
                        {
                          date: new Date(activeElection.votingDate).toLocaleString(),
                          title: "Voting Day",
                          status: new Date() > new Date(activeElection.votingDate) ? "completed" : 
                                 new Date().toDateString() === new Date(activeElection.votingDate).toDateString() ? "current" : "upcoming",
                        },
                        {
                          date: new Date(activeElection.resultAnnouncementDate).toLocaleString(),
                          title: "Results Announcement",
                          status: new Date() > new Date(activeElection.resultAnnouncementDate) ? "completed" : 
                                 new Date() > new Date(activeElection.votingDate) ? "current" : "upcoming",
                        },
                      ].map((event, index) => (
                        <div key={index} className="ml-10 mb-6 relative">
                          <div
                            className={`absolute -left-10 mt-1.5 rounded-full h-4 w-4 flex items-center justify-center
                            ${
                              event.status === "completed"
                                ? "bg-green-500"
                                : event.status === "current"
                                  ? "bg-blue-500 animate-pulse"
                                  : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          ></div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {event.date}
                          </p>
                          <h3
                            className={`font-medium ${event.status === "current" ? "text-blue-600 dark:text-blue-400" : ""}`}
                          >
                            {event.title}
                          </h3>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No active election timeline available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Candidate Form Tab */}
          {activeTab === "candidate" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6">Apply as a Candidate</h1>
              <CandidateForm />
            </motion.div>
          )}
          
          {/* My Applications Tab */}
          {activeTab === "MyApplications" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6">My Applications</h1>
              <CandidateApplications />
            </motion.div>
          )}

          {/* About Tab */}

          {/* Vote Portal Tab */}
          {activeTab === "vote" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6">Vote Portal</h1>
              <VotePortal />
            </motion.div>
          )}

          {/* Participants Tab */}
          {activeTab === "participants" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6">Election Participants</h1>
              <Card>
                <CardContent className="p-6">
                  {isLoadingElections ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading candidates...</p>
                    </div>
                  ) : candidates.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No candidates available</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {candidates.map((candidate: any) => (
                        <div
                          key={candidate._id}
                          className="flex flex-col items-center gap-4 p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Avatar className="h-16 w-16">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                            />
                            <AvatarFallback>
                              {candidate.name?.charAt(0) || "C"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-center">
                            <h3 className="font-medium text-lg">{candidate.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              {candidate.position}
                            </p>
                            <p className="text-xs text-gray-400 mb-2">
                              {candidate.StudentId}
                            </p>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                candidate.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : candidate.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {candidate.status?.charAt(0).toUpperCase() + candidate.status?.slice(1)}
                            </span>
                          </div>
                          {candidate.statement && (
                            <div className="w-full">
                              <p className="text-sm text-gray-600 dark:text-gray-300 text-center italic">
                                "{candidate.statement}"
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Election Statistics</h1>
                {activeElection && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLiveStats(activeElection._id)}
                      disabled={isLoadingStats}
                    >
                      {isLoadingStats ? "Refreshing..." : "Refresh"}
                    </Button>
                  </div>
                )}
              </div>

              {!activeElection ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No active election available</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Live Vote Count */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Live Vote Count
                      </h2>
                      {isLoadingStats ? (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">Loading statistics...</p>
                        </div>
                      ) : liveStats ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="font-medium">Election</span>
                            <span className="text-sm">{liveStats.electionTitle}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <span className="font-medium">Total Votes</span>
                            <span className="text-lg font-bold">{liveStats.totalVotes}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <span className="font-medium">Voter Turnout</span>
                            <span className="text-lg font-bold">{liveStats.votePercentage?.toFixed(1)}%</span>
                          </div>
                          
                          {liveStats.candidates && liveStats.candidates.length > 0 && (
                            <div className="space-y-3">
                              <h3 className="font-medium">Candidate Vote Count</h3>
                              {liveStats.candidates.map((candidate: any) => (
                                <div key={candidate.candidateId} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>{candidate.candidateName}</span>
                                    <span>{candidate.voteCount} votes</span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full transition-all duration-300"
                                      style={{ 
                                        width: `${liveStats.totalVotes > 0 ? (candidate.voteCount / liveStats.totalVotes) * 100 : 0}%` 
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">No statistics available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Election Results */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Election Results
                      </h2>
                       {electionResults ? (
                        <div className="space-y-4">
                          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                          {resultAnnouncement ? (
                            <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-2">
                              🏆 Winners
                            </h3>
                          ) : (
                              <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                                🏆 Leading in votes
                              </h3>
                          )}
                            {electionResults.winners?.map((winner: any, index: number) => (
                              <div key={winner.candidateId} className="mb-2">
                                <p className="font-medium">{winner.candidateName}</p>
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                  {winner.voteCount} votes ({winner.percentage}%)
                                </p>
                              </div>
                            ))}
                            {electionResults.isTie && (
                              <p className="text-sm text-amber-600 dark:text-amber-400 italic">
                                * This election resulted in a tie
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="font-medium">Final Results</h3>
                            {electionResults.candidates?.map((candidate: any) => (
                              <div key={candidate.candidateId} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="flex items-center gap-2">
                                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                      #{candidate.rank}
                                    </span>
                                    {candidate.candidateName}
                                  </span>
                                  <span>{candidate.voteCount} votes ({candidate.percentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      candidate.rank === 1 ? "bg-yellow-500" : "bg-gray-400"
                                    }`}
                                    style={{ width: `${candidate.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Results announced: {new Date(electionResults.resultGeneratedAt).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">
                            Results will be available after the announcement date
                          </p>
                          {activeElection && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Expected: {new Date(activeElection.resultAnnouncementDate).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Voting Statistics */}
                  <Card className="lg:col-span-2">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Voting Overview</h2>
                      {liveStats ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {liveStats.totalEligibleVoters || "N/A"}
                            </div>
                            <div className="text-sm text-muted-foreground">Eligible Voters</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {liveStats.totalVotes}
                            </div>
                            <div className="text-sm text-muted-foreground">Votes Cast</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {liveStats.votePercentage?.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Turnout Rate</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No voting data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          )}

          {/* About Tab */}
                {/* About Tab */}
          {activeTab === "about" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6">
                About the Election Portal
              </h1>
              <Card>
                <CardContent className="p-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="mb-4">
                      The Election Portal is a comprehensive platform designed
                      to facilitate transparent and efficient elections within
                      our institution. This system allows users to:
                    </p>
                  </div>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                      <li>Apply as candidates for various positions</li>
                      <li>Cast votes securely and anonymously</li>
                      <li>View election participants and their profiles</li>
                      <li>Access real-time statistics and results</li>
                    </ul>

                    <h2 className="text-xl font-bold mt-6 mb-3">
                      Election Rules
                    </h2>
                    <ol className="list-decimal pl-6 mb-4 space-y-2">
                      <li>All registered users are eligible to vote</li>
                      <li>Each user can vote only once</li>
                      <li>
                        Candidate applications must be submitted before the
                        deadline
                      </li>
                      <li>
                        Campaigning must follow the institutional guidelines
                      </li>
                      <li>
                        Results will be announced after verification by the
                        Election Commission
                      </li>
                    </ol>

                    <h2 className="text-xl font-bold mt-6 mb-3">
                      Developement Team Information
                    </h2>
                    <p className="mb-4">
                     In Order to build this well structured and innovative project, our contributors are:
                    </p>
                    {/* Frontend Engineers */}
<div className="mb-6">
  <h3 className="text-lg font-semibold text-indigo-700 mb-2">Frontend Engineers</h3>
  <ul className="space-y-2 text-sm text-gray-700">
    <li>
      <strong>Anwesha Kundu</strong> – 📞 (+91) 9735949513 – ✉ anweshakundu17@gmail.com
    </li>
    <li>
      <strong>Subhrajyoti Das</strong> – 📞 (+91) 7001636546 – ✉ subhrajyoti772@gmail.com
    </li>
    
     <li>
      <strong>Pallab Sarkar</strong> – 📞 (+91) 9339038243 – ✉ sarkarpallab975@gmail.com
    </li>
  </ul>
</div>

{/* Backend Engineers */}
<div className="mb-6">
  <h3 className="text-lg font-semibold text-indigo-700 mb-2">Backend Engineers</h3>
  <ul className="space-y-2 text-sm text-gray-700">
    <li>
      <strong>Abhik Das</strong> – 📞 (+91) 9093244673 – ✉ Dasabhik35@gmail.com
    </li>
   
    
  </ul>
</div>
 
{/* Documentation & Support */}
<div className="mb-6">
  <h3 className="text-lg font-semibold text-indigo-700 mb-2">Documentation and Support Engineers</h3>
  <ul className="space-y-2 text-sm text-gray-700">
     <li>
      <strong>Shayan Kundu</strong> – 📞 (+91) 8250197453 – ✉ shayankundu6@gmail.com
    </li>
    <li>
      <strong>Shreyashi Sen</strong> – 📞 (+91) 7477805622
 – ✉ shreyashisen28@gmail.com
    </li>
     <li>
      <strong>Priya Das</strong> – 📞 (+91) 9883247832 – ✉ pdas46059@gmail.com
    </li>
    <li>
      <strong>Shailaraj Paul Chowdhury</strong> – 📞 (+91) 9475912759 – ✉ shailaraj2000@gmail.com
       </li>
       <li>
      <strong>Debajyoti Debnath</strong> – 📞 (+91) 8967285665 – ✉ debajyoti2250@gmail.com
    </li>
  </ul>

                    <h2 className="text-xl font-bold mt-6 mb-3">
                      Contact Information
                    </h2>
                    <p className="mb-4">
                      For any queries or assistance regarding the election
                      process, please contact:
                    </p>
                    <p className="mb-1">
                      <strong>Election Commission Office</strong>
                    </p>
                    <p className="mb-1">Email: ec-office@example.edu</p>
                    <p className="mb-4">Phone: (123) 456-7890</p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-6">
                      <h3 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-300">
                        Important Notice
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300">
                        The election schedule may be subject to change. Please
                        check the portal regularly for updates.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
