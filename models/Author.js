import mongoose from 'mongoose'

const AuthorSchema = new mongoose.Schema({
  name: String,
  surname: String,
  country: String
}, { timestamps: true })

export default mongoose.model('Author', AuthorSchema)
