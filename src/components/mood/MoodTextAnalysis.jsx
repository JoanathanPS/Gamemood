import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InvokeLLM } from "@/integrations/Core";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles, Loader2, TrendingUp, AlertCircle, Gamepad2 } from "lucide-react";

export default function MoodTextAnalysis({ onAnalysisComplete }) {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const analyzeMoodText = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await InvokeLLM({
        prompt: `You are a gaming wellness AI analyzing a player's mood for game recommendations. 

Analyze this mood description: "${text}"

Please provide a detailed analysis that includes:
1. Sentiment score (-5 to +5, where -5 is very negative, 0 is neutral, +5 is very positive)
2. Key emotional keywords (3-5 words maximum)
3. Estimated mood dimensions (1-10 scale):
   - Energy level (how energetic they feel)
   - Stress level (how stressed/anxious they are)  
   - Focus level (ability to concentrate)
   - Social desire (want to interact with others vs alone time)
   - Challenge seeking (want easy relaxing games vs difficult challenges)
4. 2-3 specific gaming activities that would help their current state
5. A supportive message (1-2 sentences) acknowledging their feelings
6. Any wellness insights about their gaming needs right now

Be empathetic, supportive, and focus on how gaming can positively impact their wellness.`,
        response_json_schema: {
          type: "object",
          properties: {
            sentiment_score: { 
              type: "number", 
              minimum: -5, 
              maximum: 5,
              description: "Overall sentiment from -5 (very negative) to +5 (very positive)"
            },
            emotional_keywords: { 
              type: "array", 
              items: { type: "string" },
              maxItems: 5,
              description: "Key emotions detected in the text"
            },
            mood_dimensions: {
              type: "object",
              properties: {
                energy_level: { type: "number", minimum: 1, maximum: 10 },
                stress_level: { type: "number", minimum: 1, maximum: 10 },
                focus_level: { type: "number", minimum: 1, maximum: 10 },
                social_desire: { type: "number", minimum: 1, maximum: 10 },
                challenge_seeking: { type: "number", minimum: 1, maximum: 10 }
              },
              required: ["energy_level", "stress_level", "focus_level", "social_desire", "challenge_seeking"]
            },
            recommended_activities: { 
              type: "array", 
              items: { type: "string" },
              maxItems: 3,
              description: "Specific gaming recommendations for this mood"
            },
            supportive_message: { 
              type: "string",
              description: "Empathetic message acknowledging their feelings"
            },
            wellness_insights: { 
              type: "string",
              description: "Insights about their gaming wellness needs"
            }
          },
          required: ["sentiment_score", "emotional_keywords", "mood_dimensions", "recommended_activities", "supportive_message"]
        }
      });

      console.log("AI Analysis Result:", result);
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (error) {
      console.error("Error analyzing mood text:", error);
      setError("Unable to analyze your mood right now. Please try the mood sliders instead or try again in a moment.");
    }
    setIsAnalyzing(false);
  };

  const getSentimentColor = (score) => {
    if (score >= 2) return "bg-green-100 text-green-800 border-green-300";
    if (score >= 0) return "bg-blue-100 text-blue-800 border-blue-300";
    if (score >= -2) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getSentimentLabel = (score) => {
    if (score >= 3) return "Very Positive";
    if (score >= 1) return "Positive";
    if (score >= -1) return "Neutral";
    if (score >= -3) return "Negative";
    return "Very Negative";
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-0 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/10 to-purple-400/10 rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-3 relative">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-gray-800 text-xl font-bold">Tell Me How You're Feeling</span>
            <p className="text-sm text-gray-600 font-normal mt-1">
              Describe your mood in your own words - I'll understand and find perfect games for you
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 relative">
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I'm feeling exhausted after a long day at work, but I also have this restless energy. I want something that's engaging but won't stress me out more. Maybe something colorful and fun that I can just zone out to..."
            className="min-h-[120px] resize-none bg-white/90 border-2 border-indigo-200/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl text-base leading-relaxed placeholder:text-gray-500"
            disabled={isAnalyzing}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {text.length > 0 && `${text.length} characters`}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 text-sm font-medium">Analysis Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
        
        <Button 
          onClick={analyzeMoodText}
          disabled={!text.trim() || isAnalyzing}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Analyzing your mood...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-3" />
              Analyze My Gaming Mood
            </>
          )}
        </Button>

        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-5 pt-5 border-t border-indigo-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg">AI Mood Analysis Complete</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-lg p-4 border border-indigo-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Mood Sentiment
                  </p>
                  <Badge className={`${getSentimentColor(analysis.sentiment_score)} border-2 px-3 py-1 text-sm font-medium`}>
                    {getSentimentLabel(analysis.sentiment_score)} ({analysis.sentiment_score > 0 ? '+' : ''}{analysis.sentiment_score}/5)
                  </Badge>
                </div>
                
                <div className="bg-white/80 rounded-lg p-4 border border-indigo-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Key Emotions Detected
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.emotional_keywords?.slice(0, 4).map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {analysis.supportive_message && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500 flex-shrink-0">
                      <Gamepad2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-blue-900 font-medium text-sm mb-1">Your Gaming Wellness Companion says:</p>
                      <p className="text-blue-800 italic text-sm leading-relaxed">
                        "{analysis.supportive_message}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {analysis.recommended_activities && analysis.recommended_activities.length > 0 && (
                <div className="bg-white/80 rounded-lg p-4 border border-green-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Recommended Gaming Activities
                  </p>
                  <div className="space-y-2">
                    {analysis.recommended_activities.slice(0, 3).map((activity, index) => (
                      <div key={index} className="text-sm text-gray-700 flex items-start gap-3 bg-green-50 rounded-lg p-3">
                        <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.wellness_insights && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                  <p className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Wellness Insights
                  </p>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    {analysis.wellness_insights}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}