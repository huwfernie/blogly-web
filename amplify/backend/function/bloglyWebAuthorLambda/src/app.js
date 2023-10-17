/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const express = require('express');

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const sThreeMove = require('./sThree');

let tableName = "blogTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// /********************************
//  * HTTP Get method - LIST ALL ITEMS ASSOCIATED WITH A SPECIFIC USER ID *
//  ********************************/
app.get("/author/:authorId", async function (req, res) {
  try {
    const queryParams = {
      TableName: tableName,
      IndexName: "authorId-index",
      KeyConditionExpression: 'authorId = :author_id',
      ExpressionAttributeValues: {
        ':author_id': req.params.authorId
      }
    }

    const data = await ddbDocClient.send(new QueryCommand(queryParams));
    res.json(data.Items);
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: 'Could not load items: ' + err.message });
  }
});

// /********************************
//  * HTTP Put method - PLACEHOLDER - MOVE A BLOG FROM PUBLIC TO PROTECTED AND BACK *
//  ********************************/
app.put("/author/:blogId", async function (req, res) {
  try {
    let progress = "__1,";
    const blogId = req.params.blogId;
    const userIdentityId = req.body.userIdentityId || "one";
    const currentStatus = req.body.currentStatus || "one";

    progress += "2,";
    
    /**
     * If blog was private
     *      move it from bloglyweb40a6XXX-dev / protected / ${userIdentityId} / blogId / blog.txt
     *      ... to :: bloglyweb40a6XXX-dev / public / blogId / blog.txt
    */
   
   if (currentStatus === "public") {
      progress += "3a,";
      const _old = `public/${blogId}`;
      const _new = `protected/${userIdentityId}/${blogId}`;
      sThreeMove(_old, _new);
    } else if (currentStatus === "protected") {
      progress += "3b,";
      const _old = `protected/${userIdentityId}/${blogId}`;
      const _new = `public/${blogId}`;
      sThreeMove(_old, _new);
    }
    progress += "4";

    const data = {
      message: "hello",
      blogId,
      userIdentityId,
      currentStatus,
      progress
    }
    
    res.json(data);
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: 'Could not load items: ' + err.message });
  }


});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
