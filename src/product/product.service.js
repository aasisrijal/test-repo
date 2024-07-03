import AppError from "../core/utils/appError.js";
import { ProductModel } from "./product.model.js";
import httpStatus from "http-status";
// import { saveFile } from '../components/upload/v1/upload.service';
import { buildSearchExpression } from "../core/utils/misc.js";
import i18next from "../core/middlewares/i18nMiddleware.js";

export const FIELDS_TO_SEARCH = ["name", "unique_slug"];

export const fetchProductList = async (paginate, filters, sort, search) => {
  let filterExpression;
  if (search) {
    const searchExpression = buildSearchExpression(FIELDS_TO_SEARCH, search);
    filterExpression = searchExpression;
  } else filterExpression = filters;
  const { skip, limit } = paginate;
  const total = await ProductModel.count(filterExpression);
  const products = await ProductModel.find(filterExpression)
    .skip(skip)
    .limit(limit)
    .sort(sort);
  return { products, total };
};

export const fetchProductDetails = async (id) => {
  const product = await ProductModel.findById(id);
  if (!product)
    throw new AppError(
      httpStatus.NOT_FOUND,
      i18next.t("errors:product_not_found")
    );
  return product;
};

export const createNewProduct = async (data) => {
  const productData = data;
  // save only unique product name
  const productInfo = await ProductModel.findOne({
    unique_slug: data.unique_slug,
  });
  if (productInfo)
    throw new AppError(
      httpStatus.FORBIDDEN,
      i18next.t("errors:product_name_already_exists")
    );
  // const main_image = data.main_image
  //   ? await saveFile(data.main_image as unknown as Express.Multer.File[], 'main_image')
  //   : [];
  // const images = data.images ? await saveFile(data.images as unknown as Express.Multer.File[], 'images') : [];
  // if (data?.lookbook) {
  //   const lookbook = await saveFile(data.lookbook as unknown as Express.Multer.File[], 'lookbook');
  //   data.lookbook = lookbook.map((file) => file);
  // }

  // productData.main_image = data.main_image ? main_image.map((file) => file)[0] : '';
  // data.images = images.map((file) => file);

  const product = await ProductModel.create(productData);
  if (!product)
    throw new AppError(
      httpStatus.NOT_FOUND,
      i18next.t("errors:product_not_created")
    );
  return product;
};
