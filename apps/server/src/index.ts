import logger from "@utils/logger";
import startServer from "./server";

const server = startServer();

server.listen(9000, () => {
  logger.info("Server is running on port 9000");
});
