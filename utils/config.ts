import dotenv from 'dotenv'

dotenv.config({path: './.env'})

let MONGODB_URI:string = "";

if(process.env.NODE_ENV === 'production'){
    MONGODB_URI = process.env.MONGODB_URI_PROD ? process.env.MONGODB_URI_PROD : ""
}
else if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
    MONGODB_URI = process.env.MONGODB_URI_DEV ? process.env.MONGODB_URI_DEV : ""
}

const PORT = process.env.PORT;

export default {
    MONGODB_URI,
    PORT
}