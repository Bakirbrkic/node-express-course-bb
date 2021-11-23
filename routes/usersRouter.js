import { Router } from 'express'
import User from '../models/User.js'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'

const usersRouter = new Router()

// get all
usersRouter.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const users = await User.find()
  res.send(users)
})

// get single by id
usersRouter.get('/single/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const user = await User.findById(req.params.id)
  res.send(user)
})

usersRouter.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({
    message: 'You made it to the secure route',
    user: req.user,
    token: req.headers.authorization
  })
})

// update User
usersRouter.patch('/id/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const update = req.body
  if (req.body.password) {
    const hash = await bcrypt.hash(req.body.password, 10)
    update.hash = hash
    delete update.password
  }

  const user = await User.findByIdAndUpdate(req.params.id, update)
  res.send(user)
})

// signup user
usersRouter.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
  res.json({
    message: 'Signup successful',
    user: req.user
  })
})

// login user
usersRouter.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        if (info) {
          return next(info.message)
        }
        return next(err)
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(info.message)

        const body = { _id: user._id, email: user.email }
        const token = jwt.sign({ user: body }, process.env.ACCESS_TOKEN_SECRET)

        return res.json({ token })
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

// delete user
usersRouter.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id })
    res.send(result)
  } catch (err) {
    res.status(404)
    res.send({ error: 'User doesn\'t exist or couldn\'t be deleted!' })
  }
})

export default usersRouter
