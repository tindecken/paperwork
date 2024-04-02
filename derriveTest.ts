import Elysia from "elysia"

export const derriveTest = (app: Elysia) => app
    .derive(() => {
        const aaa = { name: 'test'}
        return {aaa}
    })
    .state('counter', 0)