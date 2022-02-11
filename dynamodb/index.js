'use strict';

const AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1",

});

exports.handler = async(event, context) => {
    const dynamo = new AWS.DynamoDB.DocumentClient();
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };

    try {
        switch (event.routeKey) {
            case "DELETE /testDynamodb/students/{id}":
                await dynamo
                    .delete({
                        TableName: "student",
                        Key: {
                            id: event.pathParameters.id
                        }
                    })
                    .promise();
                body = `Deleted item ${event.pathParameters.id}`;
                break;
            case "GET /testDynamodb/students/{id}":
                body = await dynamo
                    .get({
                        TableName: "student",
                        Key: {
                            id: event.pathParameters.id
                        }
                    })
                    .promise();
                break;
            case "GET /testDynamodb/students":
                body = await dynamo.scan({ TableName: "student" }).promise();
                break;
            case "PUT /testDynamodb/students":
                let requestJSON = JSON.parse(event.body);
                await dynamo
                    .put({
                        TableName: "student",
                        Item: {
                            id: requestJSON.id,
                            firstname: requestJSON.firstname,
                            lastname: requestJSON.lastname,
                            age: requestJSON.age,
                            branch: requestJSON.branch,
                        }
                    })
                    .promise();
                body = `Put item ${requestJSON.id}`;
                break;
            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};