import { Elysia } from 'elysia'

const a = () => 'hello'
class Logger {
    log(message: string){
        console.log('message', message)
    }
}
const app = new Elysia()
    .decorate('logger', new Logger())
    .state('thisisstateStoretoStore', 'haha aa') //==> using in store
    .get('/', () => {
        return {"a": "a"}
    })
    .onError(({code}) => {
        if (code === 'NOT_FOUND')
            return 'Route not found :('
    })
    .get('/a', a)
    .get('/error', ({error, path, set}) => {
        set.headers['x-powered-by'] = 'Elysia'
        set.headers['a']='b'
        error('Not Implemented', `Not implement: ${path}`)
    })
    .get('/headers', ({headers}) => headers)
    .get('/store', ({store}) => store.thisisstateStoretoStore)
    .get('/decorate',({logger}) => {
        logger.log('hello decorate')
        return 'hello decorate'
    })

app.listen(3000)

