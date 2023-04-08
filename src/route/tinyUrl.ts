import { Express } from "express";
import TinyUrl from "../model/tinyUrl";

export default (app: Express): void => {
  // create tinyUrl
  app.post("/api/tinyUrl", async (req, res) => {
    const longUrl = req.body.longUrl;
    const shortUrl = new Date().getTime();

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
