
module.exports = {
    twitter: {
        clientID: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        callbackURL: "http://lit-beyond-8956.herokuapp.com/auth/twitter/callback"
    }
}
