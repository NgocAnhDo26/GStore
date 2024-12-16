import * as accountService from '../userService/accountService.js';

async function getUserInfo(req, res) {
  try {
    const { id } = req.user.id;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const userInfo = await accountService.fetchAccountByID(Number(id));

    if (!userInfo) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export { getUserInfo };
