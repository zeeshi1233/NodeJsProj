import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: String,
        required: true,
    },
    images:{
        type: Array,
        required: true,
    },

},{timestamps:true});

const ProductModel=mongoose.model("products",ProductSchema);
export default ProductModel;