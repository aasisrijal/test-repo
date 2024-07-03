import asyncWrapper from '../core/utils/asyncWrapper.js';
import httpStatus from 'http-status';

import { fetchProductList, fetchProductDetails, createNewProduct } from './product.service.js';

export const getProductsList = asyncWrapper(async (req, res) => {
  const { paginate, filters, sort, search } = req;
  const data = await fetchProductList(paginate, filters, sort, search);
  res.status(httpStatus.OK).json({ ok: true, message: req.t('products_list_fetched'), data });
});

export const createProduct = asyncWrapper(async (req, res) => {
  // req.body['main_image'] = req.files && req.files['main_image'];
  // req.body['images'] = req.files && req.files['images'];
  const data = await createNewProduct(req.body);
  res.status(httpStatus.OK).json({ ok: true, message: req.t('success:product_created'), data });
});

export const getProductDetails = asyncWrapper(async (req, res) => {
  const id = req.params.productId;
  const data = await fetchProductDetails(id);
  res.status(httpStatus.OK).json({ ok: true, message: req.t('success:product_details_fetched'), data });
});
