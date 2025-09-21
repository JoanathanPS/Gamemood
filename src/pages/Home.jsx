import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, ArrowRight, Clock, Sun, Cloud, CloudRain, Thermometer, Gamepad2, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MoodEntry, UserProfile } from "@/entities/all";

import MoodSliders from "@/components/mood/MoodSliders";
import MoodTextAnalysis from "@/components/mood/MoodTextAnalysis";

export default function HomePage() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("sliders");
  const [moodValues, setMoodValues] = useState({});
  const [textAnalysis, setTextAnalysis] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profiles = await UserProfile.list("", 1);
      if (profiles.length > 0) {
        setUserProfile(profiles[0]);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const getTimeContext = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "late_night";
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning, Gamer";
    if (hour < 18) return "Good Afternoon, Player";
    return "Good Evening, Legend";
  };

  const getWeatherMoodFactor = () => {
    const weatherOptions = ["sunny", "cloudy", "neutral"];
    return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
  };

  const handleMoodSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const finalMoodValues = textAnalysis?.mood_dimensions || moodValues;
      
      const moodEntry = await MoodEntry.create({
        ...finalMoodValues,
        mood_text: textAnalysis ? textAnalysis.supportive_message || "Analyzed from text input" : "",
        mood_analysis: textAnalysis ? {
          sentiment_score: textAnalysis.sentiment_score,
          emotional_keywords: textAnalysis.emotional_keywords,
          recommended_activities: textAnalysis.recommended_activities
        } : null,
        context: getTimeContext(),
        weather_mood_factor: getWeatherMoodFactor()
      });

      navigate(createPageUrl("Recommendations") + `?mood_entry_id=${moodEntry.id}`);
    } catch (error) {
      console.error("Error saving mood entry:", error);
    }
    
    setIsSubmitting(false);
  };

  const canSubmit = () => {
    if (currentTab === "sliders") {
      return Object.keys(moodValues).length >= 5;
    }
    return textAnalysis !== null && textAnalysis.mood_dimensions;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4 md:p-8 relative overflow-hidden">
      {/* Gaming-themed background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(167,139,250,0.2),transparent_50%)]"></div>
      <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse delay-500"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Gaming-focused Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                GameMood AI
              </h1>
              <p className="text-gray-300 text-lg font-medium">Your Ultimate Gaming Wellness Companion</p>
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {getGreeting()}! Ready to level up your mood?
                </span>
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-200 max-w-3xl mx-auto text-lg leading-relaxed">
                Tell me how you're feeling right now, and I'll recommend the perfect games to enhance your 
                wellness and match your gaming energy. Let's find your next gaming adventure! 🎮
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gaming Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 text-white">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Gamepad2 className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="font-bold text-cyan-300">Games Database</h3>
              <p className="text-3xl font-bold text-cyan-100">100+</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 text-white">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Brain className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="font-bold text-pink-300">Mood Dimensions</h3>
              <p className="text-3xl font-bold text-pink-100">5</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 text-white">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="font-bold text-emerald-300">AI Accuracy</h3>
              <p className="text-3xl font-bold text-emerald-100">95%</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-orange-400/30 text-white">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="font-bold text-yellow-300">Wellness Focus</h3>
              <p className="text-3xl font-bold text-yellow-100">100%</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Mood Assessment Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
            <CardHeader className="text-center pb-6 relative">
              <CardTitle className="flex items-center justify-center gap-4 text-3xl text-white">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                Gaming Mood Assessment
              </CardTitle>
              <p className="text-gray-300 text-lg mt-2">
                Choose your preferred method to discover your perfect gaming experience
              </p>
            </CardHeader>
            <CardContent className="relative">
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 backdrop-blur-xl border border-white/20">
                  <TabsTrigger 
                    value="sliders" 
                    className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-300 font-semibold py-3"
                  >
                    <Brain className="w-5 h-5" />
                    Interactive Sliders
                  </TabsTrigger>
                  <TabsTrigger 
                    value="text" 
                    className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-300 font-semibold py-3"
                  >
                    <Sparkles className="w-5 h-5" />
                    AI Text Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sliders" className="space-y-6">
                  <MoodSliders 
                    values={moodValues} 
                    onChange={setMoodValues} 
                  />
                </TabsContent>

                <TabsContent value="text">
                  <MoodTextAnalysis 
                    onAnalysisComplete={setTextAnalysis}
                  />
                </TabsContent>
              </Tabs>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center mt-10"
              >
                <Button
                  onClick={handleMoodSubmit}
                  disabled={!canSubmit() || isSubmitting}
                  className="px-12 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-[1.05] disabled:opacity-50 disabled:transform-none disabled:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-3"
                      />
                      Finding Your Perfect Games...
                    </>
                  ) : (
                    <>
                      <Gamepad2 className="w-6 h-6 mr-3" />
                      Get My Gaming Recommendations
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </>
                  )}
                </Button>
              </motion.div>

              {!canSubmit() && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400 text-sm mt-4"
                >
                  {currentTab === "sliders" 
                    ? "🎮 Complete all mood sliders to unlock your game recommendations" 
                    : "✨ Describe and analyze your mood to continue your gaming journey"
                  }
                </motion.p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Gaming Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Card className="bg-white/10 backdrop-blur-xl border border-green-400/30 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center gap-4 text-white">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                AI-Powered Game Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our advanced gaming AI analyzes your mood across 5 dimensions to recommend games that will 
                enhance your wellness and match your current gaming energy perfectly.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-500/20 text-green-300 border-green-400/30">Energy Matching</Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">Stress Assessment</Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">Focus Analysis</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border border-purple-400/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center gap-4 text-white">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg group-hover:shadow-pink-500/30 transition-all duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                Gaming Wellness Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Track your gaming habits, mood patterns, and wellness improvements over time with 
                detailed analytics designed specifically for conscious gamers.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">Mood Trends</Badge>
                <Badge className="bg-pink-500/20 text-pink-300 border-pink-400/30">Gaming Balance</Badge>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30">Wellness Insights</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}