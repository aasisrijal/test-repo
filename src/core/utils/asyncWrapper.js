import { handleApiError } from './apiHandler.js';


function asyncWrapper(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      handleApiError(error, res);
    }
  };
}

export default asyncWrapper;
