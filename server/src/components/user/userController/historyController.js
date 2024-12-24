import * as historyService from '../userService/historyService.js';  

function getPurchaseHistory(req, res) {
    const { id } = req.user;
  
    if (!id) {
      return res.status(400).json({ error: 'Account ID is required' });
    }
  
    historyService
      .fetchHistoryWithQuery(Number(id))
      .then((purchaseHistory) => res.status(200).json(purchaseHistory || []))
      .catch((error) => {
        console.error('Error fetching purchase history:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      });
  }
  

export {
  getPurchaseHistory,
};