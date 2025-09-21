{
  "name": "MoodEntry",
  "type": "object",
  "properties": {
    "energy_level": {
      "type": "number",
      "minimum": 1,
      "maximum": 10,
      "description": "Energy level from 1-10"
    },
    "stress_level": {
      "type": "number",
      "minimum": 1,
      "maximum": 10,
      "description": "Stress level from 1-10"
    },
    "focus_level": {
      "type": "number",
      "minimum": 1,
      "maximum": 10,
      "description": "Focus level from 1-10"
    },
    "social_desire": {
      "type": "number",
      "minimum": 1,
      "maximum": 10,
      "description": "Desire for social interaction from 1-10"
    },
    "challenge_seeking": {
      "type": "number",
      "minimum": 1,
      "maximum": 10,
      "description": "Desire for challenge from 1-10"
    },
    "mood_text": {
      "type": "string",
      "description": "Optional text description of current mood"
    },
    "mood_analysis": {
      "type": "object",
      "description": "AI-generated analysis of mood text",
      "properties": {
        "sentiment_score": {
          "type": "number"
        },
        "emotional_keywords": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "recommended_activities": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "context": {
      "type": "string",
      "enum": [
        "morning",
        "afternoon",
        "evening",
        "late_night"
      ],
      "description": "Time of day context"
    },
    "weather_mood_factor": {
      "type": "string",
      "enum": [
        "sunny",
        "cloudy",
        "rainy",
        "stormy",
        "neutral"
      ],
      "description": "Weather influence on mood"
    }
  },
  "required": [
    "energy_level",
    "stress_level",
    "focus_level",
    "social_desire",
    "challenge_seeking"
  ]
}