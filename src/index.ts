import * as express from "express";
import { router } from "./routes";
import sequelize from "./models";
import * as config from "config";
import * as YAML from "yamljs";
import * as swaggerUI from "swagger-ui-express";
import * as OpenApiValidator from "express-openapi-validator";
import * as bodyParser from "body-parser";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { connection } from "./web_socket/index";
import { authMiddlewareWs } from "./middlewares/auth.middeleware.ws";
import * as cors from "cors";

const apiSpec = YAML.load("./src/docs/openApi.yaml");
const port: number = config.get("app.port") || 5000;
const app: express.Application = express();
const server = createServer(app);
export const wss = new WebSocketServer({ noServer: true });
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", swaggerUI.serve, swaggerUI.setup(apiSpec));
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
  })
);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

server.on("upgrade", authMiddlewareWs);
wss.on("connection", connection);
app.use("/", router);

const start = async () => {
  try {
    await sequelize.authenticate();
    server.listen(port, () => console.log(`Server started on port ` + port));
  } catch (e) {
    console.log(e);
  }
};
start();
