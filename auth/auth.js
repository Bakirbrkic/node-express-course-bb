import passport from 'passport'

import User from '../models/User.js'

import localStrategy from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'

const localStrProp = {
  usernameField: 'email',
  passwordField: 'password'
}
// eslint-disable-next-line new-cap
passport.use('signup', new localStrategy(localStrProp, async (email, password, done) => {
  try {
    const user = await User.create({ email, password })
    return done(null, user)
  } catch (err) {
    done(err)
  }
}))

// eslint-disable-next-line new-cap
passport.use('login', new localStrategy(localStrProp, async (email, password, done) => {
  try {
    const user = await User.findOne({ email })

    if (!user) {
      return done(null, false, { message: 'User not found' })
    }

    const validate = await user.isValidPassword(password)

    if (!validate) {
      return done(null, false, { message: 'Wrong Password or Username' })
    }

    return done(null, user, { message: 'Logged in Successfully' })
  } catch (error) {
    return done(error)
  }
}))

const jwtStrProp = {
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

passport.use(new JWTStrategy(jwtStrProp, async (token, done) => {
  try {
    const user = await User.findById(token.user._id)
    if (user) {
      return done(null, token.user)
    }
    throw new Error('User not found')
  } catch (error) {
    done(error)
  }
}))
