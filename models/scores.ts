import mongoose from "mongoose";
import { ScoreModel } from "../types/models";

const scoreSchema = new mongoose.Schema<ScoreModel>({
    wins: {type: Number, required: true},
    losses: {type: Number, required: true},
    ties: {type: Number, required: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})

const Score = mongoose.model('Score', scoreSchema)

export default Score