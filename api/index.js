const authRoute = require('./authApi')

const mountRouts = (app) => {
    app.use("/api/v1/auth", authRoute);
}

module.exports = mountRouts;