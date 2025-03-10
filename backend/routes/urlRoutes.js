const express=require('express');
const router=express.Router();
const {shortenUrl,redirectUrl,validUrl,getUrls,deleteUrl,updateUrl,getAnalytics}=require('../controllers/urlController');
const jwtProtection=require('../middleware/jwtProtection');
router.get('/valid',validUrl);
router.post('/shorten',shortenUrl);
router.get('/urls', jwtProtection, getUrls);
router.delete('/delete/:shortUrl', jwtProtection, deleteUrl);
router.get('/redirect/:shortUrl',redirectUrl);
router.put('/update/:shortUrl', jwtProtection, updateUrl);
router.get('/analytics',jwtProtection,getAnalytics);
module.exports=router;

