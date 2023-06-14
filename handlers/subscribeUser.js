const AWS = require("aws-sdk");
const { json } = require("express");
const uuid = require("uuid");
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.subscribeUser = (event, context, callback) => {
    const data = JSON.parse(event.body)
    console.log("Incoming Event Data :::: ",data);

    const timestamp = new Date().getTime()

    if (typeof data.email !== "string") {
        console.error("Email is not string type, validation failed!");
        return;
    }

    const params = {
        TableName: USERS_TABLE,
        Item: {
            userId: uuid.v4(),
            email: data.email,
            subscriber: true,
            createdAt: timestamp,
            updatedAt: timestamp
        },
    };

    // Save this into the DB

    dynamoDB.put(params, (error, data) => {
        if (error) {
            console.error(error);
            callback(new Error(error));
            return;
        }
        // No error, return response back to Lambda
        const response = { 
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };
        callback(null, response);
    });

};
