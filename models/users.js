import { db } from '../config/db.js'

export const register = (email, password) => {
    return db('users')
    .insert({email, password})
    .returning(['id','email'])
}

export const login = (email) => {
    return db('users')
    .select('id','email','password', 'username', 'photo')
    .where({email})
}

export const getTvSeriesFriends = (userId) => {
    return db.raw(`
      SELECT u2.id, u2.username, u2.photo, u2.email, COUNT(*) as matching_series
      FROM user_tv_series us1
      JOIN user_tv_series us2 ON us1.tv_series_id = us2.tv_series_id
      JOIN users u2 ON us2.user_id = u2.id
      WHERE us1.user_id = ? AND u2.id != ?
      GROUP BY u2.id
      HAVING COUNT(*) >= 2
      ORDER BY COUNT(*) DESC;
    `, [userId, userId]);
}

export const updateUsername = (id, username) => {
  return db('users').where({ id }).update({ username });
}

export const updateUserPhoto = (id, photoUrl) => {
  return db('users').where({ id }).update({ photo: photoUrl });
}

export const getUserById = (id) => {
  return db('users')
  .select('id','email', 'username', 'photo')
  .where({id})
}