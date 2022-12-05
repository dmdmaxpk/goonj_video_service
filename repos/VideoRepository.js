const mongoose = require('mongoose');
const Video = mongoose.model('Video');

class VideoRepository{

    async getViewerInterestedDataPrevious (query, a_sort, b_sort, limit) {
        return await Video.aggregate([
            { $match: query },
            { $sort: {last_modified: a_sort} },
            { $limit: limit },
            { $sort: {last_modified: b_sort} }
        ]);
    }

    async getViewerInterestedDataNext (query, sort, limit) {
        return await Video.aggregate([
            { $match: query },
            { $sort: {last_modified: sort} },
            { $limit: limit }
        ]);
    }

    async getOtherHighRecommendedData (query, today, ids, sort, limit) {
        query._id = {$nin: ids};
        query.last_modified = {$lte: new Date(today)};

        return await Video.aggregate([
            { $match: query },
            { $sort: { views_count: sort, last_modified: sort }},
            { $limit: limit }
        ]);
    }
}

module.exports = VideoRepository;
