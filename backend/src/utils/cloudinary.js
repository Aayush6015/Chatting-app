import 'dotenv/config'
import {v2 as cloudinary} from 'cloudinary'
import fs from "fs" // fs - file system
//  fs will be used for removing the file from the local system after succcessfully uploading to cloudinary

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
}) // connecting with cloudinary

const uploadOnCloud = async(localFilePath) => {
    try {
        if(!localFilePath) return null;
        const response  = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        console.log(`profile picture uploaded successfully on cloudinary`);
        fs.unlinkSync(localFilePath) // yeh toh hona hee chahiye - remove the locally saved temp file as the upload operation failed
        return response;

    } catch (error) {
        console.log(`Unable to upload to cloudinary`,error.message)
        fs.unlinkSync(localFilePath) // yeh toh hona hee chahiye - remove the locally saved temp file as the upload operation failed
        return null;


    }
}

export {uploadOnCloud}
