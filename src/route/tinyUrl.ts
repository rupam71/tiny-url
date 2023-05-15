import { Express } from "express";
import TinyUrl from "../model/tinyUrl";
import sevenDiginUniqueId from "../utils/sevenDiginUniqueId";
import noAuth from "../middleware/noAuth";
import response from "../utils/response";
import client from "../config/redis";
import auth from "../middleware/auth";

export default (app: Express): void => {
  // create tinyUrl
  app.post("/api/tinyUrl", noAuth, async (req: any, res) => {
    let user = null;
    let expireAt = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);

    if (req.user) {
      if (req.user.status === "NORMAL" && req.user.totalUrl >= 10) {
        return response(res, 200, "Normal User Cannot Make More Than 10 Url. Please Purchase PRIMIUM.", null);
      }

      user = req.user;
      expireAt = req.user.status === "NORMAL" ? new Date(new Date().getTime() + 24 * 60 * 60 * 1000) : new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
    }

    const longUrl = req.body.longUrl;
    let shortUrl;
    let found = true;

    const existedUrl: any = await TinyUrl.find({ longUrl });
    if (existedUrl.length) return response(res, 200, "Url Already Exists", existedUrl[0].shortUrl);

    while (found) {
      const sixDigitTimestamp: string = (Date.now() - 1681016000000).toString();
      const sevenDigitRandomValue: string = Math.floor(Math.random() * 10000000).toString();

      const uniqueValue = parseInt(sixDigitTimestamp + sevenDigitRandomValue);
      shortUrl = sevenDiginUniqueId(uniqueValue);

      const tinyUrl: any = await TinyUrl.find({ shortUrl });
      if (tinyUrl.length === 0) found = false;
    }

    const newUrl = new TinyUrl({ longUrl, shortUrl, user, expireAt });

    try {
      await newUrl.save();
      response(res, 200, "New Url Created", shortUrl);
    } catch (e) {
      res.status(400).send(e);
    }
  });

    // get all url for a user
    app.get("/u", auth, async (req:any, res) => {
      let allUrl: any
      
      const key = `all-url-${req.user.userId}`;
      const a = await client.get(key).then((res:any) => JSON.parse(res));
      
      if (a) {
        console.log(`get query from cached ${key}`);
        allUrl = a;
      } else {
        allUrl = await TinyUrl.find({ "user.userID": req.user.userId });
        if (allUrl.length === 0) return response(res,400,"No Url For This User",null)
        else {
          await client.set(key,JSON.stringify(allUrl),{EX:300}).then(() => console.log(`set redis cache for ${key} sucess`));
        }
      }
  
      response(res,200,"All Url Send For This User",allUrl)
    });

  // redirect
  app.get("/:id", async (req, res) => {
    let tinyUrl: any
    
    const key = `shortUrl-${req.params.id}`;
    const a = await client.get(key).then((res:any) => JSON.parse(res));
    
    if (a) {
      console.log(`get query from cached ${key}`);
      tinyUrl = a;
    } else {
      tinyUrl = await TinyUrl.find({ shortUrl: req.params.id });
      if (tinyUrl.length === 0) return response(res,400,"TinyUrl Not Found",null)
      else {
        await client.set(key,JSON.stringify(tinyUrl),{EX:300}).then(() => console.log(`set redis cache for ${key} sucess`));
      }
    }

    const newTinyUrl: any = await TinyUrl.findByIdAndUpdate(
      tinyUrl[0]._id,
      {
        totalHit: tinyUrl[0].totalHit + 1,
      },
      { new: true }
    );

    res.redirect(newTinyUrl.longUrl);
    // need a no url found page
  });
};
