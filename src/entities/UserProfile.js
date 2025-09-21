{
  "name": "UserProfile",
  "type": "object",
  "properties": {
    "display_name": {
      "type": "string",
      "description": "User's preferred display name"
    },
    "preferred_platforms": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "PC",
          "PlayStation",
          "Xbox",
          "Nintendo Switch",
          "Mobile",
          "Web Browser"
        ]
      },
      "description": "User's preferred gaming platforms"
    },
    "favorite_genres": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "Action",
          "Adventure",
          "RPG",
          "Strategy",
          "Puzzle",
          "Simulation",
          "Sports",
          "Racing",
          "Fighting",
          "Shooter",
          "Platformer",
          "Indie",
          "Casual",
          "Educational",
          "Horror",
          "Survival"
        ]
      },
      "description": "User's favorite game genres"
    },
    "accessibility_needs": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "colorblind_support",
          "subtitle_required",
          "one_handed_controls",
          "motion_sensitivity",
          "screen_reader",
          "anxiety_accommodations",
          "adhd_accommodations",
          "autism_accommodations"
        ]
      },
      "description": "Accessibility requirements and accommodations"
    },
    "wellness_goals": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "stress_management",
          "mood_improvement",
          "balanced_gaming",
          "mindful_breaks",
          "social_connection",
          "focus_enhancement",
          "creativity_boost",
          "relaxation"
        ]
      },
      "description": "Personal wellness goals"
    },
    "privacy_settings": {
      "type": "object",
      "properties": {
        "share_mood_data": {
          "type": "boolean"
        },
        "participate_in_community": {
          "type": "boolean"
        },
        "anonymous_analytics": {
          "type": "boolean"
        },
        "wellness_reminders": {
          "type": "boolean"
        }
      },
      "description": "Privacy and sharing preferences"
    },
    "notification_preferences": {
      "type": "object",
      "properties": {
        "mood_check_reminders": {
          "type": "boolean"
        },
        "break_reminders": {
          "type": "boolean"
        },
        "wellness_tips": {
          "type": "boolean"
        },
        "new_recommendations": {
          "type": "boolean"
        }
      },
      "description": "Notification preferences"
    },
    "wellness_streak": {
      "type": "number",
      "minimum": 0,
      "description": "Current wellness check-in streak in days"
    },
    "total_wellness_score": {
      "type": "number",
      "minimum": 0,
      "description": "Cumulative wellness score based on habits and improvements"
    }
  },
  "required": [
    "display_name"
  ]
}