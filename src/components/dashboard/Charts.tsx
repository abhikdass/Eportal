import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const voterTurnoutData = [
  { date: "2024-01-01", turnout: 10 },
  { date: "2024-01-02", turnout: 35 },
  { date: "2024-01-03", turnout: 50 },
  { date: "2024-01-04", turnout: 70 },
  { date: "2024-01-05", turnout: 85 },
];

const resultsData = [
  { name: "Candidate A", votes: 1200 },
  { name: "Candidate B", votes: 1100 },
  { name: "Candidate C", votes: 900 },
  { name: "Candidate D", votes: 800 },
];

const updates = [
  { time: "2024-01-05 14:30", message: "Final day of voting in progress" },
  { time: "2024-01-04 16:45", message: "Record turnout observed in District 3" },
  { time: "2024-01-03 09:15", message: "All polling stations operating normally" },
];

const Charts = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10 space-y-12">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Election Dashboard</h1>
        <p className="text-gray-600">Live analytics and updates from the 2024 elections</p>
      </header>

      {/* Quick Statistics */}
      <section>
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Quick Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-indigo-50 text-indigo-700 p-5 rounded-lg shadow-sm">
              <p className="text-3xl font-extrabold">4,000</p>
              <p className="text-sm text-gray-600">Total Votes</p>
            </div>
            <div className="bg-indigo-50 text-indigo-700 p-5 rounded-lg shadow-sm">
              <p className="text-3xl font-extrabold">4</p>
              <p className="text-sm text-gray-600">Candidates</p>
            </div>
            <div className="bg-indigo-50 text-indigo-700 p-5 rounded-lg shadow-sm">
              <p className="text-3xl font-extrabold">82%</p>
              <p className="text-sm text-gray-600">Turnout</p>
            </div>
            <div className="bg-indigo-50 text-indigo-700 p-5 rounded-lg shadow-sm">
              <p className="text-3xl font-extrabold">3</p>
              <p className="text-sm text-gray-600">Updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Voter Turnout Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🗳️ Voter Turnout Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={voterTurnoutData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="turnout"
                stroke="#06b6d4"
                strokeWidth={3}
                name="Turnout"
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Election Results Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Current Results</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resultsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes" fill="#a78bfa" name="Votes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Updates Section */}
      <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">📰 Latest Updates</h2>
        <ul className="space-y-4">
          {updates.map((update, idx) => (
            <li key={idx} className="border-l-4 border-indigo-500 pl-4">
              <p className="text-sm font-semibold text-gray-700">{update.time}</p>
              <p className="text-sm text-gray-600">{update.message}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Charts;
