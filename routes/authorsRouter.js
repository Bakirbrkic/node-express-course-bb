import { Router } from "express";
import Author from "../models/Author.js";
import Book from "../models/Book.js";

const authorsRouter = new Router();

// get all
authorsRouter.get('/', async (req, res) => {
    const authors = await Author.find();
	res.send(authors);
})

// get single by id
authorsRouter.get('/:id', async (req, res) => {
    const author = await Author.findById(req.params.id);
	res.send(author);
})

// get single author by id (with books)
authorsRouter.get('/:id/books', async (req, res) => {
    const author = await Author.findById(req.params.id);
    const books = await Book.where('author').equals(req.params.id);

	res.send({...author._doc, books: books});
})

// create author
authorsRouter.post('/', async (req, res) => {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.send(newAuthor);
})

// update author
authorsRouter.patch('/:id', async (req, res) => {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body);
    res.send(author);
})

// delete author
authorsRouter.delete('/:id', async (req, res) => {
    const books = await Book.where('author').equals(req.params.id);
    if(books.length === 0){
        try {
            const result = await Author.deleteOne({ _id: req.params.id })
            res.send(result)
        } catch {
            res.status(404)
            res.send({ error: "Author doesn't exist or couldn't be deleted!" })
        }
    } else {
        res.status(403).send({error: "You should delete all the books belonging to this author first!" });
    }
})

export default authorsRouter;