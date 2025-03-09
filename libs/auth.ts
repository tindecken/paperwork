import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle/index"; // your drizzle instance
import { ulid } from "ulid";
import { sql } from 'drizzle-orm';
import { accountsTable, sessionsTable, usersTable, verificationsTable } from "../drizzle/schema";
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite", // or "mysql", "sqlite",
    }),
    advanced: {
        generateId() {
            return ulid()
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    user: {
        modelName: "usersTable",
        fields: {
            emailVerified: "isEmailVerified",
        },
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
            },
        }
    },
    session: {
        modelName: "sessionsTable",
    },
    account: {
        modelName: "accountsTable",
    },
    verification: {
        modelName: "verificationsTable",
    }
});