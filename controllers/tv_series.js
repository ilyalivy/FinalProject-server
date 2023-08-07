import { getAllSeries, getUserSeries, addUserSeries, deleteUserSeries } from '../models/tv_series.js'

export const _getAllSeries = async (req, res) => {
    try {
        const series = await getAllSeries();
        res.status(200).json(series);
    } 
    catch (e) {
        console.log(e);
        res.status(500).json({msg:'Something went wrong'});
    }
}

export const _getUserSeries = async (req, res) => {
    const userId = req.params.id;
    try {
        const series = await getUserSeries(userId);
        res.status(200).json(series);
    } 
    catch (e) {
        console.log(e);
        res.status(500).json({msg:'Something went wrong'});
    }
}

export const _addUserSeries = async (req, res) => {
    const userId = req.params.id;
    const seriesId = req.body.seriesId;
    try {
        await addUserSeries(userId, seriesId);
        res.status(200).json({msg:'Series added to profile'});
    } 
    catch (e) {
        console.log(e);
        res.status(500).json({msg:'Something went wrong'});
    }
}

export const _deleteUserSeries = async (req, res) => {
    // console.log(req.params);
    const userId = req.params.id;
    const seriesId = req.params.seriesId;
    // console.log("Deleting series with ID: ", seriesId, " for user with ID: ", userId);
    try {
        await deleteUserSeries(userId, seriesId);
        res.status(200).json({msg:'Series removed from profile'});
    } 
    catch (e) {
        console.log(e);
        res.status(500).json({msg:'Something went wrong on DELETE'});
    }
}