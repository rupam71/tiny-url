import { Express } from "express";
import TinyUrl from "../model/tinyUrl";
import sevenDiginUniqueId from "../utils/sevenDiginUniqueId";

export default (app: Express): void => {
  // create tinyUrl
  app.post("/api/tinyUrl", async (req, res) => {
    const longUrl = req.body.longUrl;
    let shortUrl;
    let found = true;

    const existedUrl: any = await TinyUrl.find({ longUrl });
    if (existedUrl.length) return res.status(200).send(existedUrl[0]);

    while(found) {
      const sixDigitTimestamp:string = (Date.now() - 1681016000000).toString()
      const sevenDigitRandomValue:string = (Math.floor(Math.random() * 10000000)).toString()
      
      const uniqueValue = parseInt(sixDigitTimestamp+sevenDigitRandomValue);
      shortUrl = sevenDiginUniqueId(uniqueValue);

      const tinyUrl: any = await TinyUrl.find({ shortUrl });
      if (tinyUrl.length === 0) found = false;
    }

    const newUrl = new TinyUrl({ longUrl, shortUrl });

    try {
      await newUrl.save();
      res.status(201).send(newUrl);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  // redirect
  app.get("/api/:id", async (req, res) => {
    const tinyUrl: any = await TinyUrl.find({ shortUrl: req.params.id });

    if (tinyUrl.length === 0) return res.status(400).send("TinyUrl Not Found");

    const newTinyUrl: any = await TinyUrl.findByIdAndUpdate(
      tinyUrl[0]._id,
      {
        totalHit: tinyUrl[0].totalHit + 1,
      },
      { new: true }
    );

    res.redirect(newTinyUrl.longUrl);
  });
};
