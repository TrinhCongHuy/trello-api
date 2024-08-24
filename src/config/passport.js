import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';
import { authController } from '~/controllers/authController';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/v1/auth/google/callback"
},
async function(accessToken, refreshToken, profile, cb) {
  const dataRaw = {
    firstName: profile.name.familyName,
    lastName: profile.name.givenName,
    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "",
    avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : profile.id,
    typeAcc: "google"
  };

  try {
    let user = await authController.createUser(dataRaw);

    console.log("user", user);
    return cb(null, user);
  } catch (error) {
    return cb(error, null);
  }
}));
