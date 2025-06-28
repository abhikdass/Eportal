import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Users,
  Vote,
  FileEdit,
  Info,
  LogOut,
  ChevronRight,
  Home,
} from "lucide-react";
import CandidateForm from "./CandidateForm";
import VotePortal from "./VotePortal";

interface UserDashboardProps {
  username?: string;
  onLogout?: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  username = "John Doe",
  onLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem("userAuth");
    // Navigate to home
    window.location.href = "/";
  },
}) => {
  const [activeTab, setActiveTab] = useState<string>("home");

  const menuItems = [
    { id: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
    {
      id: "candidate",
      label: "Apply Candidate Form",
      icon: <FileEdit className="h-5 w-5" />,
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
                          Student Council 2025
                        </p>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={() => setActiveTab("vote")}
                    >
                      Cast Your Vote
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
                        <h3 className="font-medium">Candidate Application</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Apply before June 30
                        </p>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => setActiveTab("candidate")}
                    >
                      Apply Now
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
                        <h3 className="font-medium">Election Statistics</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          View current results
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

              <Card className="mt-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Election Timeline</h2>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                    {[
                      {
                        date: "June 15",
                        title: "Nominations Open",
                        status: "completed",
                      },
                      {
                        date: "June 30",
                        title: "Nominations Close",
                        status: "current",
                      },
                      {
                        date: "July 5",
                        title: "Campaigning Begins",
                        status: "upcoming",
                      },
                      {
                        date: "July 15",
                        title: "Voting Day",
                        status: "upcoming",
                      },
                      {
                        date: "July 16",
                        title: "Results Announcement",
                        status: "upcoming",
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=candidate${i}`}
                          />
                          <AvatarFallback>C{i}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">Candidate {i}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {
                              [
                                "President",
                                "Vice President",
                                "Secretary",
                                "Treasurer",
                                "Member",
                                "Member",
                              ][i - 1]
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6">Election Statistics</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Results</h2>
                    <div className="space-y-4">
                      {[
                        {
                          position: "President",
                          candidates: [
                            { name: "Candidate 1", votes: 145 },
                            { name: "Candidate 2", votes: 120 },
                          ],
                        },
                        {
                          position: "Vice President",
                          candidates: [
                            { name: "Candidate 3", votes: 130 },
                            { name: "Candidate 4", votes: 110 },
                          ],
                        },
                        {
                          position: "Secretary",
                          candidates: [
                            { name: "Candidate 5", votes: 150 },
                            { name: "Candidate 6", votes: 90 },
                          ],
                        },
                      ].map((position, idx) => (
                        <div key={idx} className="border-b pb-4 last:border-0">
                          <h3 className="font-medium mb-2">
                            {position.position}
                          </h3>
                          <div className="space-y-2">
                            {position.candidates.map((candidate, i) => {
                              const totalVotes = position.candidates.reduce(
                                (sum, c) => sum + c.votes,
                                0,
                              );
                              const percentage = Math.round(
                                (candidate.votes / totalVotes) * 100,
                              );

                              return (
                                <div key={i} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>{candidate.name}</span>
                                    <span>
                                      {candidate.votes} votes ({percentage}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                      Voting Statistics
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">
                            Total Eligible Voters
                          </span>
                          <span>1000</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Total Votes Cast</span>
                          <span>745</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Voter Turnout</span>
                          <span>74.5%</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">
                          Voter Turnout by Department
                        </h3>
                        <div className="space-y-2">
                          {[
                            { dept: "Computer Science", turnout: 85 },
                            { dept: "Electrical Engineering", turnout: 72 },
                            { dept: "Mechanical Engineering", turnout: 68 },
                            { dept: "Civil Engineering", turnout: 70 },
                            { dept: "Business Administration", turnout: 78 },
                          ].map((dept, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{dept.dept}</span>
                                <span>{dept.turnout}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${dept.turnout}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

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
