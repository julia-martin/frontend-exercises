var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");
var _ = require("underscore");

var photos = JSON.parse(fs.readFileSync(path.resolve(path.dirname(__dirname), "data/photos.json"), "utf8"));

function updateProperty(idx, param) {
  let photo = _.findWhere(photos, { id: idx });
  photo[param]++;

  return photo[param];
}

router.get('/photos', function(req, res, next) {
  res.json(photos);
});

router.post("/photos/like", function(req, res) {
  let photo_id = +req.body.photo_id;
  let likes = updateProperty(photo_id, "likes");

  res.json({ "total": likes });
});

router.post("/photos/favorite", function(req, res) {
  let photo_id = +req.body.photo_id;
  let favorites = updateProperty(photo_id, "favorites");

  res.json({ "total": favorites });
});

module.exports = router;
