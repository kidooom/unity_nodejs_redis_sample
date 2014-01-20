var redis = require('redis');
var redis_cli = redis.createClient();
var _ = require('underscore');

var scoresKey = 'niwatori_scores';

exports.getScore = function(req, res){
  var highScores = '';
  redis_cli.lrange(scoresKey, 0, -1, function(err, scores){
    if (err) {
      console.log(err);
    }
    
    scores = _.sortBy(scores, function(num){
      return -parseInt(num, 10);
    });    
    
    var rank = 1;
    _.each(_.first(scores, 5), function(score){
      highScores = highScores + rank + '位:' + score + '\n';
      rank += 1;
    });
    
    console.log('getScore called! ' + highScores);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write(highScores, 'utf8');    
    res.end();
  });
};

exports.postScore = function(req, res){
  redis_cli.lpush(scoresKey, req.body.score);
  
  console.log('postScore called!');
  res.send('post score success!');
};