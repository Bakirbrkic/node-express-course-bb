import express from "express";
import jwt from "jsonwebtoken";

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){

        return res.status(401).send();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.status(403).send();
        }
        req.user = user;
        next();
    });

}

export default authenticate;