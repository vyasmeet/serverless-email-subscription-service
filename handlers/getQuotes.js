const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.REGION})
const s3 = new AWS.S3()

module.exports.getQuotes = (event, context, callback) => {
    
    console.log("Incoming request :::: ",event);

    // Read JSON file from S3 bucket

    s3.getObject({
        Bucket: "meet-email-subscription-quotes-service-bucket",
        Key: "quotes.json"
    },
        function (error, data) {
            if (error) {
                console.error(error);
                callback(new Error(error));
                return;

            } else {
                var json = JSON.parse(data.Body)
                
                console.log("S3 Bucket Response JSON :::: ", json);
                
                const response = {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Methods": "*",
                        "Access-Control-Allow-Origin": "*", 
                       },
                       statusCode: 200,
                       body: JSON.stringify(json)
                }
                callback(null, response)
            }
        }
    );
};