import express from "express";
const router = express.Router();
import passport from "passport";
import { authController } from "~/controllers/authController";
import 'dotenv/config'
import setTokenCookies from "~/middlewares/setTokenCookies";

router.get("/google", passport.authenticate("google", { scope: ['profile', 'email'] }));

router.get("/google/callback", 
  passport.authenticate("google", { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).send('Authentication failed');
    }
   
    setTokenCookies(req, res, (err) => {
      if (err) return next(err);
      res.redirect(process.env.REACT_URL + '/boards');
    });
  }
);

router.post('/new-user', authController.createUser)

export const authRoute = router;
