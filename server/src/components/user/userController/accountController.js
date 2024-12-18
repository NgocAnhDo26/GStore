import * as accountService from '../userService/accountService.js';

const router = express.Router();

function getUserInfo(req, res) {
  try {
    const { id } = req.user.id;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const userInfo = accountService.fetchAccountByID(Number(id));
    if (!userInfo) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

function updateUserInfo(req, res) {
  const { id } = req.user.id;
  const { name, birthdate, phone} = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Account ID is required' });
  }

  accountService
    .updateAccountByID(Number(id),name,birthdate,phone)
    .then((updatedUserInfo) => {
      if (!updatedUserInfo) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(updateUserInfo);
    })
    .catch((error) => {
      console.error('Error updating user info:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
}

router.get('/profile/info',authorize(), getUserInfo); 
router.post('/profile/info',authorize(), updateUserInfo); 

export default router;
