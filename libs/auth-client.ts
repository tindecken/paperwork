import { createAuthClient } from  "better-auth/client"
export const authClient =  createAuthClient({
    baseURL: "http://localhost:3001" // the base url of your auth server 
})