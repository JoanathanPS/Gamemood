{
  "name": "Game",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Game title"
    },
    "description": {
      "type": "string",
      "description": "Game description"
    },
    "genres": {
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
      "description": "Game genres"
    },
    "platforms": {
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
      "description": "Available platforms"
    },
    "mood_tags": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "calming",
          "energizing",
          "challenging",
          "social",
          "solo",
          "creative",
          "competitive",
          "relaxing",
          "focus-building",
          "stress-relief",
          "mindful",
          "escapist",
          "therapeutic",
          "uplifting",
          "meditative"
        ]
      },
      "description": "Mood-based tags for matching"
    },
    "ideal_energy_range": {
      "type": "object",
      "properties": {
        "min": {
          "type": "number",
          "minimum": 1,
          "maximum": 10
        },
        "max": {
          "type": "number",
          "minimum": 1,
          "maximum": 10
        }
      },
      "description": "Ideal energy level range for this game"
    },
    "stress_compatibility": {
      "type": "string",
      "enum": [
        "low_stress_only",
        "medium_stress_ok",
        "high_stress_friendly",
        "any_stress"
      ],
      "description": "How well the game works with different stress levels"
    },
    "session_length": {
      "type": "string",
      "enum": [
        "quick_5min",
        "short_15min",
        "medium_30min",
        "long_1hour",
        "extended_2plus_hours"
      ],
      "description": "Typical play session length"
    },
    "accessibility_features": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "colorblind_friendly",
          "subtitle_support",
          "one_handed_play",
          "low_motion",
          "screen_reader_compatible",
          "adjustable_difficulty",
          "pause_friendly",
          "adhd_friendly",
          "anxiety_friendly"
        ]
      },
      "description": "Accessibility and neurodivergent-friendly features"
    },
    "wellness_rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "Community wellness effectiveness rating"
    },
    "image_url": {
      "type": "string",
      "description": "Game cover image URL"
    },
    "price_range": {
      "type": "string",
      "enum": [
        "free",
        "under_10",
        "10_to_30",
        "30_to_60",
        "over_60"
      ],
      "description": "Price range category"
    }
  },
  "required": [
    "title",
    "description",
    "genres",
    "platforms",
    "mood_tags"
  ]
}