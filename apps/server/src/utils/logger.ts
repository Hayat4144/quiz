import { loggerConfig, winstonLogger as Logger } from "@workspace/logger";

const winstonLogger = new loggerConfig("");

let logger: Logger;
if (process.env.NODE_ENV !== "production") {
  logger = winstonLogger.devlepmentConfig();
} else {
  logger = winstonLogger.productionConfig();
}

export default logger;
