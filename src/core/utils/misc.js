import config from '../../config/config.js';
// import i18next from '@core/middlewares/i18nMiddleware';
const { host } = config.app;


const originRegex = new RegExp(config.app.originRegex);
const allowedOrigins = config.app.allowedOrigins.split(',');

export const corsOption = {
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.indexOf(origin) !== -1 || originRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

export const genRandomNumber = (digit = 6) => {
  let random = 8848;
  do {
    random = Math.floor(Math.random() * 10 ** digit);
  } while (random < 10 ** (digit - 1));
  return random;
};

export const translate = (req, key) => {
  return req ? key : key;
};

export const calculatePagination = (totalCount, skip, limit) => {
  const totalPages = Math.ceil(totalCount / limit);
  const current = Math.floor(skip / limit) + 1;

  // Calculate next and prev page numbers
  const next = current < totalPages ? current + 1 : null;
  const prev = current > 1 ? current - 1 : null;

  return {
    current,
    next,
    prev,
    totalCount,
    totalPages,
    limit,
  };
};

export const buildSearchExpression = (fields, search) => {
  const searchConditions = fields.map((field) => ({
    [field]: { $regex: search, $options: 'i' },
  }));

  return { $or: searchConditions };
};

export const arraysAreEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((element, index) => arePathsEqual(element, arr2[index]));
};

export function getFileLink(path) {
  return `${host}${path}`;
}

export function arePathsEqual(path1, path2) {
  let pathname1;
  let pathname2;
  console.log({ path1, path2 });
  const isValidUrlPath1 = /^(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(path1);
  const isValidUrlPath2 = /^(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(path2);
  if (isValidUrlPath1) {
    const parsedUrl = new URL(path1);
    pathname1 = parsedUrl.pathname;
  } else pathname1 = path1;
  if (isValidUrlPath2) {
    const parsedUrl = new URL(path2);
    pathname2 = parsedUrl.pathname;
  } else pathname2 = path2;
  console.log({ pathname1, pathname2 });
  // Normalize paths to remove leading and trailing slashes
  const normalizedPath1 = pathname1.replace(/^\/+|\/+$/g, '');
  const normalizedPath2 = pathname2.replace(/^\/+|\/+$/g, '');

  return normalizedPath1 === normalizedPath2;
}

export const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};
