var express = require('express');
var path = require('path');

var app = express();
var port = 4000;

app.use(express.static(path.resolve(__dirname, 'public')));

app.listen(port, () => {
  console.log('Listening to port ' + port);
});