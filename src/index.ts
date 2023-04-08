import express from 'express'
import db from './config/db';
import tinyUrl from './route/tinyUrl'
require("dotenv").config();

db();

const app = express() 
app.use(express.json());

tinyUrl(app)

console.log('Hello world')

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log(`Listening at port : ${PORT}`)