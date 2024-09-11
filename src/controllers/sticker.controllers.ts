import { Context } from "hono";
import { createPrismaClient } from "../config/database";


const addSticker = async(c: Context) => {
    try {
        const formData = await c.req.parseBody(); 
        const image = formData['sticker']; 

        let categoryId = formData['categoryId'] as string
        if(!categoryId){
            return c.json({
                success: false,
                message: "CategoryId is required"
            }, 400); 
        }

        const { DATABASE_URL, CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } = c.env;
        if (!DATABASE_URL) {
          return c.json({ 
            success: false,
            message: "Server configuration error"
         }, 500);
        }

        let cloudinaryFormData; 

         if (image && image instanceof Blob) {
            cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', image);
            cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            cloudinaryFormData.append('tags', 'sticker'); 
          }else {
                return c.json({
                    success: false,
                    message: 'No image file found' 
                }, 400);
          }

          const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                method: 'POST',
                body: cloudinaryFormData,
           });

          const result: { secure_url: string, public_id: string } = await response.json();
           
          if(!result.secure_url){
            return c.json({
                success: false,
                message: "Failed to uplaod sticker"
             }, 500); 
          }

          const db = createPrismaClient(DATABASE_URL); 
            
          const sticker = await db.stickers.create({
            data: {
                imageUrl: result?.secure_url,
                publicId: result?.public_id,
                categoryId: categoryId
            }
          }); 

          if(!sticker){
            return c.json({ 
                success: false,
                message: "Failed to create sticker (database)" 
            }, 500);
          }; 

          return c.json({
            success: true,
            message: "Sticker uploded successfully",
            data: sticker
          }, 200); 
        
    } catch (error) {
        return c.json({
            success: false,
            message : error instanceof Error ? error.message : "Internal server error"
        },500)
    }
}; 

const deleteSticker = async(c: Context) =>{
    try {
        const { DATABASE_URL, JWT_SECRET } = c.env;
        if (!DATABASE_URL || !JWT_SECRET) {
            return c.json({ message: "Server configuration error" }, 500);
        }
        
    } catch (error) {
        return c.json({
            message: "Failed to register",
            error : error instanceof Error ? error.message : "Internal server error"
        },500)
    }
}; 

const getStickers = async(c: Context) => {
    try {
        const { DATABASE_URL, JWT_SECRET } = c.env;
        if (!DATABASE_URL || !JWT_SECRET) {
            return c.json({ message: "Server configuration error" }, 500);
        }
        
    } catch (error) {
        return c.json({
            message: "Failed to register",
            error : error instanceof Error ? error.message : "Internal server error"
        },500)
    }
}; 

export {
    addSticker, 
    deleteSticker, 
    getStickers
}; 