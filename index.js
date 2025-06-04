import app from './app.js'



const PORT = 3001 || process.env.PORT
app.listen(PORT, () => {console.log(`server running on port: ${PORT}`)})