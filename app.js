import express from "express";
import mongoose from "mongoose";

import booksRouter from "./routes/booksRouter.js"
import authorsRouter from "./routes/authorsRouter.js";

const app = express();

if (process.env.NODE_ENV === 'production') {
    mongoose.connect(`mongodb://user:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_MONGODB_SERVICE_HOST}:${process.env.MONGO_MONGODB_SERVICE_PORT}/`);
} else {
    mongoose.connect('mongodb://mondb/plural');
    mongoose.set('debug', true);
}

app.use(express.json());
app.use('/books', booksRouter);
app.use('/authors', authorsRouter);

const server = app.listen(process.env.PORT || 80, function() {
    console.log(`Listening on port ${server.address().port}`);
});