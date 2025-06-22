import mongoose  from "mongoose";
import { UserModel } from "../types/models";

const userSchema = new mongoose.Schema<UserModel>({
    username: {type: String, required: true},
    passwordHash: {type: String, required: true},
    name: {type: String, required: true}
})

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(),
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

export default User