import { uploadCloudinary, deleteCloudinary } from "../config/cloudinary.js";
import Product from "../models/productModel.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    let image1 = null,
      image2 = null,
      image3 = null,
      image4 = null;

    if (req.files.image1) {
      const result1 = await uploadCloudinary(
        req.files.image1[0].path,
        "products"
      );
      image1 = {
        url: result1.secure_url,
        publicId: result1.public_id,
      };
    }

    if (req.files.image2) {
      const result2 = await uploadCloudinary(
        req.files.image2[0].path,
        "products"
      );
      image2 = {
        url: result2.secure_url,
        publicId: result2.public_id,
      };
    }

    if (req.files.image3) {
      const result3 = await uploadCloudinary(
        req.files.image3[0].path,
        "products"
      );
      image3 = {
        url: result3.secure_url,
        publicId: result3.public_id,
      };
    }

    if (req.files.image4) {
      const result4 = await uploadCloudinary(
        req.files.image4[0].path,
        "products"
      );
      image4 = {
        url: result4.secure_url,
        publicId: result4.public_id,
      };
    }

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestSeller === "true",
      date: Date.now(),
      image1,
      image2,
      image3,
      image4,
    };

    const product = await Product.create(productData);

    return res.status(200).json(product);
  } catch (error) {
    console.error("Failed to add product:", error);
    return res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
};




export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        message: "No product found",
      });
    }

    // 2. Delete images from Cloudinary (if publicIds exist)
    const imageFields = ['image1', 'image2', 'image3', 'image4'];
    for (const field of imageFields) {
      const image = product[field];
      if (image?.publicId) {
        await deleteCloudinary(image.publicId);
      }
    }

    // 3. Delete product from MongoDB
    await Product.findByIdAndDelete(id);

    // 4. Respond
    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
    });

  } catch (error) {
    console.error("Remove Product Error:", error);
    return res.status(500).json({
      message: "Failed to remove product",
      error: error.message,
    });
  }
};


export const listProduct = async (req , res) => {
  try {
    const products = await Product.find({})
    if(!products){
      return res.status(400).json({
        message: "No product"
      })
    }
    res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({
      message: "Failed to list product",
      error: error.message,
    });
  }
}