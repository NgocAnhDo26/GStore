import * as accountService from '../userService/accountService.js';
import { authorize } from '../../auth/verifyRoute.js';  
import express from 'express';
const router = express.Router();

async function getUserInfo(req, res) {
  try {
    const { id } = req.user;
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

async function updateUserInfo(req, res) {
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

router.get('/',authorize() ,getUserInfo); 
router.post('/',authorize(), updateUserInfo); 

export default router;
