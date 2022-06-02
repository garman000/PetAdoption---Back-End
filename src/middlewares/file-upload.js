import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary';

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}


const fileUpload = multer({

// limits: 500000,
storage: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/images')
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, uuidv4() + '.' + ext )
    }
}),



});


export default fileUpload;