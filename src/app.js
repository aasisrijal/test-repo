import express from "express";
import httpContext from "express-http-context";
import helmet from "helmet";
import cors from "cors";

import consts from "./config/consts.js";
import api from "./routes/index.js";
import httpLogger from "./core/utils/httpLogger.js";
import errorHandling from "./core/middlewares/errorHandling.middleware.js";
import http404 from "./404/404.router.js";
import config from "./config/config.js";
import { corsOption } from "./core/utils/misc.js";
import { i18nMiddleware } from "./core/middlewares/i18nMiddleware.js";

const { isProd } = config.app;
const app = express();
app.use(i18nMiddleware);
app.use(express.static("public"));
if (isProd) {
  app.use(helmet());
}
app.use(httpContext.middleware);
app.use(httpLogger.successHandler);
app.use(httpLogger.errorHandler);
app.use(cors(corsOption));
app.use(express.json());
app.use(consts.API_ROOT_PATH, api);
app.use(http404);

app.use(errorHandling);

export default app;
