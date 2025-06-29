import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LockIcon,
  UserIcon,
  ShieldIcon,
  UserCogIcon,
  UserCheckIcon,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

interface LoginFormProps {
  onLogin?: (role: string, username: string) => void;
}

const LoginForm = ({ onLogin = () => {} }: LoginFormProps) => {
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get("role") || "user";
  const [activeTab, setActiveTab] = useState(roleFromUrl);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab(roleFromUrl);
  }, [roleFromUrl]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setError("");
    // Update URL to reflect the selected role
    navigate(`/login?role=${value}`, { replace: true });
  };

  const encryptPassword = (password: string): string => {
    // Simple Base64 encryption for mockup purposes
    return btoa(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!username.trim() || !password.trim()) {
    setError("Username and password are required");
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        role: activeTab,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed. Please try again.");
    }

    // Optional: store token or user data if provided
    // ✅ Store token and name
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("role", data.role); 

    onLogin(activeTab, username);

    // Navigate to respective dashboard
    switch (activeTab) {
      case "user":
        navigate("/user-dashboard");
        break;
      case "ec-officer":
        navigate("/ec-officer-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      default:
        navigate("/user-dashboard");
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};


  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const getRoleIcon = () => {
    switch (activeTab) {
      case "user":
        return <UserIcon className="h-5 w-5" />;
      case "ec-officer":
        return <UserCogIcon className="h-5 w-5" />;
      case "admin":
        return <ShieldIcon className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  const getRoleGradient = () => {
    switch (activeTab) {
      case "user":
        return "from-blue-500 to-cyan-500";
      case "ec-officer":
        return "from-purple-500 to-pink-500";
      case "admin":
        return "from-emerald-500 to-teal-500";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 font-['Inter',sans-serif]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>

        <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className={`mx-auto mb-4 p-3 rounded-full bg-gradient-to-r ${getRoleGradient()} shadow-lg`}
            >
              {getRoleIcon()}
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">
              Election Portal Login
            </CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to access the election portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6 bg-white/10 border border-white/20">
                <TabsTrigger
                  value="user"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">User</span>
                </TabsTrigger>
                <TabsTrigger
                  value="ec-officer"
                  className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                >
                  <UserCogIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">EC Officer</span>
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                >
                  <ShieldIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert
                      variant="destructive"
                      className="bg-red-500/20 border-red-500/50 text-red-200"
                    >
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">
                    Username
                  </Label>
                  <div className="relative">
                    <UserCheckIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className={`w-full group relative overflow-hidden bg-gradient-to-r ${getRoleGradient()} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  disabled={isLoading}
                >
                  <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        {getRoleIcon()}
                        <span>
                          Login as{" "}
                          {activeTab === "ec-officer"
                            ? "EC Officer"
                            : activeTab.charAt(0).toUpperCase() +
                              activeTab.slice(1)}
                        </span>
                      </>
                    )}
                  </span>
                </Button>
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Election Portal System
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginForm;
