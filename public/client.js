$(function() {
  $('#commenttest').submit(function() {
    let id = $('#idtest').val();
    $('#commenttest').attr('action', '/api/books/' + id);
  })
  
  let books = [];
  
  $.getJSON('/api/books', function(data) {
    if (data.length > 0) {
      books = data;
      let dataString = '';
    
      $.each(data, function(i, val) {
        dataString+= '<li id="' + val._id + '">' + val.title + ' - ' + val.comments.length + ' comments</li>';
        return (i !== 9);
      })
    
      $('#bookList').html(dataString);
      if (data.length > 10) {
        $('#extra').text('...and ' + (data.length - 10) + ' more!');
      }
    }
    
  })
  
  $('#bookList').on('click', 'li', function() {
    let id = this.id;
    $.each(books, function(i, val) {
      if (val._id == id) {
        $('#bookDetail').html('<p id="detailTitle"><strong>' + val.title + '</strong> (' + val._id + ')</p><div id="commentList"></div>');
        let listItems = '';
        $.each(val.comments, function(i, comment) {
          listItems+= '<li>' + comment + '</li>';
        })
        $('<ol />', {
          id: 'detailComments',
          html: listItems
        }).appendTo('#commentList');
        
        let innerDiv = '<form id="commentForm"><input type="text" id="newComment" name="comment"/></form><br><button id="addComment">Add Comment</button><button id="deleteBook">Delete</button>'
        $('<div />', {
          html: innerDiv
        }).appendTo('#bookDetail');
        
        $('#deleteBook').on('click', function() {
          $.ajax({
            url: '/api/books/' + id,
            method: 'delete',
            dataType: 'text',
            success: function(data) {
              document.getElementById(id).remove();
              $.each(books, function(i, val) {
                if (val._id == id) {
                  books.splice(i, 1);
                  return false;
                }
              })
              countCheck('delete');
            }
          })
        })
        
        $('#addComment').on('click', function() {
          console.log('hello');
          $.ajax({
            url: '/api/books/' + id,
            method: 'post',
            dataType: 'json',
            data: $('#commentForm').serialize(),
            success: function(data) {
              $.each(books, function(i, val) {
                if (val._id == id) {
                  val.comments.push(data.comments[data.comments.length - 1]);
                  return false;
                }
              })
              let newLi = document.createElement('LI');
              newLi.innerText = data.comments[data.comments.length - 1];
              document.getElementById('detailComments').appendChild(newLi);
              document.getElementById(id).innerText = data.title + ' - ' + data.comments.length + ' comments';
            }
          })
        })
        return false;
      }  
    })
  })
  
  $('#newBookForm').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      url: '/api/books',
      method: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        books.push(data);
        countCheck('add');
      }
    })
  })
  
  $('#deleteAllBooks').on('click', function() {
    $.ajax({
      url: '/api/books',
      method: 'delete',
      dataType: 'json',
      success: function(data) {
        if (data.message) {
          $('#bookDetail').html('<p id="detailTitle">Could not delete</p><ol id="detailComments"></ol>');
        } else {
          books = [];
          $('#bookList').html('');
          $('#extra').html('');
          $('#bookDetail').html('<p id="detailTitle">All books sucessfully deleted</p><ol id="detailComments"></ol>');
        }
      }
    })
  })
  
  function countCheck(type) {
    if (type == 'delete') {
      if (books.length > 10) {
        $('#extra').text('...and ' + (books.length - 10) + ' more!');
      } else if (books.length === 10) {
        $('#extra').text('');
      }
      $('#bookDetail').html('<p id="detailTitle">Sucessfully Deleted</p><ol id="detailComments"></ol>');
    } else {
      if (books.length > 10) {
        $('#extra').text('...and ' + (books.length - 10) + ' more!');
      } else {
        let newBook = books[books.length - 1];
        let newLI = document.createElement('LI');
        newLI.innerText = newBook.title + ' - 0 comments';
        newLI.id = newBook._id;
        document.getElementById('bookList').appendChild(newLI);
        document.getElementById('bookTitleToAdd').value = '';
      }
    }
  }
  
})
