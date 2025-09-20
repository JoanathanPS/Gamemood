import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Zap, Heart, Brain, Users, Target } from "lucide-react";

const moodDimensions = [
  {
    key: "energy_level",
    label: "Energy Level",
    icon: Zap,
    lowLabel: "Low Energy",
    highLabel: "High Energy",
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50",
    description: "How energetic do you feel right now?"
  },
  {
    key: "stress_level", 
    label: "Stress Level",
    icon: Heart,
    lowLabel: "Calm",
    highLabel: "Stressed",
    color: "from-red-400 to-pink-500",
    bgColor: "bg-red-50",
    description: "What's your current stress level?"
  },
  {
    key: "focus_level",
    label: "Focus Ability",
    icon: Brain,
    lowLabel: "Scattered",
    highLabel: "Focused",
    color: "from-purple-400 to-indigo-500",
    bgColor: "bg-purple-50",
    description: "How well can you concentrate right now?"
  },
  {
    key: "social_desire",
    label: "Social Mood",
    icon: Users,
    lowLabel: "Solo Time",
    highLabel: "Social",
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50",
    description: "Do you want to be social or have alone time?"
  },
  {
    key: "challenge_seeking",
    label: "Challenge Appetite",
    icon: Target,
    lowLabel: "Easy Going",
    highLabel: "Challenge Me",
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    description: "How much of a challenge do you want?"
  }
];

export default function MoodSliders({ values = {}, onChange }) {
  const [localValues, setLocalValues] = useState({
    energy_level: 5,
    stress_level: 5,
    focus_level: 5,
    social_desire: 5,
    challenge_seeking: 5,
    ...values
  });

  const handleSliderChange = (key, newValue) => {
    const updatedValues = { ...localValues, [key]: newValue[0] };
    setLocalValues(updatedValues);
    onChange?.(updatedValues);
  };

  const getMoodIntensity = (value) => {
    if (value <= 2) return { label: "Very Low", intensity: "low" };
    if (value <= 4) return { label: "Low", intensity: "low-medium" };
    if (value <= 6) return { label: "Medium", intensity: "medium" };
    if (value <= 8) return { label: "High", intensity: "medium-high" };
    return { label: "Very High", intensity: "high" };
  };

  return (
    <div className="space-y-6">
      {moodDimensions.map((dimension, index) => {
        const IconComponent = dimension.icon;
        const currentValue = localValues[dimension.key];
        const intensity = getMoodIntensity(currentValue);
        
        return (
          <motion.div
            key={dimension.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${dimension.bgColor} border-0 shadow-md hover:shadow-lg transition-shadow duration-300`}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${dimension.color}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-800">{dimension.label}</span>
                      <p className="text-sm text-gray-600 font-normal mt-1">
                        {dimension.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {intensity.label}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{dimension.lowLabel}</span>
                    <span className="font-semibold text-lg">{currentValue}/10</span>
                    <span>{dimension.highLabel}</span>
                  </div>
                  <Slider
                    value={[currentValue]}
                    onValueChange={(value) => handleSliderChange(dimension.key, value)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    {Array.from({ length: 10 }, (_, i) => (
                      <span key={i + 1} className={currentValue === i + 1 ? 'font-bold text-gray-700' : ''}>
                        {i + 1}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}