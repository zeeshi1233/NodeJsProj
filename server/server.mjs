import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import UserModel from "./model/UserModel.mjs";
import hashPassword from "./utils/hashPassword.mjs";
dotenv.config();
const app = express();
app.use(express.json())
const connectDb = () => {
  const db = mongoose
    .connect(process.env.MONDODB_URI)
    .then((res) => console.log("Db Connect"))
    .catch((e) => console.log("db disconect"));
};

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req?.body;
    const emailExist=await UserModel.findOne({email})
    if (emailExist) {
        res.status(400).send({ success: false, message: "Email Already Exist" });
        return
    }
    const hashPass=await hashPassword(password)
    const user = await UserModel.create({
        name,
        email,
        phone,
       password:hashPass,
      });
      res.status(200).send({ success:true, message:"User Registered Successfully",user });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

connectDb();

app.listen(3000, () => {
  console.log("run");
});
