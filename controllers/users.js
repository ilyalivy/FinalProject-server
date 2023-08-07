import { register, login, getTvSeriesFriends, updateUsername, updateUserPhoto, getUserById } from '../models/users.js'
import bcrypt from 'bcrypt'
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

export const upload = multer({ storage: storage });

export const _uploadPhoto = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No files were uploaded.' });
    }

    const photoUrl = `http://localhost:3030/uploads/${req.file.filename}`;
    await updateUserPhoto(req.params.id, photoUrl);
    res.json({ photo: photoUrl });
}

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
