import type {ConstructorParams, LogLine} from "@browserbasehq/stagehand"
import {config} from "dotenv";


config();

/**
 * Implemented from the stagehand referrenced example 
 * 
 * 
 */


export function logLineToString(logLine: LogLine): string {
    // If you want more detail, set this to false. However, this will make the logs
    // more verbose and harder to read.
    const HIDE_AUXILIARY = true;
  
    try {
      const timestamp = logLine.timestamp || new Date().toISOString();
      if (logLine.auxiliary?.error) {
        return `${timestamp}::[stagehand:${logLine.category}] ${logLine.message}\n ${logLine.auxiliary.error.value}\n`;
      }
  
      // If we want to hide auxiliary information, we don't add it to the log
      return `${timestamp}::[stagehand:${logLine.category}] ${logLine.message} ${
        logLine.auxiliary && !HIDE_AUXILIARY
          ? JSON.stringify(logLine.auxiliary)
          : ""
      }`;
    } catch (error) {
      console.error(`Error logging line:`, error);
      return "error logging line";
    }
  }
  


export const StagehandConfig: ConstructorParams = {
    env:
      process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID
        ? "BROWSERBASE"
        : "LOCAL",
    apiKey: process.env.BROWSERBASE_API_KEY /* API key for authentication */,
    projectId: process.env.BROWSERBASE_PROJECT_ID /* Project identifier */,
    debugDom: true /* Enable DOM debugging features */,
    headless: false /* Run browser in headless mode */,
    logger: (message: LogLine) =>
      console.log(logLineToString(message)) /* Custom logging function */,
    domSettleTimeoutMs: 30_000 /* Timeout for DOM to settle in milliseconds */,
    browserbaseSessionCreateParams: {
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
    },
    enableCaching: true /* Enable caching functionality */,
    browserbaseSessionID:
      undefined /* Session ID for resuming Browserbase sessions */,
    modelName: "gpt-4o" /* Name of the model to use */,
    modelClientOptions: {
      apiKey: process.env.OPENAI_API_KEY,
    } /* Configuration options for the model client */,
  };
  export default StagehandConfig;
  



