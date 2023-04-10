import mongoose from "mongoose";
import TinyUrlType from "../type/tinyUrl";
import UserDB from "./user";

const TinyUrlSchema = new mongoose.Schema<TinyUrlType>(
  {
    longUrl: {
      type: String,
      required: true,
      trim: true
    },
    shortUrl: {
      type: String,
      required: true,
      trim: true
    },
    totalHit: {
      type: Number,
      default: 0
    },
    expireAt: {
      type: Date,
      // Add 2 hours to the current date and time
      default: new Date(new Date().getTime() + (2 * 60 * 60 * 1000))
    },
    user: {
      name: {
        type: String,
      },
      userID: {
        type: String,
      },
      status: {
        type: String,
      },
    }
  },
  {
    timestamps: true,
  }
);

TinyUrlSchema.pre('save', async function(next) {
  const user:any = this.user

  await UserDB.updateOne({
      userID : user.userID
  },{
      $inc: { totalUrl: 1 }
  })

  next()
})

const TinyUrl = mongoose.model<TinyUrlType>("TinyUrl", TinyUrlSchema);
export default TinyUrl;