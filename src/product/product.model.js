import mongoose from 'mongoose';
// import config from '@config/config';
// import * as url from 'url';
// const { host } = config.app;

const colorSchema = new mongoose.Schema({
  color_name: { type: String, required: true },
  color_code: { type: String, required: true },
});

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  size_code: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: String,
    unique_slug: String,
    description: String,
    category: String,
    sub_category: String,
    price: String,
    discount: String,
    estimated_days: String,
    main_image: String,
    images: [String],
    lookbook: [String],
    colors: [colorSchema],
    sizes: [sizeSchema],
    moqs: Number,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);


const ProductModel = mongoose.model('Product', productSchema);

export { ProductModel };
