import { db } from '../config/db.js'

export const getAllSeries = () => {
    return db('tv_series').select('*')
}

export const getUserSeries = (userId) => {
    return db('user_tv_series')
        .join('tv_series', 'user_tv_series.tv_series_id', 'tv_series.id')
        .where('user_tv_series.user_id', userId)
        .select('tv_series.title', 'tv_series.image', 'tv_series.id');
}

export const addUserSeries = (userId, seriesId) => {
    return db('user_tv_series').insert({user_id: userId, tv_series_id: seriesId});
}

export const deleteUserSeries = (userId, seriesId) => {
    return db('user_tv_series')
        .where({
            user_id: userId,
            tv_series_id: seriesId
        })
        .del();
}
