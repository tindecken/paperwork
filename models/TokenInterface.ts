export interface TokenInterface {
    userId: number
    name: string
    userName: string
    email: string
    role?: string
    fileId?: number
    iat: number
    exp: number
    maxEpx: number
}