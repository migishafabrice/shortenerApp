const express = require('express');
const db = require('../config/db');
const axios = require('axios');
const crypto = require('crypto');
const base = require('base62');
const { get } = require('http');
const validUrl = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.head(url, { timeout: 5000 });
    const isReachable = response.status >= 200 && response.status < 400;
    return res.json({ message: 'Valid URL', status: true });
  } catch (error) {
    return res.status(400).json({ message: url + " is not valid.", status: false });
  }
};

const generateUrl = async (url) => {
  const { nanoid } = await import('nanoid');
  const randomId = nanoid(6);
  const newUrl = randomId + "." + url;
  const hash = crypto.createHash('sha256');
  hash.update(newUrl);
  const hashedUrl = hash.digest('hex');
  const shortUrl = "sh.ly/" + hashedUrl.substring(0,6);
  return shortUrl;
};
const checkUrlUnique = async (url, shortUrl) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM urls WHERE short_code = ?", [shortUrl], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const shortenUrl = async (req, res) => {
  const { url, userid } = req.body;

  if (!url || !userid) {
    return res.status(400).json({ error: "URL and UserID are required" });
  }

  let shortUrl;
  let isUnique = false;

  while (!isUnique) {
    shortUrl = await generateUrl(url);

    const result = await checkUrlUnique(url, shortUrl);

    if (result.length === 0) {
      isUnique = true;
    }
  }

  db.query(
    "INSERT INTO urls (userid, short_code, long_url, clicks) VALUES (?, ?, ?, ?)",
    [userid, shortUrl, url, 0],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Error inserting URL data into database" });
      }
      res.json({ ok: true, result: { short_code: shortUrl } });
    }
  );
  
}
  

const getUrls=async (req,res)=>{
  const {userid}=req.user;
  db.query("select * from urls where userid=?",[userid],(err,result)=>{
    if(err){
      return res.status(500).json({error:err.message});
    }
    res.json({ok:true,urls:result});
  });
}
const deleteUrl = async (req, res) => {
  const { shortUrl } = req.params; // Use req.params, not req.body

  if (!shortUrl) {
    return res.status(400).json({ error: "Short URL is required." });
  }
  db.query("DELETE FROM urls WHERE short_code = ?", [shortUrl], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Deletion failed." });
    }
    res.json({ ok: true, message: "URL deleted successfully." });
  });
};
const redirectUrl=async (req,res)=>{
  const {shortUrl}=req.params;
  db.query("select * from urls where short_code=?",[shortUrl],(err,result)=>{
    if(err){
      return res.status(500).json({error:err.message});
    }
    if(result.length===0){
      return res.status(404).json({error:"URL not found"});
    }
    else
    {
      const clicks=result[0].clicks+1;
      db.query("update urls set clicks=? where short_code=?",[clicks,shortUrl],(err)=>{
        if(err){
          return res.status(500).json({error:err.message});
        }
      });
    }
    const longUrl=result[0].long_url;
    res.json({ok:true,long_url:longUrl});
  });
}
const updateUrl = async (req, res) => {
  const { shortUrl } = req.params;
  const { long_url } = req.body; // Expect long_url instead of newUrl
  db.query(
    "UPDATE urls SET long_url = ? WHERE short_code = ?",
    [long_url, shortUrl], // Use long_url here
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Update failed" });
      }
      res.json({ ok: true, message: "URL updated successfully" });
    }
  );
};
const getAnalytics = async (req, res) => {
  const { userid } = req.user;
  db.query(
    `SELECT 
    COALESCE(SUM(urls.clicks), 0) AS totalClicks, 
    COALESCE(COUNT(urls.id), 0) AS totalUrls, 
    users.visits AS totalVisits
 FROM users
 LEFT JOIN urls ON users.id = urls.userid 
 WHERE users.id = ?
 GROUP BY users.id, users.visits`,
[userid],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error:"Error fetching analytics data" });
      }
  
      // Check if a result is returned
      if (result.length === 0) {
        return res.status(404).json({ error: "No data found for the given user." });
      }
      // Return the result
      const {totalClicks, totalUrls, totalVisits} = result[0];
      res.json({
        ok: true,
        totalClicks: totalClicks || 0,
        totalUrls: totalUrls || 0,
        totalVisits: totalVisits || 0,
      });
      
    }
  );
  
}
module.exports = { validUrl, shortenUrl,getUrls,deleteUrl,redirectUrl,updateUrl,getAnalytics };
