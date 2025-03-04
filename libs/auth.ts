import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle/index"; // your drizzle instance
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
        enabled: true,
    }
});