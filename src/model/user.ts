import mongoose from "mongoose";
import UserDBType from "../type/userDB";
import validator from "validator";
import bcrypt from "bcrypt";

const UserDBSchema = new mongoose.Schema<UserDBType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userID: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    userType: {
      type: String,
      default: "normal",
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Email not valid");
        }
      },
      trim: true,
      loadClass: true,
    },
    password: {
      type: String,
      required: true,
      default: "qwer   yuio   plmbvcxd    hjhghjb guytgfuyg",
      trim: true,
      validate(value: string) {
        if (value.length < 6) {
          throw new Error("Password need to be atleast 6 word");
        }
        if (value === "password") {
          throw new Error("password can not be password");
        }
      },
    },
    totalUrl: {
      type: Number,
      default: 0,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserDBSchema.pre('save', async function(next) {
    const user:any = this

    if(user.isModified('password')){
        const salt = await bcrypt.genSalt(10); //10 rounds
        user.password = await bcrypt.hash(user.password, salt); 
    }

    next()
})




const UserDB = mongoose.model<UserDBType>("UserDB", UserDBSchema);
export default UserDB;
