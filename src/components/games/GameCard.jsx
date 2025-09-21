import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, Clock, Users, Gamepad2, Heart, Zap } from "lucide-react";

export default function GameCard({ game, onStartSession, matchScore = 85 }) {
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "PC": return "🖥️";
      case "PlayStation": return "🎮";
      case "Xbox": return "🎮";
      case "Nintendo Switch": return "🎮";
      case "Mobile": return "📱";
      case "Web Browser": return "🌐";
      default: return "🎮";
    }
  };

  const getMoodTagColor = (tag) => {
    const colors = {
      calming: "bg-blue-100 text-blue-800",
      energizing: "bg-orange-100 text-orange-800",
      challenging: "bg-red-100 text-red-800",
      social: "bg-purple-100 text-purple-800",
      solo: "bg-green-100 text-green-800",
      creative: "bg-yellow-100 text-yellow-800",
      competitive: "bg-indigo-100 text-indigo-800",
      relaxing: "bg-emerald-100 text-emerald-800",
      "focus-building": "bg-violet-100 text-violet-800",
      "stress-relief": "bg-rose-100 text-rose-800",
      mindful: "bg-cyan-100 text-cyan-800",
      escapist: "bg-pink-100 text-pink-800",
      therapeutic: "bg-teal-100 text-teal-800",
      uplifting: "bg-lime-100 text-lime-800",
      meditative: "bg-slate-100 text-slate-800"
    };
    return colors[tag] || "bg-gray-100 text-gray-800";
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 75) return "text-blue-600 bg-blue-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card className="h-full bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300">
        <CardHeader className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {game.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={`px-3 py-1 rounded-full font-medium ${getMatchScoreColor(matchScore)}`}>
                  <Heart className="w-3 h-3 mr-1" />
                  {matchScore}% Match
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {game.wellness_rating}/5
                </Badge>
              </div>
            </div>
            {game.image_url && (
              <img 
                src={game.image_url} 
                alt={game.title}
                className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
              />
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {game.description}
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Session: {game.session_length?.replace(/_/g, ' ')}</span>
              <Users className="w-4 h-4 ml-2" />
              <span>{game.mood_tags?.includes('social') ? 'Multiplayer' : 'Single Player'}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {game.platforms?.slice(0, 3).map((platform, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {getPlatformIcon(platform)} {platform}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {game.mood_tags?.slice(0, 4).map((tag, index) => (
                <Badge key={index} className={`text-xs ${getMoodTagColor(tag)}`}>
                  {tag.replace(/-/g, ' ')}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {game.genres?.slice(0, 3).map((genre, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 pt-0">
          <div className="flex gap-2">
            <Button 
              onClick={() => onStartSession(game)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Playing
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-blue-50">
              <Gamepad2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}