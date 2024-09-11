import { Context } from "hono";
import { createPrismaClient } from "../config/database";
import generateCloudinarySignature from "../utilities/cloudinary/generateCloudinarySignature";


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
        const public_id = c.req.param('public_id');
        if(!public_id){
            return c.json({
                success: false, 
                message: "public_id is required"
            }, 400);
        }; 

        const sticker_id = c.req.param('sticker_id');
        if(!sticker_id){
            return c.json({
                success: false, 
                message: "sticker_id is required"
            }, 400);
        }; 

        const { DATABASE_URL, CLOUDINARY_DELETE_URL, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = c.env;
        if (!DATABASE_URL || !CLOUDINARY_DELETE_URL || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET ) {
            return c.json({ 
                success: false,    
                message: "Server configuration error" 
            }, 500);
        }

        const timestamp = Math.floor(Date.now() / 1000).toString();
        const signature = await generateCloudinarySignature(public_id, timestamp, CLOUDINARY_API_SECRET);

        const formData = new FormData();
        formData.append('public_id', public_id);
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', CLOUDINARY_API_KEY);
        formData.append('signature', signature);


        const response = await fetch(CLOUDINARY_DELETE_URL, {
            method: 'POST',
            body: formData
        });

        const result: any = await response.json();

        if (result.result !== "ok") {
            return c.json({
                success: false, 
                message: "Failed to delete sticker (from Cloudinary)",
                error: result.error ? result.error.message : "Unknown error"
            }, 500);
        }

        const db = createPrismaClient(DATABASE_URL);

        const sticker = await db.stickers.delete({
            where: {
                id: sticker_id
            }
        }); 

        if(!sticker){
            return c.json({
                success: false, 
                message: "Failed to delete sticker"
            }, 500);
        }

        return c.json({
            success: true,
            message: "Sticker deleted successfully",
            data: sticker
        },200)

    } catch (error) {
        return c.json({
            message: "Failed to register",
            error : error instanceof Error ? error.message : "Internal server error"
        },500)
    }
}; 

export {
    addSticker, 
    deleteSticker
}; 