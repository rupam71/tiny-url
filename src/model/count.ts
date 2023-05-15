import mongoose from "mongoose";
import CountType from "../type/count";


const CountSchema = new mongoose.Schema<CountType>(
  {
    webUniqe: {
      type: Number,
      required: true,
    },
    webView: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Count = mongoose.model<CountType>("Count", CountSchema);
export default Count;
