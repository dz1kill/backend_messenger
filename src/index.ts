import * as express from "express";
import { router } from "./routes";
import sequelize from "./models";
import * as config from "config";
import * as YAML from "yamljs";
import * as swaggerUI from "swagger-ui-express";
import * as OpenApiValidator from "express-openapi-validator";
import * as bodyParser from "body-parser";

const apiSpec = YAML.load("./src/docs/openApi.yaml");
const port: number = config.get("app.port") || 5000;
const app: express.Application = express();
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
app.use("/", router);

const start = async () => {
  try {
    await sequelize.authenticate();
    app.listen(port, () => console.log("Server started on port " + port));
  } catch (e) {
    console.log(e);
  }
};
start();
