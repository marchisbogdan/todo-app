const express = require('express');
const router = express.Router();
// var todos = require('../models/todos');
// router.get('/',function (req,res) {
//   res.render('todos',{title:'Todos',todos:todos})
// });
var Todo = require('../../models/todos');
router.get('/', function(req, res, next) {
  // Sync
  // Todo.find(function(err,todos){
  //   if(err){
  //     return console.error(err);
  //   }
  //   res.render('todos',{title: 'Todos', todos:todos});
  // });

  // Async
  Todo.findAsync({}, null, {
      sort: {
        "_id": 1
      }
    })
    .then(function(todos) {
      res.render('todos', {
        title: 'Todos',
        todos: todos
      });
    })
    .catch(next)
    .error(console.error);
});

module.exports = router;
