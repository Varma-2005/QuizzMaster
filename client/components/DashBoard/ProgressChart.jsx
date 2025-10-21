import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";

const ProgressChart = ({ quizHistory = [] }) => {
  const chartData = [...quizHistory]
    .sort(
      (a, b) =>
        new Date(a.createdAt || a.completedAt) -
        new Date(b.createdAt || b.completedAt)
    )
    .map((quiz, i) => {
      const date = new Date(quiz.createdAt || quiz.completedAt);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        name: `Quiz ${i + 1}`,
        displayName: `${formattedDate} - ${formattedTime}`,
        quizNumber: `Quiz ${i + 1}`,
        score: quiz.percentage || 0,
        correctAnswers: quiz.score || 0,
        totalQuestions:
          quiz.totalQuestions || quiz.userAnswers?.length || 0,
        subject: quiz.quizId?.subjectName || quiz.subject || "Unknown",
      };
    });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <motion.div
          className="bg-white p-5 rounded-2xl shadow-2xl border-2 border-orange-200"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-bold text-gray-900 mb-3 text-lg">{d.quizNumber}</p>
          <p className="text-sm text-gray-600 mb-1">📅 {d.displayName}</p>
          <p className="text-sm text-gray-600 mb-3">📚 {d.subject}</p>
          <div className="border-t border-gray-200 mt-3 pt-3">
            <p
              className={`text-lg font-bold mb-1 ${
                d.score >= 80
                  ? "text-green-600"
                  : d.score >= 60
                  ? "text-orange-600"
                  : "text-rose-600"
              }`}
            >
              🎯 Score: {d.score}%
            </p>
            <p className="text-sm text-gray-600">
              ✅ {d.correctAnswers}/{d.totalQuestions} correct
            </p>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const averageScore =
    chartData.length > 0
      ? Math.round(
          chartData.reduce((s, i) => s + i.score, 0) / chartData.length
        )
      : 0;

  if (!chartData.length)
    return (
      <motion.div
        className="bg-white rounded-3xl shadow-lg p-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-orange-100 p-3 rounded-2xl">
            <FaChartLine className="text-3xl text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Progress Chart</h2>
        </div>
        <div className="text-center py-16">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaChartLine className="text-8xl text-gray-300 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-800 text-xl font-bold mb-2">
            No quiz data available
          </p>
          <p className="text-gray-500 text-base">
            Take your first quiz to see your progress trend 📊
          </p>
        </div>
      </motion.div>
    );

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-3 rounded-2xl">
            <FaChartLine className="text-3xl text-orange-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Progress Chart</h2>
            <p className="text-base text-gray-600">Your performance over time</p>
          </div>
        </div>
        <motion.div
          className="bg-gradient-to-br from-orange-400 to-orange-500 px-6 py-4 rounded-2xl shadow-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-sm text-white/90 font-semibold">Average Score</p>
          <p className="text-4xl font-bold text-white">{averageScore}%</p>
        </motion.div>
      </div>

      <motion.div
        className="w-full relative z-10 bg-gray-50 rounded-2xl p-6"
        style={{ height: "400px" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={1} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 13, fontWeight: 600 }} />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: 13, fontWeight: 600 }}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              label={{
                value: "Score (%)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 14, fill: "#4b5563", fontWeight: 700 },
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#fb923c", strokeWidth: 2 }} />
            <Legend wrapperStyle={{ paddingTop: 20, fontWeight: 600, fontSize: 14 }} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#scoreGradient)"
              strokeWidth={4}
              dot={{ fill: "#fb923c", r: 6, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8, strokeWidth: 2, fill: "#fb923c" }}
              name="Score (%)"
            />
            <Line
              type="monotone"
              dataKey={() => averageScore}
              stroke="#10b981"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
              name="Average"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="relative z-10 mt-8 grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
        {[
          { label: "Total Quizzes", value: chartData.length, color: "blue" },
          {
            label: "Highest Score",
            value: Math.max(...chartData.map((d) => d.score)) + "%",
            color: "green",
          },
          {
            label: "Lowest Score",
            value: Math.min(...chartData.map((d) => d.score)) + "%",
            color: "rose",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`text-center bg-${item.color}-50 rounded-2xl p-5`}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <p className="text-sm text-gray-600 font-semibold mb-2">{item.label}</p>
            <p className={`text-4xl font-bold text-${item.color}-600`}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {chartData.length >= 2 && (
        <motion.div
          className="relative z-10 mt-8 p-6 bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl"
        >
          <div className="flex items-center justify-center space-x-3">
            {chartData.at(-1).score > chartData.at(-2).score ? (
              <>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <MdTrendingUp className="text-green-500 text-4xl" />
                </motion.div>
                <p className="text-lg font-bold text-green-600">
                  📈 Improving! Keep up the excellent work!
                </p>
              </>
            ) : chartData.at(-1).score < chartData.at(-2).score ? (
              <>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <MdTrendingDown className="text-rose-500 text-4xl" />
                </motion.div>
                <p className="text-lg font-bold text-rose-600">
                  📉 Keep practicing to improve your scores
                </p>
              </>
            ) : (
              <>
                <MdTrendingUp className="text-gray-500 text-4xl" />
                <p className="text-lg font-bold text-gray-700">
                  ➡️ Maintaining steady performance
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressChart;
