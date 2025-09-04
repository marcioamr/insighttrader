// Mock storage que simula um backend para dados de usuários
interface MockUser {
  id: string
  name: string
  email: string
  avatar?: string
  provider?: 'google' | 'email'
  role?: 'admin' | 'user'
  status?: 'active' | 'blocked'
  plan?: 'freemium' | 'premium' | 'enterprise'
  createdAt?: string
}

const MOCK_USERS_KEY = 'mock-users-db'

// Dados iniciais dos usuários
const initialUsers: MockUser[] = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@insighttrader.com',
    provider: 'email',
    role: 'user',
    status: 'active',
    plan: 'freemium',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Marcio Rodrigues',
    email: 'marcioamr@gmail.com',
    provider: 'email',
    role: 'admin',
    status: 'active',
    plan: 'enterprise',
    createdAt: '2023-12-01T08:00:00Z'
  },
  {
    id: '3',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    provider: 'google',
    role: 'user',
    status: 'active',
    plan: 'premium',
    createdAt: '2024-02-20T14:15:00Z'
  },
  {
    id: '4',
    name: 'João Santos',
    email: 'joao.santos@email.com',
    provider: 'email',
    role: 'user',
    status: 'blocked',
    plan: 'freemium',
    createdAt: '2024-03-10T09:45:00Z'
  },
  {
    id: '5',
    name: 'Maria Costa',
    email: 'maria.costa@email.com',
    provider: 'google',
    role: 'user',
    status: 'active',
    plan: 'freemium',
    createdAt: '2024-03-25T16:20:00Z'
  }
]

export class MockUserStorage {
  // Inicializa o storage se não existir
  static init() {
    if (typeof window === 'undefined') return // SSR safety
    
    const existing = localStorage.getItem(MOCK_USERS_KEY)
    if (!existing) {
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(initialUsers))
    }
  }

  // Busca todos os usuários
  static getAllUsers(): MockUser[] {
    if (typeof window === 'undefined') return []
    
    const users = localStorage.getItem(MOCK_USERS_KEY)
    return users ? JSON.parse(users) : initialUsers
  }

  // Busca usuário por email
  static getUserByEmail(email: string): MockUser | null {
    const users = this.getAllUsers()
    return users.find(user => user.email === email) || null
  }

  // Busca usuário por ID
  static getUserById(id: string): MockUser | null {
    const users = this.getAllUsers()
    return users.find(user => user.id === id) || null
  }

  // Atualiza status do usuário
  static updateUserStatus(userId: string, status: 'active' | 'blocked'): boolean {
    if (typeof window === 'undefined') return false
    
    const users = this.getAllUsers()
    const userIndex = users.findIndex(user => user.id === userId)
    
    if (userIndex === -1) return false
    
    users[userIndex].status = status
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
    
    // Se for o usuário logado, atualiza o localStorage dele também
    const currentUserEmail = localStorage.getItem('user-email')
    if (currentUserEmail === users[userIndex].email) {
      localStorage.setItem('user-status', status)
    }
    
    return true
  }

  // Atualiza plano do usuário
  static updateUserPlan(userId: string, plan: 'freemium' | 'premium' | 'enterprise'): boolean {
    if (typeof window === 'undefined') return false
    
    const users = this.getAllUsers()
    const userIndex = users.findIndex(user => user.id === userId)
    
    if (userIndex === -1) return false
    
    users[userIndex].plan = plan
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
    
    return true
  }

  // Atualiza dados do usuário
  static updateUser(userId: string, updates: Partial<MockUser>): boolean {
    if (typeof window === 'undefined') return false
    
    const users = this.getAllUsers()
    const userIndex = users.findIndex(user => user.id === userId)
    
    if (userIndex === -1) return false
    
    users[userIndex] = { ...users[userIndex], ...updates }
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
    
    // Se for o usuário logado, atualiza o localStorage dele também
    const currentUserEmail = localStorage.getItem('user-email')
    if (currentUserEmail === users[userIndex].email) {
      if (updates.name) localStorage.setItem('user-name', updates.name)
      if (updates.avatar) localStorage.setItem('user-avatar', updates.avatar)
      if (updates.status) localStorage.setItem('user-status', updates.status)
    }
    
    return true
  }

  // Adiciona ou atualiza usuário (para login/registro)
  static upsertUser(userData: Partial<MockUser> & { email: string }): MockUser {
    if (typeof window === 'undefined') return userData as MockUser
    
    const users = this.getAllUsers()
    const existingIndex = users.findIndex(user => user.email === userData.email)
    
    if (existingIndex >= 0) {
      // Atualiza usuário existente
      users[existingIndex] = { ...users[existingIndex], ...userData }
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
      return users[existingIndex]
    } else {
      // Cria novo usuário
      const newUser: MockUser = {
        ...userData,
        id: Date.now().toString(),
        name: userData.name || 'Usuário',
        avatar: userData.avatar || '',
        provider: userData.provider || 'email',
        role: userData.email === 'marcioamr@gmail.com' ? 'admin' : 'user',
        status: 'active',
        plan: 'freemium',
        createdAt: userData.createdAt || new Date().toISOString()
      }
      
      users.push(newUser)
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
      return newUser
    }
  }
}