import React, { useState, useEffect } from "react";
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
import { User, Shield, UserCog, Vote } from "lucide-react";

const Home = ({ votingStart, votingEnd }) => {
  const navigate = useNavigate();

  const [now, setNow] = useState(new Date());
  const [timeToStart, setTimeToStart] = useState(null);
  const [timeToEnd, setTimeToEnd] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date();
      setNow(current);
      setTimeToStart(Math.max(0, votingStart.getTime() - current.getTime()));
setTimeToEnd(Math.max(0, votingEnd.getTime() - current.getTime()));

    }, 1000);
    return () => clearInterval(interval);
  }, [votingStart, votingEnd]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const d = Math.floor(totalSeconds / (3600 * 24));
    const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

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
    gradient: "from-blue-500 to-indigo-500",
    hoverGradient: "from-blue-600 to-indigo-600",
    route: "/login?role=user",
  },
  {
    role: "ec-officer",
    label: "Login as EC Officer",
    icon: <UserCog className="h-6 w-6" />,
    description: "Manage elections and approve candidates",
    gradient: "from-purple-500 to-fuchsia-500",
    hoverGradient: "from-purple-600 to-fuchsia-600",
    route: "/login?role=ec-officer",
  },
  {
    role: "admin",
    label: "Login as Admin",
    icon: <Shield className="h-6 w-6" />,
    description: "System administration and oversight",
    gradient: "from-emerald-500 to-slate-500",
    hoverGradient: "from-emerald-700 to-slate-700", // <-- dark gradient on hover
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
        className="relative z-10 w-full max-w-5xl mx-auto"
      >
        {/* Hero */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl"
            >
              <Vote className="h-12 w-12 text-white" />
            </motion.div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            VoteCast.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Secure, Transparent, Democratic
          </p>
        </motion.div>

        

        {/* Voting Timeline */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="w-full px-6 py-8 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-lg shadow-xl">
            <h2
  className="text-4xl md:text-2xl font-semibold text-center mb-8 tracking-wide text-white"
  style={{ fontFamily: "'Poppins', sans-serif" }}
>
  🗳️ Voting Timeline
</h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-md">
                <h3 className="text-lg text-blue-400 font-semibold">Start Date</h3>
                <p className="text-2xl text-white font-bold">
                  {votingStart.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-md">
                <h3 className="text-lg text-blue-400 font-semibold">Start Day</h3>
                <p className="text-2xl text-white font-bold">
                  {votingStart.toLocaleDateString("en-GB", { weekday: "long" })}
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 p-4 rounded-xl shadow-2xl border border-white/30 text-white animate-pulse">
                <h3 className="text-lg font-semibold">Live Vote Count</h3>
                <p className="text-4xl font-bold mt-2 tracking-widest">12,345</p>
                <p className="text-sm text-white/70">Updating in real-time</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-md">
                <h3 className="text-lg text-green-400 font-semibold">End Day</h3>
                <p className="text-2xl text-white font-bold">
                  {votingEnd.toLocaleDateString("en-GB", { weekday: "long" })}
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-md">
                <h3 className="text-lg text-green-400 font-semibold">End Date</h3>
                <p className="text-2xl text-white font-bold">
                  {votingEnd.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            {/* Countdown */}
            <div className="mt-8 text-center font-poppins">
  {now < votingStart ? (
    <p className="text-blue-300 text-lg font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
      Voting starts in: <span className="text-white">{formatTime(timeToStart)}</span>
    </p>
  ) : now < votingEnd ? (
    <p className="text-green-300 text-lg font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
      Voting ends in: <span className="text-white">{formatTime(timeToEnd)}</span>
    </p>
  ) : (
    <p className="text-red-400 text-lg font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
      Voting has ended.
    </p>
  )}
</div>

          </div>
        </motion.div>

        {/* Welcome Card */}
        <motion.div variants={itemVariants} className="mb-12">
          <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-white mb-2 ">
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
                          animate={{ rotate: [0, 5, -5, 0] }}
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

        </motion.div>
        {/* About Section */}
;

<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
  className="relative z-10 mb-28 max-w-6xl mx-auto px-6"
>
  {/* Glowing Gradient Backdrop */}
  <div className="absolute inset-0 blur-3xl opacity-20 pointer-events-none z-0">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 rounded-full animate-pulse" />
  </div>

  <div className="relative z-10 text-center">
    {/* Gradient Animated Title */}
    <motion.h2
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-500 to-indigo-400 mb-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      About The Portal
    </motion.h2>

    <p className="text-white/80 text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
      Step into a new era of voting with <span className="text-pink-300 font-semibold">VoteCast</span> — a
      powerful digital platform where security meets simplicity. Designed to empower democracy,
      our system makes elections accessible, real-time, and trustworthy for all.
    </p>

    {/* Glowing Feature Grid */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
      {[
        {
          title: "Seamless Experience",
          desc: "From login to vote casting, every step is frictionless and beautifully responsive.",
          icon: "✨",
          glow: "from-pink-400 to-purple-500",
        },
        {
          title: "End-to-End Security",
          desc: "Each vote is encrypted, stored safely, and validated with zero compromise.",
          icon: "🛡️",
          glow: "from-indigo-500 to-blue-500",
        },
        {
          title: "Live Transparency",
          desc: "Track results in real-time with an auditable, transparent backend system.",
          icon: "📊",
          glow: "from-cyan-400 to-sky-500",
        },
        {
          title: "Decentralized Control",
          desc: "Role-based access puts power in the right hands—admin, officers, and voters.",
          icon: "🔗",
          glow: "from-green-400 to-emerald-500",
        },
        {
          title: "Built for Everyone",
          desc: "Accessible on all devices with a focus on clarity and performance.",
          icon: "📱",
          glow: "from-yellow-400 to-orange-400",
        },
        {
          title: "Powered by Trust",
          desc: "Open systems, verified users, and no dark corners — trust is the core.",
          icon: "🤝",
          glow: "from-fuchsia-400 to-pink-500",
        },
      ].map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          className={`rounded-xl bg-gradient-to-br ${item.glow} p-5 shadow-2xl text-white transform transition hover:scale-[1.02]`}
        >
          <div className="text-3xl mb-2">{item.icon}</div>
          <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
          <p className="text-white/80 text-sm">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>

{/* How It Works */}
<section className="relative z-10 mb-24 max-w-6xl mx-auto px-4">
  {/* Beautiful Animated Heading */}
  <motion.h2
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true }}
    className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 text-center mb-16 drop-shadow-md"
    style={{ fontFamily: "'Poppins', sans-serif" }}
  >
    How It Works
  </motion.h2>

  {/* Magic Glow Cards */}
  <motion.div
    className="grid md:grid-cols-3 gap-8"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.25 } },
    }}
  >
    {[
      {
        title: "Register",
        desc: "Secure login and verification before casting your vote.",
        icon: "📝",
      },
      {
        title: "Vote",
        desc: "Make your choice with a single tap — safe, encrypted, instant.",
        icon: "🗳️",
      },
      {
        title: "Track Results",
        desc: "Watch live results unfold transparently in real-time.",
        icon: "📈",
      },
    ].map((step, idx) => (
      <motion.div
        key={idx}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hover:shadow-fuchsia-500/40 transition-all duration-300 p-8 text-center relative overflow-hidden"
      >
        {/* Icon Glow Bubble */}
        <div className="text-5xl mb-4 relative z-10">{step.icon}</div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{step.desc}</p>

        {/* Background animation circle */}
        <div className="absolute w-48 h-48 bg-gradient-to-tr from-fuchsia-500 to-cyan-500 opacity-10 blur-3xl rounded-full top-0 left-1/2 transform -translate-x-1/2 group-hover:opacity-20 transition-all duration-500" />
      </motion.div>
    ))}
  </motion.div>

  {/* Bottom Decorative Glow */}
  <div className="absolute inset-x-0 bottom-[-100px] z-0 flex justify-center">
    <div className="w-96 h-96 bg-gradient-to-tr from-fuchsia-400 to-cyan-500 rounded-full blur-[120px] opacity-20"></div>
  </div>
</section>


{/* Why Choose Us */}
<section className="relative z-10 mb-24 max-w-6xl mx-auto px-4">
  {/* Animated Gradient Heading */}
  <motion.h2
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true }}
    className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-400 text-center mb-16 drop-shadow-md"
    style={{ fontFamily: "'Poppins', sans-serif" }}
  >
    Why Choose Us?
  </motion.h2>

  {/* Feature Cards */}
  <motion.div
    className="grid md:grid-cols-3 gap-8"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.25 } },
    }}
  >
    {[
      {
        title: "Transparent",
        desc: "Live vote tracking and verifiable audit trails ensure full transparency.",
        icon: "🔍",
      },
      {
        title: "Secure",
        desc: "End-to-end encryption, identity validation, and role-based control.",
        icon: "🔐",
      },
      {
        title: "Accessible",
        desc: "A beautifully responsive design for every user, everywhere.",
        icon: "🌐",
      },
    ].map((item, idx) => (
      <motion.div
        key={idx}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 p-8 text-center overflow-hidden"
      >
        <div className="text-5xl mb-4 relative z-10">{item.icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2 relative z-10">
          {item.title}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed relative z-10">
          {item.desc}
        </p>

        {/* Glow animation bubble */}
        <div className="absolute w-48 h-48 bg-gradient-to-br from-fuchsia-500 to-cyan-500 opacity-10 blur-3xl rounded-full top-0 left-1/2 transform -translate-x-1/2 group-hover:opacity-20 transition-all duration-500" />
      </motion.div>
    ))}
  </motion.div>

  {/* Decorative Glow Background */}
  <div className="absolute inset-x-0 bottom-[-100px] z-0 flex justify-center">
    <div className="w-96 h-96 bg-gradient-to-tr from-fuchsia-400 to-sky-500 rounded-full blur-[120px] opacity-20"></div>
  </div>
</section>


{/* Testimonials */}
{/* Testimonials - Enhanced Design */}
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{ staggerChildren: 0.2 }}
  className="relative mb-24 px-4"
>
  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-slate-900/60 rounded-3xl blur-xl opacity-40 z-0" />
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    }}
    className="relative z-10 max-w-6xl mx-auto"
  >
<motion.h2
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{
    duration: 1,
    ease: "easeOut",
    type: "spring",
    bounce: 0.4,
  }}
  className="text-center text-5xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-indigo-400 to-cyan-400 text-transparent bg-clip-text tracking-tight mb-16"
  style={{ fontFamily: "'Poppins', sans-serif" }}
>
   What People Are Saying
</motion.h2>



    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          name: "Aarav S.",
          quote: "Voting online was never this easy. The portal is fast, secure, and beautifully designed!",
        },
        {
          name: "Meera K.",
          quote: "Loved how transparent the process was. I could track results live!",
        },
        {
          name: "Raj D.",
          quote: "This is the future of voting. No more long queues and confusion.",
        },
      ].map((person, idx) => (
        <motion.div
          key={idx}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, delay: idx * 0.2 }}
          className="relative bg-white/10 p-6 pt-10 rounded-2xl border border-white/20 text-white shadow-xl hover:bg-white/20 transition group backdrop-blur-md"
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
            {person.name.split(" ")[0][0]}
          </div>
          <div className="relative z-10">
            <p className="italic text-white/90 mb-4 text-sm leading-relaxed before:content-['“'] after:content-['”']">
              {person.quote}
            </p>
            <h4 className="text-sm font-semibold text-white/80 text-right">— {person.name}</h4>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
</motion.section>

      {/* Footer Section */}
<motion.footer
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
  className="relative z-10 bg-white/5 backdrop-blur-md border-t border-white/10 mt-24 pt-12 pb-8"
>
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-white">
    {/* Left - Branding */}
    <div>
      <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
        VoteCast.
      </h3>
      <p className="text-sm text-gray-300">
        Empowering democracy through secure, digital, and transparent elections.
      </p>
    </div>

    {/* Middle - Navigation */}
    <div>
      <h4 className="text-xl font-semibold mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Quick Links
      </h4>
      <ul className="space-y-2 text-sm text-gray-300">
        <li><a href="/" className="hover:text-white transition">Home</a></li>
        <li><a href="/login" className="hover:text-white transition">Login</a></li>
        <li><a href="/user-dashboard" className="hover:text-white transition">User Dashboard</a></li>
        <li><a href="/admin-dashboard" className="hover:text-white transition">Admin Dashboard</a></li>
      </ul>
    </div>

    {/* Right - Contact Info */}
    <div>
      <h4 className="text-xl font-semibold mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Contact
      </h4>
      <p className="text-sm text-gray-300">Email: support@votecast-portal.gov</p>
      <p className="text-sm text-gray-300 mt-1">Phone: +91 97885 56432</p>
    </div>
  </div>

  {/* Divider */}
  <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-gray-400">
    © {new Date().getFullYear()} VoteCast Portal. All rights reserved.
  </div>
</motion.footer>

      </motion.div>
    </div>
  );
};

export default Home;
