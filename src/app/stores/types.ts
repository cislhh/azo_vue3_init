export interface User {
    id: number
    username: string
    email: string
    avatar?: string
    role: 'admin' | 'user' | 'guest'
    createdAt: string
}

export interface UserState {
    currentUser: User | null
    users: User[]
    loading: boolean
    error: string | null
}
