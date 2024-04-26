import { sql, eq } from 'drizzle-orm'
import {users, files, usersFiles, categories, paperWorks, documents} from './schema/schema'
import db from "./db.ts";

// const paperWorkss = await db.query.paperWorks.findMany({
//     // where: eq(paperWorks.id, 1),
//     offset: 0,
//     limit: 100
// })

// console.log('paperWorks', paperWorkss)
// console.log('length', paperWorkss.length)

// const filePaperWorks = await db.query.files.findMany({
//     where: eq(files.id, 1),
//     with: {
//         categories: {
//             with: {
//                 paperWorks: {
//                     limit: 100,
//             }
//         }
//     }
// }})

// console.log('filePaperWorks', filePaperWorks)
// console.log('length', filePaperWorks.length)

const paperWork = await db.select().from(paperWorks).limit(1).execute()

// const paperWork = await db.select().from(paperWorks).leftJoin(categories, eq(categories.id, paperWorks.categoryId)).execute()
console.log('paperWork', paperWork)
console.log('length', paperWork.length)