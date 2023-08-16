import { db } from '../config/db.js'

export const register = (email, password) => {
    return db('users')
    .insert({email, password})
    .returning(['id','email'])
}

export const login = (email) => {
    return db('users')
    // .select('id','email','password', 'username', 'photo')
  .select('users.id','users.email', 'users.username', 'uploads.location', 'users.password')
  .leftJoin('uploads', 'users.photo','=','uploads.id')
    .where({email})
}

export const getTvSeriesFriends = (userId) => {
    return db.raw(`
      SELECT u2.id, u2.username, up.location photo, u2.email, COUNT(*) as matching_series
      FROM user_tv_series us1
      JOIN user_tv_series us2 ON us1.tv_series_id = us2.tv_series_id
      JOIN users u2 ON us2.user_id = u2.id
      LEFT JOIN uploads up on u2.photo=up.id
      WHERE us1.user_id = ? AND u2.id != ?
      GROUP BY u2.id, up.location
      HAVING COUNT(*) >= 2
      ORDER BY COUNT(*) DESC;
    `, [userId, userId]);
}

export const updateUsername = (id, username) => {
  return db('users').where({ id }).update({ username });
}




// export const updateUserPhoto = async (file,userid) => {
//   const { key, mimetype, location, originalname } = file;
//   const imgage =  await db("uploads").insert({ key, mimetype, location, originalname }, [
//     "id",
//     "key",
//     "mimetype",
//     "location",
//     "originalname",
//   ]);
// };

// image[0].id


export const updateUserPhoto = async (file, userid) => {
  try {
      const { key, mimetype, location, originalname } = file;
      const image = await db("uploads").insert(
          { key, mimetype, location, originalname },
          ["id", "key", "mimetype", "location", "originalname"]
      );

      const imageId = image[0].id;

       
        await db("users").where({ id: userid }).update({ photo: imageId });

        return {imageId,location};

  } catch (error) {
      console.log("Error updating user photo:", error);
  }
};



// export const updateUserPhoto = (id, photoUrl) => {
//   return db('users').where({ id }).update({ photo: photoUrl });
// }





export const getUserById = (id) => {
  return db('users')
  .select('users.id','users.email', 'users.username', 'uploads.location')
  .leftJoin('uploads', 'users.photo','=','uploads.id')
  .where({'users.id':id})
}