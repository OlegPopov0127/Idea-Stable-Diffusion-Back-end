const AWS = require('aws-sdk')
const axios = require('axios');
const utils = require("../utils/utils");
const statusCode = require('../config/statusCode');

module.exports.handler = async (event) => {
    try {
        const headers = {
            Authorization: `Token ${process.env.TOKEN_API_KEY}`,
            "Content-Type": "application/json",
        }

        const response = await axios.get(`${process.env.BASE_REPLICATE_URL}/${event.pathParameters.id}`, {
            headers: headers
        });

        console.log("!111111111111111111", response.data)

        return utils.sendResponse(statusCode.SUCCESS, response);
    } catch (err) {
        // console.log("Error occured", err);
        return utils.sendResponse(500, { message: "Couldn't create this player!" });
    }
}