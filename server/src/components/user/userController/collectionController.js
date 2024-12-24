import * as collectionService from '../userService/collectionService.js';

async function getUserGameCollection(req, res) {
    const { id } = req.user;
  
    if (!id) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
  
    collectionService
    .fetchGameCollectionWithQuery(Number(id),req.query)
    .then((gameCollection) => res.status(200).json(gameCollection))
    .catch((error) => {
      console.error('Error retrieving game collection:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
  
export {
  getUserGameCollection
};