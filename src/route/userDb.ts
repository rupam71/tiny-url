import bcrypt from 'bcrypt';
import { Express } from "express";
import User from "../model/user";
import jwt from "jsonwebtoken";
import auth from '../middleware/auth';

export default (app: Express): void => {
    // sign up //DONE
  app.post("/api/users/signup", async (req, res) => {
    const user:any = new User(req.body);
    try {
        const token = jwt.sign({ _id: user._id.toString() },process.env.JWT as string)
        user.tokens = user.tokens.concat({token})
        await user.save()

      res.status(201).send({ user, token });
    } catch (e:any) {
      if (e.code) {
        res.status(400).send("Email Already Used");
      } else {
        res.status(400).send(e.message);
      }
    }
  });

  //login //DONE
  app.post("/api/users/login", async (req, res) => {
    try {
      const user:any = await User.find({ email: req.body.email });
      if(user.length===0) return res.status(401).send("Email Not Match")

      const isMatch = await bcrypt.compare(req.body.password,user[0].password)
      if(!isMatch) return res.status(401).send("Password Not Match")

      const token = jwt.sign({ _id: user[0]._id.toString() },process.env.JWT as string)
      user.tokens = user.tokens.concat({token})
      await user.save()

      res.send({ user, token });
    } catch (e:any) {
      res.status(400).send(e.message);
    }
  });

  //logout from device //DONE
  app.post("/api/users/logout", auth, async (req:any, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((token:{token:string}) => {
        return token.token !== req.token;
      });
      await req.user.save();
      res.send("Logout From This Device");
    } catch (e) {
      res.status(500).send();
    }
  });

  // logout from all device //DONE
  app.post("/api/users/logoutAll", auth, async (req:any, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.send("Logout From All Device");
    } catch (e) {
      res.status(500).send();
    }
  });
}