import mongoose from 'mongoose'

const BookSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true },
  title: String,
  description: String,
  genres: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  coverPhoto: String
}, { timestamps: true })

BookSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify()
  }
  next()
})

BookSchema.methods.slugify = function () {
  this.slug = this.title.replaceAll(' ', '-').toLowerCase()
  return this.slug
}

export default mongoose.model('Book', BookSchema)
