import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import UserModel from "./model/UserModel.mjs";
import hashPassword from "./utils/hashPassword.mjs";
import CompPassword from "./utils/camparePass.mjs";
import jwt from "jsonwebtoken";
import ProductModel from "./model/ProductModel.mjs";
dotenv.config();
const app = express();
app.use(express.json())
const connectDb = () => {
  mongoose.connect(process.env.MONDODB_URI)
    .then((res) => console.log("Db Connect"))
    .catch((e) => console.log(e,"db disconect"));
};
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req?.body;
    const emailExist=await UserModel.findOne({email})
    console.log(emailExist);
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


app.post('/api/login',async(req,res)=>{
try {
     const {email,password}=req.body;
      const userExist=await UserModel.findOne({email})
      if (userExist) {
        const isFound=await CompPassword(password,userExist.password)
        if (isFound) {
        const token=jwt.sign({id:userExist},process.env.JWT_SEC)
          res.status(200).send( {success: true, message:"User Log In ",userExist,token})
        }
        else{
          res.status(401).send({ success: false, message:"User Credentials Incorrect" });
        }
      }else{
        res.status(401).send({ success: false, message:"User Not Found" });
      }
} catch (error) {
  res.status(500).send({ success: false, message: error.message });
}
})


app.get('/api/getproduct',async(req,res)=>{
  try {
    const data=await ProductModel.find({})
    res.status(200).send({ success: true, message:"Data Found",data});
  } catch (error) {
  res.status(500).send({ success: false, message: error.message });
    
  }
})

app.post('/api/product',async(req,res)=>{
  try {
    const {title,description,price,images}=req.body;
    const data=await ProductModel.create({
      title,
      description,
      price,
      images
    })
    res.status(200).send({ success: true, message:"Product Created",data});

  } catch (error) {
  res.status(500).send({ success: false, message: error.message });
    
  }
})

app.delete('/api/delete/:id',async(req,res)=>{
  try {
    await ProductModel.findByIdAndDelete({_id:req.params.id})
    res.status(200).send({ success: true, message:"Product Delete"});

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
    
  }
})
app.put('/api/update/:id',async(req,res)=>{
  try {
    const body=req.body;
     const data =await ProductModel.findByIdAndUpdate({_id:req.params.id},{...body},{new:true})
    res.status(200).send({ success: true, message:"Update",data});

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
    
  }
})

app.get('/api/detail/:id',async(req,res)=>{
  try {
    const detailData=await ProductModel.findById({_id:req.params.id})
    res.status(200).send({ success: true, message:"Product Get",detailData});

  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
    
  }
})

connectDb();

app.listen(3000, () => {
  console.log("run");
});
