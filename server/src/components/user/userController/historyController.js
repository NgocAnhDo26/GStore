import * as historyService from '../userService/historyService.js' 

const router = express.Router();

function getPurchaseHistory(req, res) {
    const { id } = req.user.id;
  
    if (!id) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
  
    historyService
      .fetchPurchaseHistory(Number(id))
      .then((purchaseHistory) => {
        return res.status(200).json(purchaseHistory || []);
      })
      .catch((error) => {
        console.error('Error fetching purchase history:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      });
  }
  
  router.get('/profile/history', authorize(), getPurchaseHistory);

  export default router;