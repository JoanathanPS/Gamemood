import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Target, Calendar, Clock, Gamepad2, Heart, Brain, Award, RefreshCw, AlertCircle } from "lucide-react";
import { MoodEntry, GameSession, UserProfile } from "@/entities/all";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

import WellnessChart from "@/components/dashboard/WellnessChart";
import WellnessMetrics from "@/components/dashboard/WellnessMetrics";

export default function DashboardPage() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [gameSessions, setGameSessions] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [moods, sessions, profiles] = await Promise.all([
        MoodEntry.list("-created_date", 30),
        GameSession.list("-created_date", 20),
        UserProfile.list("", 1)
      ]);

      setMoodEntries(moods);
      setGameSessions(sessions);
      if (profiles.length > 0) {
        setUserProfile(profiles[0]);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Unable to load dashboard data. Please try refreshing.");
    }
    setIsLoading(false);
  };

  const getTimeRangeData = () => {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case "week":
        startDate = startOfWeek(now);
        break;
      case "month":
        startDate = subDays(now, 30);
        break;
      default:
        startDate = subDays(now, 7);
    }

    return moodEntries.filter(entry => 
      new Date(entry.created_date) >= startDate
    );
  };

  const calculateMoodTrends = () => {
    const filteredEntries = getTimeRangeData();
    
    if (!filteredEntries.length) {
      // Return sample data if no entries
      return [
        { date: "Today", mood_score: 7.0, energy: 6, stress: 4, focus: 6 },
      ];
    }
    
    // Group by day and calculate averages
    const groupedData = {};
    
    filteredEntries.forEach(entry => {
      const date = format(new Date(entry.created_date), 'MMM dd');
      if (!groupedData[date]) {
        groupedData[date] = {
          date,
          entries: [],
          mood_score: 0,
          energy: 0,
          stress: 0,
          focus: 0
        };
      }
      groupedData[date].entries.push(entry);
    });

    // Calculate averages for each day
    Object.values(groupedData).forEach(day => {
      const count = day.entries.length;
      if (count > 0) {
        day.mood_score = day.entries.reduce((sum, e) => sum + 
          ((e.energy_level + (10 - e.stress_level) + e.focus_level + e.social_desire + e.challenge_seeking) / 5), 0) / count;
        day.energy = day.entries.reduce((sum, e) => sum + e.energy_level, 0) / count;
        day.stress = day.entries.reduce((sum, e) => sum + e.stress_level, 0) / count;
        day.focus = day.entries.reduce((sum, e) => sum + e.focus_level, 0) / count;
      }
    });

    return Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const calculateStats = () => {
    const recentEntries = getTimeRangeData();
    const recentSessions = gameSessions.filter(session => 
      new Date(session.created_date) >= subDays(new Date(), timeRange === "month" ? 30 : 7)
    );

    const avgMoodScore = recentEntries.length > 0 
      ? recentEntries.reduce((sum, entry) => sum + 
          ((entry.energy_level + (10 - entry.stress_level) + entry.focus_level + entry.social_desire + entry.challenge_seeking) / 5), 0) / recentEntries.length
      : 0;

    const totalPlayTime = recentSessions.reduce((sum, session) => sum + (session.duration_minutes || 0), 0);
    const avgSessionSatisfaction = recentSessions.length > 0
      ? recentSessions.reduce((sum, session) => sum + session.satisfaction_rating, 0) / recentSessions.length
      : 0;

    return {
      avgMoodScore: avgMoodScore.toFixed(1),
      totalMoodEntries: recentEntries.length,
      totalPlayTime: Math.round(totalPlayTime),
      totalSessions: recentSessions.length,
      avgSessionSatisfaction: avgSessionSatisfaction.toFixed(1),
      wellnessStreak: userProfile?.wellness_streak || 0
    };
  };

  const getWellnessInsights = () => {
    const stats = calculateStats();
    const insights = [];

    if (stats.totalMoodEntries === 0) {
      insights.push({
        type: "attention",
        title: "Start Your Wellness Journey",
        description: "Begin tracking your mood to get personalized gaming recommendations and insights.",
        icon: Brain
      });
      return insights;
    }

    if (stats.avgMoodScore >= 7.5) {
      insights.push({
        type: "positive",
        title: "Great Mood Trends!",
        description: `Your average mood score of ${stats.avgMoodScore}/10 shows excellent emotional wellness.`,
        icon: TrendingUp
      });
    } else if (stats.avgMoodScore < 5) {
      insights.push({
        type: "attention",
        title: "Focus on Self-Care",
        description: "Your mood scores suggest you might benefit from more stress-relief activities.",
        icon: Heart
      });
    }

    if (stats.wellnessStreak >= 7) {
      insights.push({
        type: "achievement",
        title: "Wellness Streak!",
        description: `Amazing! You've maintained your wellness routine for ${stats.wellnessStreak} days.`,
        icon: Award
      });
    }

    if (stats.totalPlayTime > 0 && stats.avgSessionSatisfaction >= 4) {
      insights.push({
        type: "positive",
        title: "Balanced Gaming",
        description: "Your gaming sessions are contributing positively to your wellness.",
        icon: Gamepad2
      });
    }

    return insights;
  };

  const stats = calculateStats();
  const chartData = calculateMoodTrends();
  const insights = getWellnessInsights();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-gray-700">Loading your wellness dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Wellness Dashboard
              </h1>
              <p className="text-gray-600">
                Track your mood patterns, gaming habits, and wellness progress
              </p>
            </div>
            <Button onClick={loadDashboardData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error Loading Dashboard</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Average Mood</p>
                  <p className="text-3xl font-bold">{stats.avgMoodScore}/10</p>
                </div>
                <Brain className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Wellness Streak</p>
                  <p className="text-3xl font-bold">{stats.wellnessStreak} days</p>
                </div>
                <Award className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Gaming Sessions</p>
                  <p className="text-3xl font-bold">{stats.totalSessions}</p>
                </div>
                <Gamepad2 className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Play Time</p>
                  <p className="text-3xl font-bold">{stats.totalPlayTime}min</p>
                </div>
                <Clock className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800">
                  Detailed Analytics
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={timeRange === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={timeRange === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("month")}
                  >
                    Month
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="trends">Mood Trends</TabsTrigger>
                  <TabsTrigger value="wellness">Wellness Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Insights Cards */}
                  {insights.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {insights.map((insight, index) => {
                        const IconComponent = insight.icon;
                        const colorClasses = {
                          positive: "bg-green-50 border-green-200 text-green-800",
                          attention: "bg-yellow-50 border-yellow-200 text-yellow-800",
                          achievement: "bg-purple-50 border-purple-200 text-purple-800"
                        };

                        return (
                          <Card key={index} className={`border-2 ${colorClasses[insight.type]}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <IconComponent className="w-5 h-5 mt-1 flex-shrink-0" />
                                <div>
                                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                                  <p className="text-sm opacity-80">{insight.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {/* Recent Activity Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-blue-50 border-0">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          Recent Mood Entries
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-blue-600 mb-2">{stats.totalMoodEntries}</p>
                        <p className="text-sm text-gray-600">
                          {timeRange === "week" ? "This week" : "This month"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-50 border-0">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          Session Satisfaction
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-purple-600 mb-2">
                          {stats.avgSessionSatisfaction > 0 ? `${stats.avgSessionSatisfaction}/5` : 'No data'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Average satisfaction rating
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="trends">
                  <WellnessChart 
                    data={chartData}
                    title="Mood Trends Over Time"
                    type="area"
                  />
                </TabsContent>

                <TabsContent value="wellness">
                  <WellnessMetrics />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}