import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';


import express from 'express';
import authRoutes from './routes/auth.js';
import routes from './routes/routes.js'; 

import { PrismaClient }  from '@prisma/client';

const prisma = new PrismaClient();
const port = process.env.PORT || 4000;


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use(morgan('tiny'))
app.disable('x-powered-by')


app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})

//auth rute koristimo iz baze pod
app.use('/auth',authRoutes)

//api rute
app.use('/api',routes)

 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });





process.env