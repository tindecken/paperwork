import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/schema'
import { eq } from 'drizzle-orm'

const queryClient = postgres(process.env.POSTGRES_CONNECTIONSTRING!)

const db = drizzle(queryClient, {schema})

const user = await db.query.users.findFirst({
    where: eq(schema.users.email, 'hoang@gmail.comm')
  })

  console.log('user', user)


await db.insert(schema.users).values({
  name: 'hoang',
  email: 'hoang@gmail.comm',
  username: 'hoang2',
  password: 'hoang',
})

await db.insert(schema.users).values({
  name: 'tindecken',
  email: 'tindecken@gmail.comm',
  username: 'tindecken',
  password: 'rivaldo',
})