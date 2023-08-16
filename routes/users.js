import express from 'express'
import { _register, _login, _getTvSeriesFriends, _updateUsername, upload, _uploadPhoto, _getUserById } from '../controllers/users.js'

const urouter = express.Router()

urouter.post('/register', _register)
urouter.post('/login', _login)
urouter.get('/tvseriesfriends/:id', _getTvSeriesFriends)
urouter.put('/profile/:id/updateUsername', _updateUsername);
// urouter.post("/upload-photo", upload.single("file"), _uploadPhoto);
urouter.post('/profile/:id/uploadPhoto', upload.single('photo'), _uploadPhoto);
urouter.get('/user/:userId', _getUserById);


export default urouter