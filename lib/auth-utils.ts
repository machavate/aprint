// Authentication utilities for user management
export interface User {
  id: string
  email: string
  name: string
  role: "client" | "operator" | "admin"
  createdAt: Date
}

// Mock user database
const users: User[] = [
  {
    id: "1",
    email: "cliente@example.com",
    name: "Cliente Padrão",
    role: "client",
    createdAt: new Date(),
  },
  {
    id: "2",
    email: "operator@example.com",
    name: "Operador Padrão",
    role: "operator",
    createdAt: new Date(),
  },
]

export async function getUserByEmail(email: string): Promise<User | null> {
  // TODO: Fetch from database
  return users.find((u) => u.email === email) || null
}

export async function createUser(email: string, name: string, role: string): Promise<User> {
  // TODO: Store in database
  const newUser: User = {
    id: String(Date.now()),
    email,
    name,
    role: role as any,
    createdAt: new Date(),
  }
  users.push(newUser)
  return newUser
}

export function validatePassword(password: string): boolean {
  return password.length >= 6
}
