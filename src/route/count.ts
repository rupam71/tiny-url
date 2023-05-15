import { Express } from "express";
import Count from "../model/count";
import response from "../utils/response";
import axios from "axios";

export default (app: Express): void => {
  app.get("/api/start", async (req: any, res) => {
    const findEntry = await Count.find({});

    if (findEntry.length) response(res, 200, "Already Created", "Already Created");
    else {
      const newView = new Count({
        webUniqe: 0,
        webView: 0,
      });

      try {
        await newView.save();
        response(res, 200, "New Url Created", [{ _id: newView._id }]);
      } catch (e) {
        res.status(400).send(e);
      }
    }
  });

  app.get("/api/count/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    // 2 is unique
    // 1 is general

    let findId = await Count.find({}).select({ _id: 1 });

    if (findId.length === 0) {
      const { data } = await axios.get(`http://127.0.0.1:${process.env.PORT}/api/start`);
      findId = data.result;
    }

    const count = await Count.findByIdAndUpdate(
      findId[0]._id,
      {
        $inc: {
          ...(id === 2 && { webUniqe: 1 }),
          webView: 1,
        },
      },
      { new: true }
    ).select({ webUniqe: 1, webView: 1 });

    response(res, 200, "New Count", count);
  });
};
