import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle/index"; // your drizzle instance
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        modelName: "users",
        additionalFields: {
            systemRole: {
                type: "string",
                required: true,
                defaultValue: "user",
                input: false
            },
            userType: {
                type: "string",
                required: true,
                defaultValue: "free",
                input: false
            },
            avatar: {
                type: "string",
                required: false,
                input: false
            },
            isDeleted: {
                type: "number",
                required: true,
                defaultValue: 0,
                input: false
            }
        }
    },
    session: {
        modelName: "sessions",
    },
    account: {
        modelName: "accounts",
    },
    verification: {
        modelName: "verifications",
    }
});