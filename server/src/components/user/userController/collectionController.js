import * as collectionService from '../userService/collectionService.js'

const router = express.Router();

function getUserGameCollection(req, res) {
    const { id } = req.user.id;
  
    if (!id) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
  
    collectionService
    .fetchGameCollection(Number(id))
    .then((gameCollection) => {
      return res.status(200).json(gameCollection);
    })
    .catch((error) => {
      console.error('Error retrieving game collection:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }

router.get('/profile/collection', authorize(), getUserGameCollection); 
  
export default router;