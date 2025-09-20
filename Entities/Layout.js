import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Brain, BarChart3, Gamepad2, User, Settings, Heart } from "lucide-react";
import { MoodEntry, GameSession, UserProfile, User as UserEntity } from "@/entities/all";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Mood Assessment",
    url: createPageUrl("Home"),
    icon: Brain,
  },
  {
    title: "Game Recommendations",
    url: createPageUrl("Recommendations"),
    icon: Gamepad2,
  },
  {
    title: "Wellness Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: User,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [wellnessStats, setWellnessStats] = useState({
    wellnessStreak: 0,
    gamesPlayed: 0,
    moodScore: 0,
    isLoading: true
  });
  const [userProfile, setUserProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const calculateWellnessStreak = useCallback((moodEntries) => {
    if (!moodEntries.length) return 0;
    
    // Sort entries by date (most recent first)
    const sortedEntries = moodEntries.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    
    // Group by date (YYYY-MM-DD)
    const entriesByDate = {};
    sortedEntries.forEach(entry => {
      const dateKey = new Date(entry.created_date).toISOString().split('T')[0];
      if (!entriesByDate[dateKey]) {
        entriesByDate[dateKey] = true;
      }
    });
    
    // Calculate consecutive days from today backwards
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const dateKey = currentDate.toISOString().split('T')[0];
      if (entriesByDate[dateKey]) {
        streak++;
      } else if (streak > 0) {
        break; // Streak is broken
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }, []);

  const calculateAverageMoodScore = useCallback((moodEntries) => {
    if (!moodEntries.length) return 0;
    
    const totalScore = moodEntries.reduce((sum, entry) => {
      // Calculate overall mood score (energy + (10-stress) + focus + social + challenge) / 5
      const moodScore = (
        entry.energy_level + 
        (10 - entry.stress_level) + 
        entry.focus_level + 
        entry.social_desire + 
        entry.challenge_seeking
      ) / 5;
      return sum + moodScore;
    }, 0);
    
    return (totalScore / moodEntries.length).toFixed(1);
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const user = await UserEntity.me();
      setCurrentUser(user);
      
      const profiles = await UserProfile.list("", 1);
      if (profiles.length > 0) {
        setUserProfile(profiles[0]);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  const loadWellnessData = useCallback(async () => {
    try {
      // Get recent mood entries (last 30 days)
      const recentMoodEntries = await MoodEntry.list("-created_date", 30);
      
      // Get recent gaming sessions
      const recentGameSessions = await GameSession.list("-created_date", 50);
      
      // Get user profile for streak data
      const profiles = await UserProfile.list("", 1);
      const profile = profiles.length > 0 ? profiles[0] : null;
      
      // Calculate wellness streak (consecutive days with mood entries)
      const wellnessStreak = calculateWellnessStreak(recentMoodEntries);
      
      // Count unique games played
      const uniqueGames = new Set(recentGameSessions.map(session => session.game_id));
      const gamesPlayed = uniqueGames.size;
      
      // Calculate average mood score from recent entries
      const avgMoodScore = calculateAverageMoodScore(recentMoodEntries);

      setWellnessStats({
        wellnessStreak: profile?.wellness_streak || wellnessStreak,
        gamesPlayed,
        moodScore: avgMoodScore,
        isLoading: false
      });
    } catch (error) {
      console.error("Error loading wellness data:", error);
      setWellnessStats(prev => ({ ...prev, isLoading: false }));
    }
  }, [calculateWellnessStreak, calculateAverageMoodScore]);

  useEffect(() => {
    loadWellnessData();
    loadUserData();
  }, [loadWellnessData, loadUserData]);

  const getDisplayName = () => {
    if (userProfile?.display_name) return userProfile.display_name;
    if (currentUser?.full_name) return currentUser.full_name;
    return "Gaming Wellness Explorer";
  };

  const getUserLevel = () => {
    const totalScore = userProfile?.total_wellness_score || wellnessStats.wellnessStreak * 50;
    if (totalScore >= 2000) return "5";
    if (totalScore >= 1500) return "4";
    if (totalScore >= 1000) return "3";
    if (totalScore >= 500) return "2";
    return "1";
  };

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary-50: #f0f9ff;
            --primary-100: #e0f2fe;
            --primary-500: #0ea5e9;
            --primary-600: #0284c7;
            --primary-700: #0369a1;
            --wellness-50: #f0fdf4;
            --wellness-100: #dcfce7;
            --wellness-500: #22c55e;
            --wellness-600: #16a34a;
            --mood-calm: #e0f2fe;
            --mood-energetic: #fed7aa;
            --mood-focused: #f3e8ff;
            --mood-social: #fce7f3;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Sidebar className="border-r border-blue-200 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-blue-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GameMood AI</h2>
                <p className="text-sm text-gray-600">Your Wellness Gaming Guide</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg mb-2 ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm' 
                            : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2">
                Wellness Insights
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-4 space-y-3">
                  {wellnessStats.isLoading ? (
                    <div className="text-center text-gray-500 text-sm">Loading...</div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 text-sm">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="text-gray-600">Wellness Streak</span>
                        <span className="ml-auto font-bold text-pink-600">
                          {wellnessStats.wellnessStreak} {wellnessStats.wellnessStreak === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Gamepad2 className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600">Games Played</span>
                        <span className="ml-auto font-bold text-blue-600">{wellnessStats.gamesPlayed}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <BarChart3 className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">Mood Score</span>
                        <span className="ml-auto font-bold text-green-600">{wellnessStats.moodScore}/10</span>
                      </div>
                    </>
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-blue-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {getDisplayName().charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{getDisplayName()}</p>
                <p className="text-xs text-gray-500 truncate">
                  Level {getUserLevel()} • {userProfile?.total_wellness_score || (wellnessStats.wellnessStreak * 50)} points
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/90 backdrop-blur-sm border-b border-blue-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-blue-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GameMood AI
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}