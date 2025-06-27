import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Shield, UserCog, Vote, Sparkles } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  const roleButtons = [
    {
      role: "user",
      label: "Login as User",
      icon: <User className="h-6 w-6" />,
      description: "Access voting portal and candidate applications",
      gradient: "from-blue-500 to-cyan-500",
      hoverGradient: "from-blue-600 to-cyan-600",
      route: "/login?role=user",
    },
    {
      role: "ec-officer",
      label: "Login as EC Officer",
      icon: <UserCog className="h-6 w-6" />,
      description: "Manage elections and approve candidates",
      gradient: "from-purple-500 to-pink-500",
      hoverGradient: "from-purple-600 to-pink-600",
      route: "/login?role=ec-officer",
    },
    {
      role: "admin",
      label: "Login as Admin",
      icon: <Shield className="h-6 w-6" />,
      description: "System administration and oversight",
      gradient: "from-emerald-500 to-teal-500",
      hoverGradient: "from-emerald-600 to-teal-600",
      route: "/login?role=admin",
    },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 font-['Inter',sans-serif]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl mx-auto"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl"
            >
              <Vote className="h-12 w-12 text-white" />
            </motion.div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            Digital Election Portal
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Secure, Transparent, Democratic
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">Powered by modern technology</span>
            <Sparkles className="h-4 w-4" />
          </div>
        </motion.div>

        {/* Welcome Card */}
        <motion.div variants={itemVariants} className="mb-12">
          <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-white mb-2">
                Welcome to the Future of Voting
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Choose your role to access the election management system
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roleButtons.map((button, index) => (
                  <motion.div
                    key={button.role}
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="group"
                  >
                    <motion.div variants={buttonVariants}>
                      <Button
                        onClick={() => navigate(button.route)}
                        className={`w-full h-auto p-6 bg-gradient-to-r ${button.gradient} hover:${button.hoverGradient} border-0 shadow-lg group-hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-4 text-white`}
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.5,
                          }}
                          className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
                        >
                          {button.icon}
                        </motion.div>
                        <div className="text-center">
                          <div className="font-semibold text-lg mb-1">
                            {button.label}
                          </div>
                          <div className="text-sm opacity-90 font-normal">
                            {button.description}
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "Secure Voting",
                description: "End-to-end encryption ensures vote integrity",
                icon: "🔒",
              },
              {
                title: "Real-time Results",
                description: "Live updates and transparent counting",
                icon: "📊",
              },
              {
                title: "Mobile Friendly",
                description: "Vote from anywhere, on any device",
                icon: "📱",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-white font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Digital Election Portal. All rights
            reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
