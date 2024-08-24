import { boardRoute } from "./boardRoute"
import { columnRoute } from "./columnRoute"
import { cardRoute } from "./cardRoute"
import { userRoute } from "./userRoute"
import { authRoute } from "./authRoute"
import { inviteRoute } from "./inviteRoute"


export const API_V1= (app) => {
    const version = '/v1'
    app.use(version + '/users', userRoute)
    app.use(version + '/auth', authRoute)
    app.use(version + '/boards', boardRoute)
    app.use(version + '/columns', columnRoute)
    app.use(version + '/cards', cardRoute)
    app.use(version + '/invites', inviteRoute)

}