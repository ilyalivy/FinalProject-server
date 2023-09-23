import { register, login, getTvSeriesFriends, updateUsername, updateUserPhoto, getUserById } from '../models/users.js'
import bcrypt from 'bcrypt'
import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from "../config/aws.s3.config.js";
import path from 'path';
// import { fileURLToPath } from 'url';
import dotenv from "dotenv";
dotenv.config();

// const __dirname = path.dirname(fileURLToPath(import.meta.url));


export const _register = async (req, res) => {
    const {email, password} = req.body

    const lower_email = email.toLowerCase()

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password + '', salt)

    try {
        const row = await register(lower_email,hash)
        res.status(200).json(row)
    } 
    catch (e) {
        console.log(e);
        res.status(404).json({msg:'User already exist'})
    }  
} 

export const _login = async (req, res) => {
    try {
        const row = await login(req.body.email.toLowerCase())

        if(row.length === 0) 
            return res.status(404).json({msg:'Email not found'})

        const match = await bcrypt.compare(req.body.password + '', row[0].password)
        if(!match) return res.status(400).json({msg:'Password is incorrect'})

        res.status(200).json(row)

    } catch (e) {
        console.log(e);
        res.status(404).json({msg:'Something went wrong'})
    }
}

export const _getTvSeriesFriends = async (req, res) => {
    try {
      const friends = await getTvSeriesFriends(req.params.id);
      res.status(200).json(friends);
    } catch (e) {
      console.log(e);
      res.status(500).json({msg:'Something went wrong'});
    }
}

export const _updateUsername = async (req, res) => {
    try {
      await updateUsername(req.params.id, req.body.username);
      res.status(200).json({ msg: "Telegram username updated successfully." });
    } catch (e) {
      console.log(e);
      res.status(500).json({ msg: "Failed to update Telegram username." });
    }
}


export const upload = multer({
    storage: multerS3({
      s3,
      acl: "public-read",
      bucket: process.env.AWS_BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
        cb(null, `${fileName}${path.extname(file.originalname)}`);
      },
    }),
  });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '..', 'uploads'));
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// export const upload = multer({ storage: storage });



export const _uploadPhoto = async (req, res) => {
    // req.file contains a file object
    try {
      const row = await updateUserPhoto(req.file,req.params.id);
      res.json(row);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// export const _uploadPhoto = async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ msg: 'No files were uploaded.' });
//     }

//     const photoUrl = `http://localhost:3030/uploads/${req.file.filename}`;
//     await updateUserPhoto(req.params.id, photoUrl);
//     res.json({ photo: photoUrl });
// }

export const _getUserById = async (req, res) => {
    try {
        const row = await getUserById(req.params.userId);
        if(row.length === 0) 
            return res.status(404).json({msg:'User not found'});
        res.status(200).json(row);
    } catch (e) {
        console.log(e);
        res.status(500).json({msg:'Something went wrong'});
    }
}
