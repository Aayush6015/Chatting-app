import multer from "multer"
import fs from "fs";
import path from "path";


const dir = path.resolve('./public/temp');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/temp') // all the files will be stored in the temp file

    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const upload = multer({ storage: storage })