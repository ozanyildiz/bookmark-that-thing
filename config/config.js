
module.exports = {
    twitter: {
        clientID: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    }
}