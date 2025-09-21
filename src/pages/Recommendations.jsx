
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Filter, Gamepad2, Clock, Target, Users, ArrowLeft, Heart } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MoodEntry, Game, GameSession } from "@/entities/all";

import GameCard from "@/components/games/GameCard";

const calculateRecommendations = (mood, allGames) => {
  return allGames.map(game => {
    let matchScore = 50; // Base score

    // Energy level matching
    if (game.ideal_energy_range) {
      const energyMatch = mood.energy_level >= game.ideal_energy_range.min && 
                         mood.energy_level <= game.ideal_energy_range.max;
      matchScore += energyMatch ? 15 : -10;
    }

    // Stress compatibility
    if (game.stress_compatibility) {
      if (mood.stress_level <= 3 && game.stress_compatibility === "low_stress_only") matchScore += 15;
      if (mood.stress_level <= 6 && game.stress_compatibility === "medium_stress_ok") matchScore += 10;
      if (mood.stress_level > 6 && game.stress_compatibility === "high_stress_friendly") matchScore += 15;
      if (game.stress_compatibility === "any_stress") matchScore += 5;
    }

    // Mood tag matching
    if (game.mood_tags) {
      if (mood.energy_level >= 7 && game.mood_tags.includes("energizing")) matchScore += 10;
      if (mood.stress_level >= 7 && game.mood_tags.includes("stress-relief")) matchScore += 15;
      if (mood.focus_level >= 7 && game.mood_tags.includes("focus-building")) matchScore += 10;
      if (mood.social_desire >= 7 && game.mood_tags.includes("social")) matchScore += 12;
      if (mood.social_desire <= 4 && game.mood_tags.includes("solo")) matchScore += 12;
      if (mood.challenge_seeking >= 7 && game.mood_tags.includes("challenging")) matchScore += 10;
      if (mood.energy_level <= 4 && game.mood_tags.includes("relaxing")) matchScore += 15;
      if (game.mood_tags.includes("calming") && mood.stress_level >= 6) matchScore += 12;
    }

    // Focus level considerations
    if (mood.focus_level <= 4 && game.session_length === "quick_5min") matchScore += 10;
    if (mood.focus_level >= 7 && game.session_length === "extended_2plus_hours") matchScore += 8;

    // Wellness rating boost
    if (game.wellness_rating) {
      matchScore += game.wellness_rating * 2;
    }

    // Cap the score
    matchScore = Math.min(Math.max(matchScore, 10), 98);

    return {
      ...game,
      matchScore: Math.round(matchScore)
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [moodEntry, setMoodEntry] = useState(null);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sessionLengthFilter, setSessionLengthFilter] = useState("all");

  const getSessionContext = useCallback(() => {
    if (!moodEntry) return "entertainment";
    
    if (moodEntry.stress_level >= 7) return "stress_relief";
    if (moodEntry.energy_level <= 4) return "energy_boost";
    if (moodEntry.focus_level >= 7) return "focus_training";
    if (moodEntry.social_desire >= 7) return "social_connection";
    return "entertainment";
  }, [moodEntry]);

  const applyFilters = useCallback(() => {
    let filtered = [...games];

    // Category filter
    if (activeFilter !== "all") {
      switch (activeFilter) {
        case "high-match":
          filtered = filtered.filter(game => game.matchScore >= 80);
          break;
        case "stress-relief":
          filtered = filtered.filter(game => 
            game.mood_tags?.includes("stress-relief") || 
            game.mood_tags?.includes("calming") ||
            game.mood_tags?.includes("relaxing")
          );
          break;
        case "energy-boost":
          filtered = filtered.filter(game => 
            game.mood_tags?.includes("energizing") ||
            game.mood_tags?.includes("uplifting")
          );
          break;
        case "focus":
          filtered = filtered.filter(game => 
            game.mood_tags?.includes("focus-building") ||
            game.mood_tags?.includes("mindful")
          );
          break;
        case "social":
          filtered = filtered.filter(game => 
            game.mood_tags?.includes("social") ||
            game.platforms?.some(p => ["PlayStation", "Xbox", "PC"].includes(p))
          );
          break;
      }
    }

    // Platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter(game => 
        game.platforms?.includes(platformFilter)
      );
    }

    // Session length filter
    if (sessionLengthFilter !== "all") {
      filtered = filtered.filter(game => 
        game.session_length === sessionLengthFilter
      );
    }

    setFilteredGames(filtered);
  }, [games, activeFilter, platformFilter, sessionLengthFilter, setFilteredGames]);

  const loadMoodEntryAndRecommendations = useCallback(async (moodEntryId) => {
    setIsLoading(true);
    try {
      // Load mood entry
      const entry = await MoodEntry.get(moodEntryId);
      setMoodEntry(entry);

      // Load games and calculate recommendations
      const allGames = await Game.list();
      const recommendedGames = calculateRecommendations(entry, allGames);
      setGames(recommendedGames);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    }
    setIsLoading(false);
  }, [setIsLoading, setMoodEntry, setGames]);

  useEffect(() => {
    const moodEntryId = searchParams.get("mood_entry_id");
    if (moodEntryId) {
      loadMoodEntryAndRecommendations(moodEntryId);
    } else {
      // If no mood entry, redirect to home
      navigate(createPageUrl("Home"));
    }
  }, [searchParams, navigate, loadMoodEntryAndRecommendations]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleStartSession = useCallback(async (game) => {
    try {
      const session = await GameSession.create({
        game_id: game.id,
        pre_mood_entry_id: moodEntry.id,
        duration_minutes: 0,
        satisfaction_rating: 5,
        session_context: getSessionContext(),
      });

      // In a real app, this would integrate with the game platform
      alert(`Starting ${game.title}! Have fun and remember to take breaks. We'll check in with you later to see how you're feeling.`);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  }, [moodEntry, getSessionContext]);

  const getMoodSummary = () => { // No need for useCallback here as it's used inline and not a dependency.
    if (!moodEntry) return "Loading...";
    
    const { energy_level, stress_level, focus_level, social_desire, challenge_seeking } = moodEntry;
    
    let summary = "Based on your mood, you seem to be feeling ";
    
    if (energy_level >= 7) summary += "energetic ";
    else if (energy_level <= 4) summary += "low-energy ";
    else summary += "moderately energetic ";

    if (stress_level >= 7) summary += "and stressed. ";
    else if (stress_level <= 3) summary += "and calm. ";
    else summary += "with some stress. ";

    if (focus_level >= 7) summary += "You're highly focused ";
    else if (focus_level <= 4) summary += "You're having trouble focusing ";
    else summary += "You have decent focus ";

    if (social_desire >= 7) summary += "and want social interaction.";
    else if (social_desire <= 4) summary += "and prefer solo activities.";
    else summary += "and are neutral about social interaction.";

    return summary;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-gray-700">Finding your perfect games...</p>
          <p className="text-gray-500">Analyzing your mood and preferences</p>
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
          className="flex items-center justify-between mb-8"
        >
          <div>
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("Home"))}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Personalized Game Recommendations
            </h1>
            <p className="text-gray-600 mt-2">
              {getMoodSummary()}
            </p>
          </div>
        </motion.div>

        {/* Mood Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          {moodEntry && [
            { label: "Energy", value: moodEntry.energy_level, color: "from-orange-400 to-red-500", icon: "⚡" },
            { label: "Stress", value: moodEntry.stress_level, color: "from-red-400 to-pink-500", icon: "💫" },
            { label: "Focus", value: moodEntry.focus_level, color: "from-purple-400 to-indigo-500", icon: "🎯" },
            { label: "Social", value: moodEntry.social_desire, color: "from-blue-400 to-cyan-500", icon: "👥" },
            { label: "Challenge", value: moodEntry.challenge_seeking, color: "from-green-400 to-emerald-500", icon: "🏆" },
          ].map((mood, index) => (
            <Card key={mood.label} className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">{mood.icon}</div>
                <p className="font-semibold text-gray-800">{mood.label}</p>
                <p className="text-xl font-bold text-blue-600">{mood.value}/10</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filter Recommendations</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="high-match">Top Matches</TabsTrigger>
                  <TabsTrigger value="stress-relief">Stress Relief</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Platform</label>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="PC">PC</SelectItem>
                  <SelectItem value="PlayStation">PlayStation</SelectItem>
                  <SelectItem value="Xbox">Xbox</SelectItem>
                  <SelectItem value="Nintendo Switch">Nintendo Switch</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Session Length</label>
              <Select value={sessionLengthFilter} onValueChange={setSessionLengthFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Length</SelectItem>
                  <SelectItem value="quick_5min">Quick (5 min)</SelectItem>
                  <SelectItem value="short_15min">Short (15 min)</SelectItem>
                  <SelectItem value="medium_30min">Medium (30 min)</SelectItem>
                  <SelectItem value="long_1hour">Long (1 hour)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">
              {filteredGames.length} Games Found
            </span>
            {filteredGames.length > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Avg Match: {Math.round(filteredGames.reduce((sum, game) => sum + game.matchScore, 0) / filteredGames.length)}%
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Game Recommendations Grid */}
        <AnimatePresence>
          {filteredGames.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + (index * 0.1) }}
                >
                  <GameCard
                    game={game}
                    matchScore={game.matchScore}
                    onStartSession={handleStartSession}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Games Found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or take a new mood assessment</p>
              <Button
                variant="outline"
                onClick={() => navigate(createPageUrl("Home"))}
              >
                New Mood Assessment
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
