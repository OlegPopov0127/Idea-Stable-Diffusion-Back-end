const AWS = require('aws-sdk')
const axios = require('axios');
const utils = require("../utils/utils")

module.exports.handler = async (event) => {
    try {
        const headers = {
            Authorization: `Token ${process.env.TOKEN_API_KEY}`,
            "Content-Type": "application/json",
        }

        // const userEmail = event.requestContext.authorizer.claims.email;

        const response = await axios.get(`${process.env.BASE_REPLICATE_URL}/${event.pathParameters.id}`, {
            headers: headers
        });
        console.log("11111111111111", response.data)
        if (response.status !== 200) {
            let error = await response.json();
            return;
        }
        let sendData = {
            id: response.data.id,
            status: response.data.status,
            input: response.data.input,
            output: null
        }
        if (sendData.status == 'succeeded') {
            const s3bucket = new AWS.S3();
            const raw = await axios.get(response.data.output[0], {
                responseType: "arraybuffer"
            })
            let base64 = raw.data.toString("base64")
            console.log(raw, base64)
            var buf = Buffer.from(base64, 'base64')
            sendData.output = base64;
            return utils.sendResponse(200, sendData);
        }

        return utils.sendResponse(200, sendData);
    } catch (err) {
        // console.log("Error occured", err);
        return utils.sendResponse(500, { message: "Couldn't create this player!" });
    }
}