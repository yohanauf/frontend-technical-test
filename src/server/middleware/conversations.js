const path = require('path');
const fs = require('fs');
// Need this middleware to catch some requests
// and return both conversations where userId is sender or recipient
module.exports = (req, res, next) => {
  fs.readFile(`${path.dirname(__filename)}/../db.json`, 'utf8', (error, data) => {
    if (error) {
      console.log(error);
      return;
    }

    if (/conversations/.test(req.url) && req.method === 'GET') {
      const userId = req.query?.senderId;
      const result = JSON.parse(data)?.conversations?.filter(
        conv => conv.senderId == userId || conv.recipientId == userId,
      );

      res.status(200).json(result);
      return;
    }

    next();
  });
};
