import * as reviewService from '../userService/reviewService.js'

function getUserReview(req,res) {
    const { id } = req.user.id;

    if (!id) {
        return res.status(400).json({ error: 'Account ID is required' });
    }

    reviewService
        .fetchUserReview(Number(id))
        .then((reviews) => {
            return res.status(200).json(reviews);
        })
        .catch((error) => {
            console.error('Error retrieving reviews:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        })
};