/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    let validBookID;
    
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'Test Title'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id', 'Response object should contain _id');
            assert.property(res.body, 'title', 'Response object should contain title');
            assert.equal(res.body.title, 'Test Title');
          
            validBookID = res.body._id;
            done();
        })
        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: ''})
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'title is required');
          done();
        })
        
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        let id = '1234';
        chai.request(server)
        .get('/api/books/' + id)
        .end(function(err, res) {
          assert.equal(res.status, 500);
          done();  
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/' + validBookID)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          assert.isArray(res.body.comments, 'comments should be an array');
          done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/' + validBookID)
        .send({comment: 'test comment'})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          assert.isArray(res.body.comments, 'comments should be an array');
          assert.include(res.body.comments, 'test comment');
          done();
        })
        
      });
      
    });

  });

});
