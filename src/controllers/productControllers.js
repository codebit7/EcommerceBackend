// Import Product model
const Product = require('../models/productModel.js');
const Category = require('../models/categoryModel.js');
const { loginUser } = require('./userControllers.js');
const uploadCloudinary = require('../utils/cloudinary.js')
const cloudinary = require('cloudinary').v2;

// Admin controllers

// Create product
async function createProduct(req, res) {
    const { name, description, category, price, brand, stock} = req.body;
    
    
    const files = req.files;

    

    if ([name, description, category, price, brand, stock].some(item => item === "")) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    if(files.length ===0){
        return res.status(400).json({ message: "Please add an image" });
    }

    const uploadedUrls = [];
    
    for(const file of files){
        const imageUrl =  await uploadCloudinary(file.path)
        if(imageUrl){
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
            category,
            brand,
            stock,
            images:uploadedUrls
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update product
async function updateProduct(req, res) {
    const { name, description, category, price, brand, stock,imagesToRemove } = req.body;
    const files = req.files;


    if ([name, description, category, price, brand, stock].some(item => item === "")) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

   
    
    try {
        const uploadedUrls =[];
       const product = await Product.findById(req.params.id);
        if(imagesToRemove && Array.isArray(imagesToRemove)){
             for(const imageId of imagesToRemove){
                await cloudinary.uploader.destroy(imageId);
                product.images =prdouct.images.map((img)=> img.imageId === imageId);
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

        uploadedUrls.push(...product.images)

        const updatedProduct = await Product.updateOne(
            {_id: req.params.id},
            { name, description, category, price, brand, stock ,images:uploadedUrls},
            { new: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product successfully updated", updatedProduct });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
}

// Delete product
async function deleteProduct(req, res) {
    try {
       
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        // console.log(deletedProduct)
        for (const image of deletedProduct.images) {
            await cloudinary.uploader.destroy(image.imageId); 
        }

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully', deletedProduct });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
}



   async function getCategory(req,res){
    try {
        const category = await Category.find();
        res.json({category});
        
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error });
    }
   }

async function getProducts(req, res) {
    try {
        const products = await Product.find().populate('category'); 

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({ data: products });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error });
    }
}


async function getProductById(req, res) {
    try {
       
        const product = await Product.findById(req.params.id).populate('category');

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ 
             message:"OK",
             data: product });

    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error });
    }
}




async function productRating(req, res){
    try {
        const {prdouctId, rating , comment} = req.body
        const {id} = req.user

        const product = await Product.findById(prdouctId);
        if(!product){
            return res.status(404).json({message: "Product not found"})
        }
        product.ratings.push({ user: id, rating, comment });
        await product.save()
        res.status(200).json({message: "Rating added successfully"})
        
    } catch (error) {
        res.status(505).json({message:error.message})
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategory,
    productRating
};
