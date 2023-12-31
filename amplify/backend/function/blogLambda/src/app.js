/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "blogTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "blogId";
const partitionKeyType = "S";
const sortKeyName = "userId";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/blog/:blogId";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list all objects *
 ********************************/

app.get("/blog/list", function (req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [convertUrlType(req.params[partitionKeyName], partitionKeyType)];
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let queryParams = {
    TableName: tableName,
    AttributesToGet: ['blogId', 'title', 'published']
  }
    
  dynamodb.scan(queryParams, function(err, data) {
     if (err) {
       res.statusCode = 500;
       res.json({ error: 'Could not load items: ' + err });
     }
     else {
       res.json(data.Items.filter((item) => {
        return item.published === true;
       }));
     }
  });
});


/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + hashKeyPath, function (req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [convertUrlType(req.params[partitionKeyName], partitionKeyType)];
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition
  }

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/
// /blog/:blogId___/object___/:blogId___:/userId
app.get(path + '/object' + hashKeyPath + sortKeyPath, async function (req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  try {
    const blogData = await dynamodbAsync(getItemParams);
    // console.log("blogData authorId :: ", blogData.authorId);

    const filterString = `\"sub\"=\"${blogData.authorId}\"`;

    const deployment = process.env.AWS_BRANCH;

    let getAuthorParams = {
      UserPoolId: 'eu-west-2_F4UN5NXmE', /* required */
      AttributesToGet: [
        "name"
      ],
      Filter: String(filterString),
      Limit: 1
    }; 

    if (deployment === "main") {
      getAuthorParams.UserPoolId = 'eu-west-2_F4UN5NXmE';
    }

    const authorName = await getAuthorAsync(getAuthorParams);
    // console.log("authorName :: ", authorName);

    blogData.author = authorName;

    res.json(blogData);
  } catch (error) {
    res.statusCode = 500;
    res.json({ error: 'Could not load blog: ' + error.message });
  }

  /*
  * HELPER FUNCTIONS - ASYNC
  */
  function dynamodbAsync(getItemParams) {
    return new Promise((resolve) => {
      dynamodb.get(getItemParams, (err, data) => {
        if (err) {
          throw new Error('Could not load items: ' + err.message)
        } else {
          if (data.Item) {
            resolve(data.Item);
          } else {
            resolve(data);
          }
        }
      });
    });
  }

  function getAuthorAsync(getAuthorParams) {
    // FOR THIS TO WORK, PERMISSION IS NEEDED AS PER :: https://stackoverflow.com/questions/62014773/how-to-access-cognito-userpool-from-inside-a-lambda-function
    const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    return new Promise((resolve) => {
      cognitoidentityserviceprovider.listUsers(getAuthorParams, function (err, data) {
        if (err) {
          throw new Error('Could not load author: ' + err.message);
        } else {
          const userEmail = data.Users[0].Attributes.find((el) => {
            return el.Name === 'name';
          }).Value;
          resolve(userEmail);
        }
      });
    });
  }
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function (req, res) {
  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      res.json({ success: 'put call succeed!', url: req.url, data: data })
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function (req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: {
      ...req.body,
      blogId: AWS.util.uuid.v4(), // SET BLOG ID FROM THE BACKEND
      title: req.body.title,
      userId: req.body.userId
    }
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      res.json({ success: 'post call succeed!', url: req.url, data: data, blogId: putItemParams.Item.blogId })
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url });
    } else {
      res.json({ url: req.url, data: data });
    }
  });
});

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
