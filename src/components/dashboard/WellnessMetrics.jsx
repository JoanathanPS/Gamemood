import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Target, Zap, Heart, Brain, Trophy, TrendingUp, RefreshCw } from "lucide-react";
import { MoodEntry, GameSession, UserProfile } from "@/entities/all";
import { subDays } from "date-fns";

export default function WellnessMetrics() {
  const [metrics, setMetrics] = useState({
    overall_wellness: 0,
    mood_stability: 0,
    gaming_balance: 0,
    stress_management: 0,
    energy_consistency: 0,
    focus_improvement: 0,
    social_wellness: 0,
    goals_progress: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateWellnessMetrics = useCallback((moodEntries, gameSessions, userProfile) => {
    // If no data, return default values
    if (!moodEntries.length) {
      return {
        overall_wellness: 50,
        mood_stability: 50,
        gaming_balance: 50,
        stress_management: 50,
        energy_consistency: 50,
        focus_improvement: 50,
        social_wellness: 50,
        goals_progress: 50,
      };
    }

    // Calculate mood stability (consistency in mood scores)
    const moodScores = moodEntries.map(entry => 
      (entry.energy_level + (10 - entry.stress_level) + entry.focus_level + entry.social_desire + entry.challenge_seeking) / 5
    );
    const avgMoodScore = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;
    const moodVariance = moodScores.reduce((sum, score) => sum + Math.pow(score - avgMoodScore, 2), 0) / moodScores.length;
    const moodStability = Math.max(0, Math.min(100, 100 - (moodVariance * 10))); // Lower variance = higher stability

    // Calculate stress management (lower average stress = better management)
    const avgStress = moodEntries.reduce((sum, entry) => sum + entry.stress_level, 0) / moodEntries.length;
    const stressManagement = Math.max(0, Math.min(100, (10 - avgStress) * 10));

    // Calculate energy consistency
    const energyLevels = moodEntries.map(entry => entry.energy_level);
    const avgEnergy = energyLevels.reduce((sum, level) => sum + level, 0) / energyLevels.length;
    const energyVariance = energyLevels.reduce((sum, level) => sum + Math.pow(level - avgEnergy, 2), 0) / energyLevels.length;
    const energyConsistency = Math.max(0, Math.min(100, 100 - (energyVariance * 8)));

    // Calculate focus improvement (average focus level)
    const avgFocus = moodEntries.reduce((sum, entry) => sum + entry.focus_level, 0) / moodEntries.length;
    const focusImprovement = (avgFocus / 10) * 100;

    // Calculate social wellness (balance of social interactions)
    const avgSocialDesire = moodEntries.reduce((sum, entry) => sum + entry.social_desire, 0) / moodEntries.length;
    const socialWellness = Math.min(100, (avgSocialDesire / 10) * 100);

    // Calculate gaming balance (variety of session lengths and satisfaction)
    let gamingBalance = 50; // Default if no sessions
    if (gameSessions.length > 0) {
      const avgSatisfaction = gameSessions.reduce((sum, session) => sum + session.satisfaction_rating, 0) / gameSessions.length;
      const sessionLengthVariety = new Set(gameSessions.map(s => s.duration_minutes)).size;
      gamingBalance = Math.min(100, (avgSatisfaction / 5) * 50 + (sessionLengthVariety * 10));
    }

    // Calculate goals progress based on user profile wellness goals
    let goalsProgress = 60; // Default progress
    if (userProfile?.wellness_goals?.length) {
      // Simple calculation based on wellness streak and mood improvements
      const streakBonus = Math.min(40, (userProfile.wellness_streak || 0) * 2);
      const moodBonus = Math.min(40, avgMoodScore * 4);
      goalsProgress = streakBonus + moodBonus;
    }

    // Calculate overall wellness as weighted average
    const overallWellness = (
      moodStability * 0.2 +
      stressManagement * 0.2 +
      energyConsistency * 0.15 +
      focusImprovement * 0.15 +
      socialWellness * 0.1 +
      gamingBalance * 0.1 +
      goalsProgress * 0.1
    );

    return {
      overall_wellness: Math.round(overallWellness),
      mood_stability: Math.round(moodStability),
      gaming_balance: Math.round(gamingBalance),
      stress_management: Math.round(stressManagement),
      energy_consistency: Math.round(energyConsistency),
      focus_improvement: Math.round(focusImprovement),
      social_wellness: Math.round(socialWellness),
      goals_progress: Math.round(goalsProgress),
    };
  }, []);

  const loadWellnessMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load recent data (last 30 days)
      const [moodEntries, gameSessions, userProfiles] = await Promise.all([
        MoodEntry.list("-created_date", 30),
        GameSession.list("-created_date", 30),
        UserProfile.list("", 1)
      ]);

      const userProfile = userProfiles.length > 0 ? userProfiles[0] : null;
      const calculatedMetrics = calculateWellnessMetrics(moodEntries, gameSessions, userProfile);
      
      setMetrics(calculatedMetrics);
    } catch (error) {
      console.error("Error loading wellness metrics:", error);
      setError("Unable to load wellness metrics. Please try again.");
    }
    
    setIsLoading(false);
  }, [calculateWellnessMetrics]);

  useEffect(() => {
    loadWellnessMetrics();
  }, [loadWellnessMetrics]);

  const metricCategories = [
    {
      title: "Overall Wellness",
      value: metrics.overall_wellness,
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      description: "Your comprehensive wellness score"
    },
    {
      title: "Gaming Balance",
      value: metrics.gaming_balance,
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      description: "Healthy gaming habits score"
    },
    {
      title: "Mood Stability",
      value: metrics.mood_stability,
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      description: "Emotional consistency over time"
    },
    {
      title: "Energy Levels",
      value: metrics.energy_consistency,
      icon: Zap,
      color: "from-orange-500 to-yellow-500",
      bgColor: "bg-orange-50",
      description: "Energy management effectiveness"
    },
    {
      title: "Focus & Concentration",
      value: metrics.focus_improvement,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      description: "Focus enhancement through gaming"
    },
    {
      title: "Goals Progress",
      value: metrics.goals_progress,
      icon: Trophy,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      description: "Progress toward wellness goals"
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Attention";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading wellness metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadWellnessMetrics} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Your Wellness Metrics</h3>
        <Button onClick={loadWellnessMetrics} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCategories.map((metric, index) => {
          const IconComponent = metric.icon;
          
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${metric.bgColor} border-0 shadow-md hover:shadow-lg transition-shadow duration-300 h-full`}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-gray-800 text-base">{metric.title}</span>
                        <p className="text-sm text-gray-600 font-normal mt-1">
                          {metric.description}
                        </p>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-3xl font-bold ${getScoreColor(metric.value)}`}>
                        {metric.value}%
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`${getScoreColor(metric.value)} bg-white/80`}
                      >
                        {getScoreLabel(metric.value)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress 
                        value={metric.value} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {metric.value >= 80 ? (
                      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg p-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Great progress! Keep it up</span>
                      </div>
                    ) : metric.value < 60 ? (
                      <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 rounded-lg p-2">
                        <Target className="w-4 h-4" />
                        <span>Room for improvement</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-lg p-2">
                        <Brain className="w-4 h-4" />
                        <span>Making good progress</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}