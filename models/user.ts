import mongoose  from "mongoose";
import { UserModel } from "../types/models";
import { accountType } from "../types/types";

const userSchema = new mongoose.Schema<UserModel>({
    username: {type: String, required: true},
    passwordHash: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    status: {type: String, enum: accountType, default: accountType.INACTIVE}
})

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(),
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
        delete returnedObject.email
        delete returnedObject.status
    }
})

const User = mongoose.model('User', userSchema)

export default User