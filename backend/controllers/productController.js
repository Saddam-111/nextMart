import { uploadCloudinary, deleteCloudinary } from "../config/cloudinary.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";


const safeParseJSON = (str, defaultValue = []) => {
  if (!str) return defaultValue;
  
  if (Array.isArray(str)) return str;
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch (error) {
    console.error("JSON parse error:", error.message);
    return defaultValue;
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      subCategory,
      sizes,
      stock,
      bestSeller,
      featured,
      tags,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = req.body;

    const images = [];

    
    for (let i = 1; i <= 4; i++) {
      if (req.files && req.files[`image${i}`] && req.files[`image${i}`][0]) {
        const result = await uploadCloudinary(
          req.files[`image${i}`][0].path,
          "products"
        );
        images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

     const productData = {
       name,
       description,
       price: Number(price),
       originalPrice: originalPrice ? Number(originalPrice) : undefined,
       category,
       subCategory,
       sizes: safeParseJSON(sizes),
       stock: Number(stock) || 0,
       bestSeller: bestSeller === "true",
       featured: featured === "true",
       tags: safeParseJSON(tags, []),
       date: Date.now(),
       images,
       seoTitle,
       seoDescription,
       seoKeywords: safeParseJSON(seoKeywords, []),
     };

    const product = await Product.create(productData);

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Failed to add product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};




export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "No product found",
      });
    }

    
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image?.publicId) {
          await deleteCloudinary(image.publicId);
        }
      }
    }

    
    await Product.findByIdAndDelete(id);

    
    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
    });

  } catch (error) {
    console.error("Remove Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove product",
      error: error.message,
    });
  }
};


export const listProduct = async (req , res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('name price originalPrice images category subCategory averageRating totalReviews stock isActive featured bestSeller')
      .sort({ createdAt: -1 });

    if(!products){
      return res.status(400).json({
        success: false,
        message: "No product"
      })
    }

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to list product",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single product with reviews
 * @route   GET /api/v1/product/:id
 * @access  Public
 */
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; 

    const product = await Product.findById(id)
      .populate('reviews.userId', 'name profileImage');

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    
    product.viewCount += 1;
    await product.save();

    
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $pull: { recentlyViewed: { productId: id } } 
      });

      await User.findByIdAndUpdate(userId, {
        $push: {
          recentlyViewed: {
            productId: id,
            viewedAt: new Date()
          }
        }
      });

      
      const user = await User.findById(userId);
      if (user.recentlyViewed.length > 20) {
        user.recentlyViewed = user.recentlyViewed.slice(-20);
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/v1/product/:id
 * @access  Private (Admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    
    if (req.files) {
      const images = [];

      
      for (let i = 1; i <= 4; i++) {
        if (req.files[`image${i}`] && req.files[`image${i}`][0]) {
          const result = await uploadCloudinary(
            req.files[`image${i}`][0].path,
            "products"
          );
          images.push({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }

      if (images.length > 0) {
        updateData.images = images;
      }
    }

    
    if (updateData.sizes) {
      updateData.sizes = safeParseJSON(updateData.sizes);
    }
    if (updateData.tags) {
      updateData.tags = safeParseJSON(updateData.tags);
    }
    if (updateData.seoKeywords) {
      updateData.seoKeywords = safeParseJSON(updateData.seoKeywords);
    }

    
    if (updateData.price) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.originalPrice) {
      updateData.originalPrice = Number(updateData.originalPrice);
    }
    if (updateData.stock) {
      updateData.stock = Number(updateData.stock);
    }

    
    if (updateData.bestSeller !== undefined) {
      updateData.bestSeller = updateData.bestSeller === "true";
    }
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === "true";
    }
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === "true";
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * @desc    Get filtered products
 * @route   GET /api/v1/product/filter
 * @access  Public
 */
export const getFilteredProducts = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sortBy,
      search,
      page = 1,
      limit = 12
    } = req.query;

    let query = { isActive: true };

    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    
    if (subCategory) {
      query.subCategory = { $regex: subCategory, $options: 'i' };
    }

    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    
    if (rating) {
      query.averageRating = { $gte: Number(rating) };
    }

    
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    
    let sortOptions = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { averageRating: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'popular':
        sortOptions = { soldCount: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .select('name price originalPrice images category subCategory averageRating totalReviews stock soldCount createdAt')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        hasNext: page * limit < totalProducts,
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * @desc    Get recently viewed products
 * @route   GET /api/v1/product/recently-viewed
 * @access  Private
 */
export const getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .populate('recentlyViewed.productId', 'name price images category averageRating');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    
    const recentlyViewed = user.recentlyViewed
      .filter(item => item.productId)
      .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
      .slice(0, 10);

    res.status(200).json({
      success: true,
      recentlyViewed: recentlyViewed.map(item => ({
        product: item.productId,
        viewedAt: item.viewedAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * @desc    Get low stock products
 * @route   GET /api/v1/product/low-stock
 * @access  Private (Admin)
 */
export const getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;

    const products = await Product.find({
      stock: { $lte: threshold },
      isActive: true
    }).select('name stock lowStockThreshold category images price');

    res.status(200).json({
      success: true,
      products,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * @desc    Update product stock
 * @route   PUT /api/v1/product/:id/stock
 * @access  Private (Admin)
 */
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, lowStockThreshold } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold) || 5,
        isActive: Number(stock) > 0 
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      product: {
        _id: product._id,
        name: product.name,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        isActive: product.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * @desc    Get inventory summary
 * @route   GET /api/v1/product/inventory-summary
 * @access  Private (Admin)
 */
export const getInventorySummary = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const inactiveProducts = await Product.countDocuments({ isActive: false });
     const lowStockProducts = await Product.countDocuments({
       $expr: { $lte: ['$stock', '$lowStockThreshold'] },
       isActive: true
     });
    const outOfStockProducts = await Product.countDocuments({
      stock: 0,
      isActive: true
    });

    const totalStockValue = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);

    const topSellingProducts = await Product.find({ soldCount: { $gt: 0 } })
      .sort({ soldCount: -1 })
      .limit(5)
      .select('name soldCount stock');

    res.status(200).json({
      success: true,
      summary: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        lowStockProducts,
        outOfStockProducts,
        totalStockValue: totalStockValue[0]?.totalValue || 0,
        topSellingProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
