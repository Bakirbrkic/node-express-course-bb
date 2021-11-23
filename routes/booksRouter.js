import { Router } from 'express'
import passport from 'passport'
import fs from 'fs'
import fileUpload from 'express-fileupload'
import Book from '../models/Book.js'

const booksRouter = new Router()

booksRouter.use(fileUpload())

// get all
booksRouter.get('/', async (req, res) => {
  const books = await Book.find().populate('author').exec()
  res.send(books)
})

// get single by id
booksRouter.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id).populate('author').exec()
  res.send(book)
})

// get single by slug
booksRouter.get('/slug/:slug', async (req, res) => {
  const book = await Book.findOne({ slug: req.params.slug }).populate('author').exec()
  res.send(book)
})

// create a book
booksRouter.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const newBook = new Book(req.body)
  await newBook.save()
  res.send(newBook)
})

//upload a book cover photo
booksRouter.post('/cover/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let bookCoverFile
  let uploadPath

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.')
  }
  console.log(req.files)

  bookCoverFile = req.files.bookCoverFile
  if (bookCoverFile.mimetype === 'mage/jpg' ||  bookCoverFile.mimetype === 'image/png'){
    uploadPath = `/source/covers/${bookCoverFile.name}`
    let uploaded = await bookCoverFile.mv(uploadPath)
    const book = await Book.findByIdAndUpdate(req.params.id, { coverPhoto: bookCoverFile.name }, { new: true })
    res.send(book)
  }
  else {
    res.status(400).send(`File ${bookCoverFile.name} is not a picture!`)
  }
})

// update a book
booksRouter.patch('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body)
  res.send(book)
})

// delete a book
booksRouter.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await Book.deleteOne({ _id: req.params.id })
    res.send(result)
  } catch (err) {
    res.status(404)
    res.send({ error: 'Book doesn\'t exist or couldn\'t be deleted!' })
  }
})

export default booksRouter
