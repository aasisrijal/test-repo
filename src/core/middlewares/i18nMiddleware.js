import i18next from "i18next";
import Backend from "i18next-fs-backend";
import i18nextHttpMiddleware from "i18next-http-middleware";
import config from "../../config/config.js";

const namespaces = ["errors", "success", "common"];

const languages = ["en"];
const fallbackLng = "en";
const defaultNs = "common";

const i18nextOptions = {
  fallbackLng: fallbackLng,
  debug: config.app.isDev,
  ns: namespaces,
  defaultNS: defaultNs,
  preload: languages,
  backend: {
    loadPath: "./public/translations/{{lng}}/{{ns}}.json",
  },
};

i18next
  .use(Backend)
  .use(i18nextHttpMiddleware.LanguageDetector)
  .init(i18nextOptions);

export const i18nMiddleware = i18nextHttpMiddleware.handle(i18next);
export default i18next;
