const axios = require("axios");
const message = require("../config/Message");
const statusCode = require("../config/statusCode.js");
const errorCode = require("../config/errorCode");
const utils = require("../utils/utils");
const e = require("cors");

module.exports.handler = async (event) => {
  try {
    if (!event.body) {
      return utils.sendResponse(statusCode.BAD_REQUEST, {
        errorCode: errorCode.BAD_REQUEST,
        message: message.BAD_REQUEST,
      });
    }
    const reqData = JSON.parse(event.body);
    let prompt = "";
    let version = "";
    if (reqData.model === "general") {
      prompt = reqData.prompt + ", 4k photo";
      version = process.env.TTL_AI_MODEL_VERSION;
    } else {
      prompt = reqData.prompt + ", modern disney style";
      version = process.env.TTL_AI_DISNEY_MODEL_VERSION;
    }
    const inputData = {
      prompt: prompt,
    };

    const body = {
      version: version,
      input: inputData,
    };

    const headers = {
      Authorization: `Token ${process.env.TOKEN_API_KEY}`,
      "Content-Type": "application/json",
      "User-Agent": `scribble-node/1.0.0`,
    };

    const response = await axios.post(process.env.BASE_REPLICATE_URL, body, {
      headers: headers,
    });

    console.log(response.status);

    if (response.status !== 201) {
      return utils.sendResponse(statusCode.GENERATION_ERROR, {
        message: message.GENERATION_ERROR,
      });
    }

    return utils.sendResponse(statusCode.SUCCESS, { id: response.data.id });
  } catch (err) {
    console.log("Error occured", err);
    return utils.sendResponse(500, { message: "Couldn't create this player!" });
  }
};
