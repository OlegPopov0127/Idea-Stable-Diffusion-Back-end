const AWS = require("aws-sdk");
const axios = require("axios");
const utils = require("../utils/utils");

module.exports.handler = async (event) => {
  try {
    const headers = {
      Authorization: `Token ${process.env.TOKEN_API_KEY}`,
      "Content-Type": "application/json",
    };

    // const userEmail = event.requestContext.authorizer.claims.email;

    const response = await axios.get(
      `${process.env.BASE_REPLICATE_URL}/${event.pathParameters.id}`,
      {
        headers: headers,
      }
    );

    if (response.status !== 200) {
      let error = await response.json();
      return;
    }

    return utils.sendResponse(200, response.data);
  } catch (err) {
    // console.log("Error occured", err);
    return utils.sendResponse(500, { message: "Couldn't create this player!" });
  }
};
