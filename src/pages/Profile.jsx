import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { User, Settings, Bell, Shield, Gamepad2, Heart, Save, CheckCircle } from "lucide-react";
import { UserProfile, User as UserEntity } from "@/entities/all";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    display_name: "",
    preferred_platforms: [],
    favorite_genres: [],
    accessibility_needs: [],
    wellness_goals: [],
    privacy_settings: {
      share_mood_data: false,
      participate_in_community: true,
      anonymous_analytics: true,
      wellness_reminders: true
    },
    notification_preferences: {
      mood_check_reminders: true,
      break_reminders: true,
      wellness_tips: true,
      new_recommendations: true
    },
    wellness_streak: 7,
    total_wellness_score: 1247
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const currentUser = await UserEntity.me();
      setUser(currentUser);

      const profiles = await UserProfile.list("", 1);
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const existingProfiles = await UserProfile.list("", 1);
      
      if (existingProfiles.length > 0) {
        await UserProfile.update(existingProfiles[0].id, profile);
      } else {
        await UserProfile.create(profile);
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setSaving(false);
  };

  const handleArrayToggle = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSettingToggle = (category, setting) => {
    setProfile(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const platformOptions = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile", "Web Browser"];
  const genreOptions = ["Action", "Adventure", "RPG", "Strategy", "Puzzle", "Simulation", "Sports", "Racing", "Fighting", "Shooter", "Platformer", "Indie", "Casual"];
  const accessibilityOptions = ["colorblind_support", "subtitle_required", "one_handed_controls", "motion_sensitivity", "screen_reader", "anxiety_accommodations", "adhd_accommodations", "autism_accommodations"];
  const wellnessGoalOptions = ["stress_management", "mood_improvement", "balanced_gaming", "mindful_breaks", "social_connection", "focus_enhancement", "creativity_boost", "relaxation"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600">
            Customize your GameMood AI experience and wellness preferences
          </p>
        </motion.div>

        {/* Profile Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {profile.display_name || user?.full_name || "Gaming Wellness Explorer"}
                  </h2>
                  <p className="text-blue-100 mb-3">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>Wellness Streak: {profile.wellness_streak} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4" />
                      <span>Level 3 • {profile.total_wellness_score} points</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Wellness Explorer
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <Tabs defaultValue="preferences" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                <TabsContent value="preferences" className="space-y-6">
                  <div>
                    <Label htmlFor="display-name" className="text-base font-semibold">Display Name</Label>
                    <Input
                      id="display-name"
                      value={profile.display_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="Enter your preferred display name"
                      className="mt-2"
                    />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-base font-semibold mb-3">Preferred Gaming Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {platformOptions.map(platform => (
                        <Badge
                          key={platform}
                          variant={profile.preferred_platforms.includes(platform) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-blue-100"
                          onClick={() => handleArrayToggle("preferred_platforms", platform)}
                        >
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold mb-3">Favorite Game Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {genreOptions.map(genre => (
                        <Badge
                          key={genre}
                          variant={profile.favorite_genres.includes(genre) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-blue-100"
                          onClick={() => handleArrayToggle("favorite_genres", genre)}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold mb-3">Wellness Goals</h3>
                    <div className="flex flex-wrap gap-2">
                      {wellnessGoalOptions.map(goal => (
                        <Badge
                          key={goal}
                          variant={profile.wellness_goals.includes(goal) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-green-100"
                          onClick={() => handleArrayToggle("wellness_goals", goal)}
                        >
                          {goal.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="accessibility" className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold mb-3">Accessibility Needs</h3>
                    <p className="text-gray-600 mb-4">
                      Help us recommend games that are accessible and comfortable for you
                    </p>
                    <div className="space-y-3">
                      {accessibilityOptions.map(need => (
                        <div key={need} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <Label htmlFor={need} className="cursor-pointer">
                            {need.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Label>
                          <Switch
                            id={need}
                            checked={profile.accessibility_needs.includes(need)}
                            onCheckedChange={() => handleArrayToggle("accessibility_needs", need)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Privacy Settings
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Control how your data is used to improve your experience
                    </p>
                    <div className="space-y-4">
                      {Object.entries(profile.privacy_settings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <Label className="font-medium">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Label>
                            <p className="text-sm text-gray-600 mt-1">
                              {key === "share_mood_data" && "Allow anonymous mood data to help improve recommendations"}
                              {key === "participate_in_community" && "Join community features and wellness challenges"}
                              {key === "anonymous_analytics" && "Help improve the app with anonymous usage data"}
                              {key === "wellness_reminders" && "Receive wellness tips and reminders"}
                            </p>
                          </div>
                          <Switch
                            checked={value}
                            onCheckedChange={() => handleSettingToggle("privacy_settings", key)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Choose what notifications you'd like to receive
                    </p>
                    <div className="space-y-4">
                      {Object.entries(profile.notification_preferences).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <Label className="font-medium">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Label>
                            <p className="text-sm text-gray-600 mt-1">
                              {key === "mood_check_reminders" && "Daily reminders to log your mood"}
                              {key === "break_reminders" && "Suggestions to take breaks during long gaming sessions"}
                              {key === "wellness_tips" && "Weekly wellness tips and insights"}
                              {key === "new_recommendations" && "Notifications about new game recommendations"}
                            </p>
                          </div>
                          <Switch
                            checked={value}
                            onCheckedChange={() => handleSettingToggle("notification_preferences", key)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Saving...
                      </>
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}