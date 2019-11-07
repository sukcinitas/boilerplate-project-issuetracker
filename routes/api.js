/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
var MongoClient = require("mongodb").MongoClient;
var expect = require("chai").expect;
var ObjectId = require("mongodb").ObjectID;
const CONNECTION_STRING = process.env.DB;
const helmet = require('helmet');

module.exports = function(app) {
  
//Lowering the risk of cross site scripting
  app.use(helmet.xssFilter());
  
//MongoDb connection pooling
  var db;
  MongoClient.connect(CONNECTION_STRING, function(err, database) {
    if (err) throw err;
    db = database;
  });
  app
    .route("/api/issues/:project")
  
//Getting all project issues by project name
    .get(async function(req, res) {
      let searchObject = req.query;
      if (searchObject.open) {searchObject.open = !!searchObject.open};
      searchObject.project_name = req.params.project;
      try {
        var result = await db.collection("issues")
                             .find(searchObject)
                             .toArray();
        console.log("Success in retrieving all project issues");
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    })

//Posting an issue
    .post(async function(req, res) {
      try {
        var project = req.params.project;
        var info = req.body;
        if(info.issue_title == ''|| info.issue_text == '' || info.created_by == '') {
          res.send("Required fields must be filled in");
          return;
        } else {
            var result = await db.collection("issues").insertOne({
            project_name: project,
            issue_title: info.issue_title,
            issue_text: info.issue_text,
            created_by: info.created_by,
            assigned_to: info.assigned_to || "",
            status_text: info.status_text || "",
            created_on: new Date(),
            updated_on: new Date(),
            open: true
          });
          console.log("Success in creating an issue");
          let issue = result.ops[0];
          delete issue.project_name;
          res.send(issue);
        }
      } catch (err) {
        console.log(err);
      }
    })

//Updating an issue  
    .put( async function(req, res) {
      try {
        var updateObject = {};
        updateObject.updated_on = new Date();
        if(req.body.issue_title) {updateObject.issue_title = req.body.issue_title};
        if(req.body.issue_text) {updateObject.issue_text = req.body.issue_text};
        if(req.body.created_by) {updateObject.created_by = req.body.created_by};
        if(req.body.assigned_to) {updateObject.assigned_to = req.body.assigned_to};
        if(req.body.status_text) {updateObject.status_text = req.body.status_text};
        if(req.body.open === false) {updateObject.open = false};
        var result = await db.collection("issues")
                             .updateOne({"_id": ObjectId(req.body._id)},
                                      {$set: updateObject},function(err, result) {
                               if(err) {res.send(`Could not update ${req.body._id}`)};
                               res.send(`Successfully updated`);
                             });
        console.log("Success in updating an issue");
      } catch (err) {
        res.send(`Could not update ${req.body._id}`);
        console.log(err);
      }
    })
  
//Deleting an issue
    .delete(async function(req, res) {
      try {
        if(!req.body._id) {res.send("_id error"); return;}
        var result = await db.collection("issues")
                             .deleteOne({_id: ObjectId(req.body._id)}, function(err, result){
                                        res.send(`Deleted ${req.body._id}`);
                                        console.log("Successful deletion attempt");
                             })

      } catch (err) {
        console.log(err);
        res.send(`Could not delete ${req.body._id}`);
      }
    });
};
