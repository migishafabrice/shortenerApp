const express=require('express');
const router=express.Router();
const {shortenUrl,redirectUrl,validUrl,getUrls,deleteUrl}=require('../controllers/urlController');
const jwtProtection=require('../middleware/jwtProtection');
router.get('/valid',validUrl);
router.post('/shorten',shortenUrl);
router.get('/urls', jwtProtection, getUrls);
router.delete('/delete/:shortUrl', jwtProtection, deleteUrl);
module.exports=router;

