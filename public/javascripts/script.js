//var $ = require('jquery');
//var todoTemplate = require("../../views/partials/todo.hbs");

$(function() {
  // $('input').on('click', function() {
  //   $(this.nextElementSibling).toggleClass('checked');
  // });
  $("ul").on('change', 'li :checkbox', function() {
    var $this = $(this);
    var $input = $(this)[0];
    var $li = $this.parent();
    var id = $li.attr('id');
    var checked = $input.checked;
    var data = {
      done: checked
    };
    updateTodo(id, data, function(d) {
      $this.next().toggleClass("checked");
    });
  });

  $('ul').on('keydown', 'li span', function(event) {
    var $this = $(this);
    var $span = $this[0];
    var $li = $this.parent();
    var id = $li.attr('id');
    var key = event.keyCode;
    var target = event.target;
    var text = $span.innerHTML;
    var data = {
      text: text
    };
    $this.addClass('editing');
    if (key === 27) { //escape key
      $this.removeClass('editing');
      document.execCommand('undo');
      target.blur();
    } else if (key === 13) { //enter key
      console.log("text:" + text);
      if (text === "") {
        $this.removeClass('editing');
        document.execCommand('undo');
        target.blur();
      } else {
        updateTodo(id, data, function(d) {
          $this.removeClass("editing");
          target.blur();
        });
        event.preventDefault();
      }
    }
  });


  $('ul').on('click', 'li a', function() {
    var $this = $(this);
    var $input = $this[0];
    var $li = $this.parent();
    var id = $li.attr('id');
    deleteTodo(id, function(e) {
      deleteTodoLi($li);
    });
  });

  $(':button').on('click', addTodo);

  $(':text').on('keypress', function(e) {
    var key = e.keyCode;
    if (key == 13 || key == 169) { // triggers when return key is pressed
      addTodo();
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  // initialize the observer for counting the todos
  initTodoObserver();

  // set event handlers for the footer filtering options
  $('.filter').on('click', '.show-all', () => {
    $('.hide').removeClass('hide');
  });
  $('.filter').on('click', '.show-not-done', () => {
    $('.hide').removeClass('hide');
    $('.checked').closest('li').addClass('hide');
  });
  $('.filter').on('click', '.show-done', () => {
    $('li').addClass('hide');
    $('.checked').closest('li').removeClass('hide');
  });

  // set event handler for the clear option, which will remove every todo
  // with status as done
  $(".clear").on('click', () => {
    var $doneLi = $('.checked').closest('li');
    for (var i = 0; i < $doneLi.length; i++) {
      var $li = $($doneLi[i]); // you get a li out, and still need to convert into $li
      var id = $li.attr('id');
      (function($li) {
        deletedTodo(id, function() {
          deleteTodoLi($li);
        })($li);
      })
    }
  });
});

var addTodo = function() {
  var text = $('#add-todo-text').val();
  if (text !== '') {
    $.ajax({
      url: '/api/todos',
      type: 'POST',
      data: {
        text: text
      },
      dataType: 'json',
      success: function(data) {
          var todo = data.todo;
          var newLiHtml = '<li><input type="checkbox"><span>' + todo + '</span></li>';
          $('form + ul').append(newLiHtml);
          $('#add-todo-text').val('');
        }
        // success: function(data) {
        //   var todo = data.todo;
        //   var newLiHtml = todoTemplate(todo);
        //   $('form + ul').append(newLiHtml);
        //   $('#add-todo-text').val('');
        // }
    });
  }
};

var updateTodo = function(id, data, callback) {
  $.ajax({
    url: '/api/todos/' + id,
    type: 'PUT',
    data: data,
    dataType: 'json',
    success: function(data) {
      callback();
    }
  });
};

var deleteTodo = function(id, callback) {
  $.ajax({
    url: '/api/todos/' + id,
    type: 'DELETE',
    data: {
      id: id
    },
    dataType: 'json',
    success: function(data) {
      callback();
    }
  });
};

var deleteTodoLi = function($li) {
  $li.remove();
};

var initTodoObserver = () => {
  var target = $('ul')[0];
  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };
  var observer = new MutationObserver(function(mutationRecords) {
    $.each(mutationRecords, (index, mutationRecord) => {
      updateTodoCount();
    });
  });
  observer.observe(target, config);
  updateTodoCount();
}

var updateTodoCount = () => {
  $('.count').text($('li').length);
};
