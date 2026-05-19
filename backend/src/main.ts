import http from "http";
import { createApp } from "./app";
import { createSocketServer } from "./websocket/wsMain";
import { ENV } from "./config/env";

const app = createApp();

const server = http.createServer(app);

createSocketServer(server);

server.listen(ENV.PORT, () => {
    console.log(`Server running on ${ENV.PORT}`);
});