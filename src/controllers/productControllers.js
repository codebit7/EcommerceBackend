const Product = require('../models/productModel.js');
const Category = require('../models/categoryModel.js');
const uploadCloudinary = require('../utils/cloudinary.js');
const cloudinary = require('cloudinary').v2;

// Create product
async function createProduct(req, res) {
    const { name, description, category, price, brand, stock ,condition ,discount} = req.body;
    const files = req.files;
    console.log("Files:", req.files);

    if ([name, description, category, price, brand, stock,condition].some(item => item === "")) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (!files || files.length === 0) {
        return res.status(400).json({ message: "Please add an image" });
    }

    const uploadedUrls = [];
    for (const file of files) {
        const imageUrl = await uploadCloudinary(file.path);
        if (imageUrl) {
            uploadedUrls.push({
                url: imageUrl.secure_url,
                imageId: imageUrl.public_id
            });
        }
    }

    if (uploadedUrls.length === 0) {
        return res.status(500).json({ message: "No images were uploaded" });
    }

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            condition,
            discount,
            category,
            brand,
            stock,
            images: uploadedUrls
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function updateProduct(req, res) {
    const { name, description, category, price, brand, stock, imagesToRemove } = req.body;
    const files = req.files;

    if ([name, description, category, price, brand, stock].some(item => item === "")) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

       
        if (imagesToRemove && Array.isArray(imagesToRemove)) {
            for (const imageId of imagesToRemove) {
                await cloudinary.uploader.destroy(imageId);
                product.images = product.images.filter(img => img.imageId !== imageId);
            }
        }


        const uploadedImages = [];
        for (const file of files) {
            const imageUrl = await uploadCloudinary(file.path);
            if (imageUrl) {
                uploadedImages.push({
                    url: imageUrl.secure_url,
                    imageId: imageUrl.public_id
                });
            }
        }

        product.images.push(...uploadedImages);

       
        product.name = name;
        product.description = description;
        product.category = category;
        product.price = price;
        product.brand = brand;
        product.stock = stock;

        await product.save();

        res.status(200).json({ message: "Product successfully updated", product });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
}

// Delete product
async function deleteProduct(req, res) {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

       
        for (const image of deletedProduct.images) {
            await cloudinary.uploader.destroy(image.imageId);
        }

        res.json({ message: 'Product deleted successfully', deletedProduct });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
}

// Get categories
async function getCategory(req, res) {
    try {
        const categories = await Category.find();
        res.json({ categories });

    } catch (error) {
        res.status(500).json({ message: 'Error retrieving categories', error });
    }
}


async function getProducts(req, res) {
    try {
        let { page = 1, limit = 10, category} = req.query;
        console.log("fetch products hit");
        

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        

        if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            return res.status(400).json({ message: "Invalid pagination parameters" });
        }

        const filters = {};
        if (category) {
            filters.category = category;
        }

        const skip = (pageNum - 1) * limitNum;

        
        const totalProducts = await Product.countDocuments(filters);

        const products = await Product.find(filters)
            .skip(skip)
            .limit(limitNum)
            .populate('category');

        res.status(200).json({
            data: products,
            totalProducts,
            totalPage: Math.ceil(totalProducts / limitNum),
        });

    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
}

// Get product by ID
async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "OK", data: product });

    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error });
    }
}

// Product Rating
async function productRating(req, res) {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.ratings.push({ user: userId, rating, comment });
        await product.save();
        
        res.status(200).json({ message: "Rating added successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




async  function getRecommededProducts(req, res){
       try {

        let { limit = 10 } = req.query;  
        limit = parseInt(limit, 10);

        const recommededItems = await Product.aggregate([

            {
                $addFields: {
                    averageRating: { $avg: "$ratings.rating" }
                }
            },
            {
                $sort: { averageRating: -1 } 
            },
            {
                $limit: limit
            }
        ])



        res.status(200).json({
            message: "Recommeded products retrieved successfully",
            data: recommededItems
        });
        
       } catch (error) {
        res.status(500).json({ message: "Error retrieving recommeded products", error: error.message });
       }

}



async function productDeals(req,res){
    try{
        let {limit = 10} = req.query;
        limit = parseInt(limit, 10);
        const productDeals = await Product.find({discount:{$gt:10}})
        .sort({discount:-1})
        .limit(limit);

        if(productDeals){
            res.status(200).json({
                message: "Product deals retrieved successfully",
                data: productDeals
                });
        }
        else{
            res.status(404).json({
                message: "No product deals found",
                data: null
                });
         }


    }
    catch(error){
        res.status(500).json({message: "Error retrieving product deals", error: error.message});
    }
}



// tem function 

const createProducts = async (req, res) => {
    try {
        const products = req.body;
        const files = req.files; 

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid product data" });
        }

        const newProducts = [];

        for (const product of products) {
            const { name, description, category, price, brand, stock, condition, discount } = product;

            
            if ([name, description, category, price, brand, stock].some(item => item === "")) {
                return res.status(400).json({ message: "Please fill all the fields for each product" });
            }

         
            const productImages = files.filter(file => file.fieldname.startsWith(`images_${name}`));

            if (productImages.length === 0) {
                return res.status(400).json({ message: `Please add images for product: ${name}` });
            }

            
            const uploadedUrls = [];
            for (const file of productImages) {
                const imageUrl = await uploadCloudinary(file.path);
                if (imageUrl) {
                    uploadedUrls.push({
                        url: imageUrl.secure_url,
                        imageId: imageUrl.public_id
                    });
                }
            }

            if (uploadedUrls.length === 0) {
                return res.status(500).json({ message: `No images were uploaded for ${name}` });
            }

           
            const newProduct = new Product({
                name,
                description,
                price,
                condition,
                discount,
                category,
                brand,
                stock,
                images: uploadedUrls
            });

            newProducts.push(newProduct);
        }

       
        await Product.insertMany(newProducts);
        res.status(201).json({ message: 'Products created successfully', products: newProducts });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategory,
    productRating,
    getRecommededProducts,
    productDeals,
    createProducts
};
