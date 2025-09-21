// Mock User entity for development
class User {
  static async me() {
    // Mock user data
    return {
      id: '1',
      email: 'user@example.com',
      name: 'Gamer User',
      created_at: new Date().toISOString(),
      preferences: {
        theme: 'light',
        notifications: true
      }
    }
  }

  static async create(data) {
    // Mock user creation
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      created_at: new Date().toISOString()
    }
  }

  static async update(id, data) {
    // Mock user update
    return {
      id,
      ...data,
      updated_at: new Date().toISOString()
    }
  }
}

export default User
