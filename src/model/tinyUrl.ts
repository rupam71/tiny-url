import mongoose from "mongoose";
import TinyUrlType from "../type/tinyUrl";

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
    endTime: Date,
    totalHit: {
      type: Number,
      default: 0
    },
    user: {
        name: {
            type: String,
        //    required: true,
            trim: true
        },
        status: {
            type: String
        }
    }
  },
  {
    timestamps: true,
  }
);

const TinyUrl = mongoose.model<TinyUrlType>("TinyUrl", TinyUrlSchema);
export default TinyUrl;