import jwt from 'jsonwebtoken';
import User from '../model/user';
import { Request, Response, NextFunction } from 'express';

const auth = async (req:any, res:Response, next:NextFunction) => {
    try{
        const token:any = req.header('x-auth-token')
        const decoded:any = jwt.verify(token, process.env.JWT as string)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
               
        if(!user) throw new Error()

        req.user = user
        req.token = token
        
        next()
    } catch(e){
        res.status(401).send('please authenticate')
    }
}

export default auth;