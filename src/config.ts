import * as dotenv from "dotenv";
dotenv.config();
import { parse } from "yaml";
import fs from "fs";
import { IConfig, IAccount } from "./interface";
// If config file exist read config file. else read config from environment variables.
let configFile: any = {};
if (fs.existsSync("./config.yaml")) {
  const file = fs.readFileSync("./config.yaml", "utf8");
  configFile = parse(file);
} else {
  configFile = {
    chatGPTAccountPool: [
      {
        email: process.env.CHAT_GPT_EMAIL,
        password: process.env.CHAT_GPT_PASSWORD,
      },
    ],
    chatGptRetryTimes: Number(process.env.CHAT_GPT_RETRY_TIMES),
    chatPrivateTiggerKeyword: process.env.CHAT_PRIVATE_TRIGGER_KEYWORD,
    openAIProxy: process.env.OPENAI_PROXY,
    clearanceToken: process.env.CF_CLEARANCE,
    userAgent: process.env.USER_AGENT,
    apiKey: process.env.CHAT_API_KEY,
    model: process.env.CHAT_MODEL,
  };
}
dotenv.config();

export const config: IConfig = {
  chatGPTAccountPool: configFile.chatGPTAccountPool as Array<IAccount>,
  apiKey: configFile.apiKey,
  model: configFile.model,
  chatGptRetryTimes: configFile.chatGptRetryTimes || 3,
  chatPrivateTiggerKeyword:
    configFile.chatPrivateTiggerKeyword ||
    // Try compatible with previous designs
    (configFile?.botConfig as Array<Map<string, string>>)?.reduce(
      (prev: string, curr: Map<string, string>) =>
        curr.get("trigger_keywords") || "",
      ""
    ) ||
    "",
  // Support openai-js use this proxy
  openAIProxy: configFile.openAIProxy,
  clearanceToken: configFile.clearanceToken,
  userAgent: configFile.userAgent,
};
