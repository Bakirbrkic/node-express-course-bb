import { Router } from "express";
import User from "../models/User.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticate from "./auth.js";

const usersRouter = new Router();

// get all
usersRouter.get('/', authenticate, async (req, res) => {
    var users = await User.find();
    res.send(users);
})

// get single by id
usersRouter.get('/:id', authenticate, async (req, res) => {
    const user = await User.findById(req.params.id);
    delete user.hash;
	res.send(user);
})

// create User
usersRouter.post('/', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({username: req.body.username, hash: hash, email: req.body.email});
    await newUser.save();
    res.status(201).send(newUser);
})

// update User
usersRouter.patch('/:id', authenticate, async (req, res) => {
    var update = req.body
    if(req.body.password){
        const hash = await bcrypt.hash(req.body.password, 10);
        update.hash = hash;
        delete update.password;
    }    

    const user = await User.findByIdAndUpdate(req.params.id, update);
    res.send(user);
})

// delete User
usersRouter.delete('/:id', authenticate, async (req, res) => {
    try {
        const result = await User.deleteOne({ _id: req.params.id })
        res.send(result)
    } catch {
        res.status(404)
        res.send({ error: "User doesn't exist or couldn't be deleted!" })
    }
})

// login user
usersRouter.post('/login', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if (user == null){
        return res.status(400).send("User not found");
    }
    try {
        if(await bcrypt.compare(req.body.password, user.hash)){

            const tokenuser = {username: user.username, email: user.email};
            const token = jwt.sign(tokenuser, process.env.ACCESS_TOKEN_SECRET);

            res.status(200).send({accessToken: token});

        } else {
            res.status(403).send("Not allowed");
        }
    } catch(err) {
        console.log(err);
            
        res.status(500).send();
    }
})

export default usersRouter;