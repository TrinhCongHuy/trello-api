const boardRoute = require("./boardRoute")

module.exports = (app) => {
    const version = '/v1'
    app.use(version + '/boards', boardRoute)
}