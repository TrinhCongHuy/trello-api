const boardRoute = require("./boardRoute")
const columnRoute = require("./columnRoute")
const cardRoute = require("./cardRoute")

module.exports = (app) => {
    const version = '/v1'
    app.use(version + '/boards', boardRoute)
    app.use(version + '/columns', columnRoute)
    app.use(version + '/cards', cardRoute)
}