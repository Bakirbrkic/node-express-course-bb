import { Router } from "express";
import Book from "../models/Book.js";

import authenticate from "./auth.js";

const booksRouter = new Router();

// get all
booksRouter.get('/', async(req, res) => {
    const books = await Book.find().populate('author').exec();
    res.send(books);
})

// get single by id
booksRouter.get('/:id', async(req, res) => {
    const book = await Book.findById(req.params.id).populate('author').exec();
    res.send(book);
})

// get single by slug
booksRouter.get('/slug/:slug', async(req, res) => {
    const book = await Book.findOne({ slug: req.params.slug }).populate('author').exec();
    res.send(book);
})

// create a book
booksRouter.post('/', authenticate, async(req, res) => {
    const newBook = new Book(req.body);
    await newBook.save();
    res.send(newBook);
})

// update a book
booksRouter.patch('/:id', authenticate, async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body);
    res.send(book);
})

// delete a book
booksRouter.delete('/:id', authenticate, async(req, res) => {
    try {
        const result = await Book.deleteOne({ _id: req.params.id })
        res.send(result)
    } catch {
        res.status(404)
        res.send({ error: "Book doesn't exist or couldn't be deleted!" })
    }
})

export default booksRouter;