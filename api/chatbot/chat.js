const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const message = require("../config/Message");
const statusCode = require("../config/statusCode.js");
const errorCode = require("../config/errorCode");
const utils = require("../utils/utils");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports.handler = async (event) => {
  try {
    if (!event.body) {
      return utils.sendResponse(statusCode.BAD_REQUEST, {
        errorCode: errorCode.BAD_REQUEST,
        message: message.BAD_REQUEST,
      });
    }
    const { chats } = JSON.parse(event.body);

    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a EbereGPT. You can help with graphic design tasks",
        },
        ...chats,
      ],
    });

    // if (response.status !== 201) {
    //     let error = response;
    //     return utils.sendResponse(500, { message: "Error occur ha", data: error.detail })
    // }
    return utils.sendResponse(200, { output: result.data.choices[0].message });
  } catch (err) {
    console.log("Error occured", err);
    return utils.sendResponse(500, { message: "Couldn't create this player!" });
  }
};
