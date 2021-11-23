import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10)

  this.password = hash
  next()
})

UserSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret.password
    return ret
  }
})

UserSchema.methods.isValidPassword = async (password) => {
  const user = this
  const compare = await bcrypt.compare(password, user.password)

  return compare
}

export default mongoose.model('User', UserSchema)
