import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";

export default function WellnessChart({ data = [], title = "Mood Trends", type = "line" }) {
  // Sample data if none provided
  const defaultData = [
    { date: "Mon", mood_score: 6.5, energy: 7, stress: 4, focus: 6 },
    { date: "Tue", mood_score: 7.2, energy: 6, stress: 5, focus: 7 },
    { date: "Wed", mood_score: 8.1, energy: 8, stress: 3, focus: 8 },
    { date: "Thu", mood_score: 7.8, energy: 7, stress: 4, focus: 7 },
    { date: "Fri", mood_score: 8.5, energy: 9, stress: 2, focus: 8 },
    { date: "Sat", mood_score: 9.0, energy: 8, stress: 2, focus: 6 },
    { date: "Sun", mood_score: 8.3, energy: 7, stress: 3, focus: 7 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-gray-800">{title}</span>
            <p className="text-sm text-gray-600 font-normal mt-1">
              Your wellness journey over time
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === "area" ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  domain={[0, 10]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="mood_score"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#moodGradient)"
                  name="Mood Score"
                />
                <Area
                  type="monotone"
                  dataKey="energy"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="url(#energyGradient)"
                  name="Energy"
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  domain={[0, 10]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="mood_score"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                  name="Mood Score"
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 3 }}
                  name="Energy"
                />
                <Line
                  type="monotone"
                  dataKey="stress"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: "#EF4444", strokeWidth: 2, r: 3 }}
                  name="Stress"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Mood Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-gray-600">Energy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Stress</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}