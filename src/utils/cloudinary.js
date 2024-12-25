const cloudinary = require('cloudinary').v2;
const fs  = require('fs');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})



const uploadCloudinary = async(localFile)=>{
    try {
   
        const result = await cloudinary.uploader.upload(localFile, {
            resource_type: "auto",
            });
            fs.unlinkSync(localFile);
            return result;
        
    } catch (error) {
        try {
            fs.unlinkSync(localFile);
        } catch (err) {
            console.error('Failed to delete local file:', err);
        }
        return null
    }
}

module.exports =uploadCloudinary