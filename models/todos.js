// var todos= [
//   'buy flight tickets',
//   'book a hotel room',
//   'pack your bags',
//   'add flip flops'
// ];
//
// module.exports = todos;
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);
var TodoSchema = new Schema({
  text: {type: 'String', required: true},
  done: {type: 'Boolean'}
});
var Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;
