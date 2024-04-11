import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/schema'
import {users} from './schema/schema'
import { eq } from 'drizzle-orm'

const queryClient = postgres(process.env['POSTGRES_CONNECTIONSTRING']!)

const db = drizzle(queryClient, {schema})

const user = await db.query.users.findFirst({where: eq(users.id, 2), 
    with: {usersFiles: {
        columns: {
            role: true
        }
    }}})