import express from 'express'
import { _getAllSeries, _getUserSeries, _addUserSeries, _deleteUserSeries } from '../controllers/tv_series.js'

const tvrouter = express.Router()

tvrouter.get('/tv_series', _getAllSeries)
tvrouter.get('/profile/:id/tv_series', _getUserSeries)
tvrouter.post('/profile/:id/tv_series', _addUserSeries)
tvrouter.delete('/profile/:id/tv_series/:seriesId', _deleteUserSeries)


export default tvrouter
