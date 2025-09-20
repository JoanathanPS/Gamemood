{
  "name": "GameSession",
  "type": "object",
  "properties": {
    "game_id": {
      "type": "string",
      "description": "Reference to the game played"
    },
    "pre_mood_entry_id": {
      "type": "string",
      "description": "Reference to mood entry before gaming"
    },
    "post_mood_entry_id": {
      "type": "string",
      "description": "Reference to mood entry after gaming (optional)"
    },
    "duration_minutes": {
      "type": "number",
      "minimum": 1,
      "description": "Session duration in minutes"
    },
    "satisfaction_rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "How satisfied the user was with this gaming session"
    },
    "mood_improvement_score": {
      "type": "number",
      "minimum": -10,
      "maximum": 10,
      "description": "Calculated mood improvement from pre to post session"
    },
    "session_context": {
      "type": "string",
      "enum": [
        "stress_relief",
        "energy_boost",
        "focus_training",
        "social_connection",
        "creative_outlet",
        "mindful_break",
        "entertainment",
        "challenge_seeking"
      ],
      "description": "Primary reason for the gaming session"
    },
    "break_reminders_used": {
      "type": "boolean",
      "description": "Whether user used break reminders during session"
    },
    "wellness_activities": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "breathing_exercise",
          "posture_check",
          "eye_rest",
          "hydration_reminder",
          "stretching",
          "mindful_moment"
        ]
      },
      "description": "Wellness activities performed during or around session"
    }
  },
  "required": [
    "game_id",
    "pre_mood_entry_id",
    "duration_minutes",
    "satisfaction_rating"
  ]
}