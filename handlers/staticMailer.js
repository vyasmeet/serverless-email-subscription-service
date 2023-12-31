const AWS = require("aws-sdk");
const sns = new AWS.SNS();
const axios = require("axios");

const publishToSNS = (message) => 
    sns.publish({
        Message: message,
        TopicArn: process.env.SNS_TOPIC_ARN,
    }).promise();

const buildEmailBody = (id, form) => {
    return `
           Message: ${form.message}
           Name: ${form.name}
           Email: ${form.email}
           Service information: ${id.sourceIp} - ${id.userAgent}
        `;
};

module.exports.staticMailer = async (event) => {

    console.log("Incoming Event :::: ", event);

    const data = JSON.parse(event.body);
    const emailBody = buildEmailBody(event.requestContext.identity, data);

    await publishToSNS(emailBody);

    await axios.post(
        "https://2lolgv5c2e.execute-api.us-east-1.amazonaws.com/dev/subscribe",
        { email: data.email },
    ).then ( function(response) {
        console.log("Response :::: ",response)
    }).catch (function (error) {
        console.log("Error while subscribing user: ",error);
    });

    return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": false,
        },
        body: JSON.stringify({ message: "OK" }),
    };

};