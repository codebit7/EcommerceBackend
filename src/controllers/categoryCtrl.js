const Category = require('../models/categoryModel.js')



const createCategory = async(req,res)=>{
    try {
        const {name, description} = req.body;

        if(!name || !description){
            return res.status(400).json({message: "Please fill in all fields"})
        }
      const category = await Category.findOne({name})
      if(category){
        return res.status(400).json({message: "Category already exists"})
      }
      const newCategory = await Category.create({name, description})
    
      await newCategory.save();
      res.status(200).json(newCategory)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const updateCategory = async(req,res)=>{
    try {
        const {id}= req.params;

        const {name , description} =req.body;
        if (!id || !name || !description) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }


        const category = await Category.findByIdAndUpdate(
            id,
            {
                $set:{name,description}
            },
            {new:true}
        )
        if(!category){
            return res.status(400).json({message: "this category is not exist"})
        }


       res.status(200).json({message:"Successfully Updated",category})
       console.log("ok");
       
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const deleteCategory = async(req,res)=>{
    try {
        const {id} = req.params

       const category =  await Category.findByIdAndDelete(id);
       if(!category) return  res.status(404).json({message:"category Not found"});

       res.status(200).json({message:"deleted category successfully"});
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


const getAllCategories = async(req,res)=>{
    try {
        const category = await Category.find() 
        if(!category.length === 0) return res.status(404).json({message:"categories not found",category:[]});
        res.status(200).json(category)
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports ={
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories
}