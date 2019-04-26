'use strict'

const getDb = require('../db.js').getDb;
const ObjectID = require('mongodb').ObjectID;

module.exports = function(app) {
  app.route('/api/books')
    .get((req, res) => {
    let db = getDb();
    db.collection('Books').find().toArray((err, arr) => {
      if (err) {return res.status(500).json({message: err.message})}
      res.json(arr);
    })
  })
    .post((req, res) => {
    let db = getDb();
    if (!req.body.title) {
      return res.status(400).json({message: 'title is required'});
    }
    db.collection('Books').insertOne({_id: new ObjectID(), title: req.body.title, comments: [], commentcount: 0}, (err, doc) => {
      if (err) {return res.status(500).json({message: err.message})}
      res.json({title: doc.ops[0].title, _id: doc.ops[0]._id});
    })
    
  })
    .delete((req, res) => {
    let db = getDb();
    db.collection('Books').deleteMany({}, (err, response) => {
      if (err) {return res.status(500).json({message: err.message})}
      if (response.acknowledged) {
        res.send('complete delete successful');
      } else {
        res.json({message: 'could not delete'});
      }
    })
  })
  
  app.route('/api/books/:bookID')
    .get((req, res) => {
    let db = getDb();
    let id = req.params.bookID;
    try {
      ObjectID(id);
    } catch(e) {
      console.log(e);
    }
    db.collection('Books').findOne({_id: ObjectID(id)}, {commentcount: 0}, (err, doc) => {
      console.log(err);
      console.log(doc);
      if (err) {return console.log(err); res.status(500).json({message: err.message})}
      if (doc) {
        res.json(doc);
      } else {
        res.json({message: 'could not locate book with id: ' + id});
      }
    })
  })
    .post((req, res) => {
    let db = getDb();
    let id = req.params.bookID;
    if (!req.body.comment) {
      return res.status(400).json({message: 'comment required'});
    }
    db.collection('Books').findOneAndUpdate({_id: ObjectID(id)}, {$push: {comments: req.body.comment}, $inc: {commentcount: 1}}, 
                                            {projection: {commentcount: 0}, returnOriginal: false}, (err, doc) => {
      if (err) {return res.status(500).json({message: err.message})}
      if (doc.value) {
        res.json(doc.value);
      } else {
        res.json({message: 'could not find book with id: ' + id});
      }
    })
  })
    .delete((req, res) => {
    let db = getDb();
    let id = req.params.bookID;
    db.collection('Books').findOneAndDelete({_id: ObjectID(id)}, (err, doc) => {
      if (err) {return res.status(500).json({message: err.message})}
      if (doc) {
        res.send('complete delete successful');
      } else {
        res.json({message: 'could not delete ' + id})
      }
    })
  })
}
