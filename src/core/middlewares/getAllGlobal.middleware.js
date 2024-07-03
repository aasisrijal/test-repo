const DEFAULT_SORT = 'created_at';
const DEFAULT_PAGE_LIMIT = 10;

const handleArrayFilters = (filterValue) => {
  if (typeof filterValue === 'string' && filterValue.includes(',')) {
    return filterValue.split(',');
  }
  return filterValue;
};

export const getAllGlobalMiddleware = (req, res, next) => {
  const { sortBy, sortOrder, page, limit, search, ...filters } = req.query;
  const sortField = sortBy ? sortBy.toString() : DEFAULT_SORT;
  const _sortOrder = sortOrder === 'desc' ? -1 : 1;
  const sortOptions = { [sortField]: _sortOrder };
  const _page = Number(page) || 1;
  const _limit = Number(limit) || DEFAULT_PAGE_LIMIT;
  const paginationOptions = {
    skip: (_page - 1) * _limit,
    limit: _limit,
  };
  if (search) req.search = search;

  req.sort = sortOptions;
  req.paginate = paginationOptions;
  const processedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
    acc[key] = handleArrayFilters(value);
    return acc;
  }, {});
  req.filters = processedFilters || {};
  next();
};
