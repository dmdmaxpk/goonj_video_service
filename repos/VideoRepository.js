const mongoose = require('mongoose');
const Video = mongoose.model('Video');

class VideoRepository{

    async getViewerInterestedData (query, sort, limit) {
        return await Video.aggregate([
            { $match: query },
            { $sort: {last_modified: sort} },
            { $limit: limit }
        ]);
    }

    async getOtherHighRecommendedData (today, ids, sort, limit) {
        return await Video.aggregate([
            {
                $match: {
                    _id: {$nin: ids},
                    last_modified: {$lte: new Date(today)}
                }
            },
            { $sort: { views_count: sort, last_modified: sort }},
            { $limit: limit }
        ]);
    }
}

module.exports = VideoRepository;
