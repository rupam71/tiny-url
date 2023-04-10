import jwt from "jsonwebtoken";
import User from "../model/user";
import { Request, Response, NextFunction } from "express";

const noAuth = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.header("x-auth-token")) {
      const token: any = req.header("x-auth-token");
      const decoded: any = jwt.verify(token, process.env.JWT as string);
      const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

      if (!user) {
        req.user = null;
        req.token = null;
      } else {
        req.user = user;
        req.token = token;
      }
    } else {
      req.user = null;
      req.token = null;
    }

    next();
  } catch (e) {
    res.status(401).send("please authenticate 22");
  }
};

export default noAuth;
