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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import {
  Shield,
  Database,
  MemoryStick,
  Users,
  UserPlus,
  UserMinus,
  LogOut,
  Home,
  Settings,
  BarChart3,
  Activity,
  Server,
  HardDrive,
  Cpu,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

interface AdminDashboardProps {
  username?: string;
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  // username = "Admin User",
  
  onLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem("token");
    // Navigate to home
    window.location.href = "/";
  },
}) => {
    const [userName, setUserName] = useState<string>("Admin");
  const [role, setRole] = useState<string>("admin");
  const [databaseStats, setDatabaseStats] = useState({
  students: 0,
  teachers: 0,
  totalUsers: 0,
  activeElections: 0,
  totalVotes: 0,
});

const [systemStats, setSystemStats] = useState({
  cpuUsage: 0,
  diskUsage: 68,
  networkActivity: 42,
  uptime: "0 days, 0 hours",
});

const [memoryStats, setMemoryStats] = useState({
  total: "0 MB",
  used: "0 MB",
  free: "0 MB",
  usage: 0,
});


  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    if (storedName) setUserName(storedName);
    if (storedRole) setRole(storedRole);
  }, []);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [ecOfficers, setEcOfficers] = useState([
    { id: 1, name: "John Smith", email: "john@example.com", status: "Active" },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@example.com",
      status: "Inactive",
    },
  ]);
  const [newOfficer, setNewOfficer] = useState({ name: "", username: "" });
  const [showAddForm, setShowAddForm] = useState(false);
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
      id: "memory",
      label: "Memory Stats",
      icon: <MemoryStick className="h-5 w-5" />,
    },
    {
      id: "database",
      label: "Database Stats",
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: "officers",
      label: "EC Officers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch stats");

      const data = await res.json();

      // Update all state with real data
      setDatabaseStats({
        students: data.students || 0,
        teachers: data.teachers || 0,
        totalUsers: data.users || 0,
        activeElections: data.activeElections || 0,
        totalVotes: data.totalVotes || 0,
      });

      setSystemStats({
        cpuUsage: parseFloat(data.cpu.user.replace(" ms", "")) / 1000 || 0,
        diskUsage: 68, // optional if not coming from API
        networkActivity: 42, // optional if not coming from API
        uptime: `${Math.floor(data.uptime / 24)} days, ${Math.floor(data.uptime % 24)} hours`,
      });

      setMemoryStats({
        total: "N/A",
        used: data.memory.heapUsed,
        free: "N/A",
        usage:
          (parseFloat(data.memory.heapUsed) / parseFloat(data.memory.heapTotal)) * 100 || 0,
      });

      setEcOfficers(
        data.ecOfficerDocs.map((officer: any, idx: number) => ({
          id: idx + 1,
          name: officer.name,
          email: officer.username,
          status: "Active",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    }
  };

  fetchStats();
}, []);


  const generatePassword = (): string => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleAddOfficer = async () => {
    if (!newOfficer.name || !newOfficer.username) {
      setAlert({ type: "error", message: "Please fill in all fields!" });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    setIsLoading(true);
    const password = generatePassword();
    console.log("Generated password:", password);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register/ec`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newOfficer.name,
          username: newOfficer.username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register EC Officer");
      }

      // Add to local state
      const newId = Math.max(...ecOfficers.map((o) => o.id), 0) + 1;
      setEcOfficers([
        ...ecOfficers,
        {
          id: newId,
          name: newOfficer.name,
          email: newOfficer.username,
          status: "Active",
        },
      ]);

      // Reset form and show success
      setNewOfficer({ name: "", username: "" });
      setShowAddForm(false);
      setGeneratedPassword(password);
      setShowPasswordModal(true);
      setAlert({ type: "success", message: "EC Officer registered successfully!" });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({ type: "error", message: error.message });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveOfficer = (id: number) => {
    setEcOfficers(ecOfficers.filter((officer) => officer.id !== id));
    setAlert({ type: "success", message: "EC Officer removed successfully!" });
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
    percentage,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    percentage?: number;
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
              {percentage !== undefined && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {percentage}% used
                  </p>
                </div>
              )}
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
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 shadow-xl border-r border-white/20 p-4 flex flex-col"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
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
                    ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
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
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{userName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Administrator
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
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Users"
                  value={databaseStats.totalUsers}
                  icon={<Users className="h-6 w-6 text-blue-600" />}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Active Elections"
                  value={databaseStats.activeElections}
                  icon={<Activity className="h-6 w-6 text-green-600" />}
                  color="bg-green-500"
                />
                <StatCard
                  title="Total Votes"
                  value={databaseStats.totalVotes}
                  icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
                  color="bg-purple-500"
                />
                <StatCard
                  title="System Uptime"
                  value={systemStats.uptime}
                  icon={<Server className="h-6 w-6 text-orange-600" />}
                  color="bg-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      System Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">CPU Usage</span>
                          <span className="text-sm text-muted-foreground">
                            {systemStats.cpuUsage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${systemStats.cpuUsage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">
                            Disk Usage
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {systemStats.diskUsage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${systemStats.diskUsage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">
                            Network Activity
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {systemStats.networkActivity}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${systemStats.networkActivity}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Database Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="font-medium">Students</span>
                        <span className="text-xl font-bold text-blue-600">
                          {databaseStats.students}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="font-medium">Teachers</span>
                        <span className="text-xl font-bold text-green-600">
                          {databaseStats.teachers}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <span className="font-medium">Total Votes Cast</span>
                        <span className="text-xl font-bold text-purple-600">
                          {databaseStats.totalVotes}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Memory Stats */}
          {activeTab === "memory" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Memory Statistics
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Memory"
                  value={memoryStats.total}
                  icon={<MemoryStick className="h-6 w-6 text-blue-600" />}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Used Memory"
                  value={memoryStats.used}
                  icon={<HardDrive className="h-6 w-6 text-red-600" />}
                  color="bg-red-500"
                  percentage={memoryStats.usage}
                />
                <StatCard
                  title="Free Memory"
                  value={memoryStats.free}
                  icon={<Server className="h-6 w-6 text-green-600" />}
                  color="bg-green-500"
                />
                <StatCard
                  title="Memory Usage"
                  value={`${memoryStats.usage}%`}
                  icon={<Cpu className="h-6 w-6 text-purple-600" />}
                  color="bg-purple-500"
                  percentage={memoryStats.usage}
                />
              </div>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Memory Usage Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                    <p className="text-muted-foreground">
                      Memory usage chart would be displayed here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Database Stats */}
          {activeTab === "database" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Database Statistics
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                  title="Total Students"
                  value={databaseStats.students}
                  icon={<Users className="h-6 w-6 text-blue-600" />}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Total Teachers"
                  value={databaseStats.teachers}
                  icon={<Users className="h-6 w-6 text-green-600" />}
                  color="bg-green-500"
                />
                <StatCard
                  title="Active Elections"
                  value={databaseStats.activeElections}
                  icon={<Activity className="h-6 w-6 text-purple-600" />}
                  color="bg-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Students</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(
                              (databaseStats.students /
                                databaseStats.totalUsers) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${(databaseStats.students / databaseStats.totalUsers) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Teachers</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(
                              (databaseStats.teachers /
                                databaseStats.totalUsers) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${(databaseStats.teachers / databaseStats.totalUsers) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Election Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-center justify-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                      <p className="text-muted-foreground">
                        Election activity chart would be displayed here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* EC Officers Management */}
          {activeTab === "officers" && (
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EC Officers Management
                </h1>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Officer
                </Button>
              </div>

              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New EC Officer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={newOfficer.name}
                            onChange={(e) =>
                              setNewOfficer({
                                ...newOfficer,
                                name: e.target.value,
                              })
                            }
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            type="text"
                            value={newOfficer.username}
                            onChange={(e) =>
                              setNewOfficer({
                                ...newOfficer,
                                username: e.target.value,
                              })
                            }
                            placeholder="Enter username"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={handleAddOfficer}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          {isLoading ? "Adding..." : "Add Officer"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Current EC Officers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ecOfficers.map((officer) => (
                      <motion.div
                        key={officer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${officer.name}`}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                              {officer.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{officer.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Username: {officer.email}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                officer.status === "Active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                              }`}
                            >
                              {officer.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveOfficer(officer.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                System Settings
              </h1>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="system-name">System Name</Label>
                      <Input
                        id="system-name"
                        defaultValue="Election Management System"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        defaultValue="admin@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <Input id="backup-frequency" defaultValue="Daily" />
                    </div>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>EC Officer Registration Successful</DialogTitle>
            <DialogDescription>
              The EC Officer has been successfully registered. Please share the following credentials with them:
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
                    {newOfficer.username}
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
    </div>
  );
};

export default AdminDashboard;
