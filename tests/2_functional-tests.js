/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var {assert} = require('chai');
var server = require('../server');
var ObjectId = require("mongodb").ObjectID;

chai.use(chaiHttp);

suite('Functional Tests', function() {
 let issue;  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          project_name: 'test',
          issue_title: 'Title',
          issue_text: 'Text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          issue = res.body;
          assert.equal(res.status, 200, "response status should be 200");
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'Text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          //fill me in too!
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'Text',
          created_by: 'Functional Test - Required fields filled in'
        })
        .end(function(err, res){
          assert.equal(res.status, 200, "response status should be 200");
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'Text');
          assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          //fill me in too!
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: 'Functional Test - Missing required fields'
        })
        .end(function(err, res){
          assert.equal(res.status, 200, "response status should be 200");
          assert.equal(res.text, "Required fields must be filled in");
          //fill me in too!
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .end(function(err, res){
          assert.equal(res.status, 200, "should be response status");
          //fill me in too!
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .type('form')
        .send({_id: issue._id, open: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, `Successfully updated`);
          //fill me in too!
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .type('form')
        .send({_id: issue._id, open: true, issue_title: "TestUpdate"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, `Successfully updated`);
          //fill me in too!
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test?open=true')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].open, true);
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test?open=true&issue_text=Text')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].open, true);
          assert.equal(res.body[0].issue_text, 'Text');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, `_id error`);
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: ObjectId(issue._id)})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, `Deleted ${issue._id}`)
          done();
        });
      });
      
    });

});
