import * as dotenv from "dotenv";

dotenv.config();

export default {
  app: {
    env: process.env.NODE_ENV,
    host: process.env.HOST,
    port: process.env.PORT,
    name: process.env.APP_NAME,
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
    originRegex: process.env.ORIGIN_REGEX,
    allowedOrigins: process.env.ALLOWED_ORIGINS,
    frontEndUrl: process.env.FRONT_END_URL || "http://localhost:3000",
  },
  db: {
    mongo_uri: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_ACCESS_SECRET || "hellochangethisaccesssecretonenv",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  google: {
    apiUrl: process.env.GOOGLE_API_URL,
  },
  facebook: {
    graphUrl: process.env.FACEBOOK_GRAPH_URL,
  },
};
