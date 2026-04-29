export const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  price: p.price,
  regularPrice: p.regular_price,
  salePrice: p.sale_price,
  image: p.images?.[0]?.src,
  gallery: p.images?.map((i) => i.src) ?? [],
  description: p.description,
  shortDescription: p.short_description,
  categories: p.categories?.map((c) => ({ id: c.id, name: c.name, slug: c.slug })) ?? [],
  tags: p.tags?.map((t) => ({ id: t.id, name: t.name, slug: t.slug })) ?? [],
  attributes: p.attributes,
  variations: p.variations ?? [],
  stockStatus: p.stock_status,
  stockQuantity: p.stock_quantity,
  averageRating: p.average_rating,
  ratingCount: p.rating_count
});

export const mapOrder = (o) => ({
  id: o.id,
  status: o.status,
  total: o.total,
  currency: o.currency,
  lineItems: o.line_items?.map((item) => ({
    id: item.id,
    productId: item.product_id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    total: item.total
  })) ?? [],
  shippingTotal: o.shipping_total,
  billingAddress: o.billing,
  shippingAddress: o.shipping,
  paymentMethod: o.payment_method_title,
  dateCreated: o.date_created
});

export const mapCart = (c) => ({
  items: c.items?.map((item) => ({
    key: item.key,
    productId: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.prices?.price,
    image: item.images?.[0]?.src
  })) ?? [],
  totals: {
    subtotal: c.totals?.total_items,
    total: c.totals?.total_price,
    currency: c.totals?.currency_code
  }
});

export const mapCustomer = (c) => ({
  id: c.id,
  email: c.email,
  firstName: c.first_name,
  lastName: c.last_name,
  billingAddress: c.billing,
  shippingAddress: c.shipping
});

export const mapWishlistItem = (item) => ({
  productId: item.productId,
  name: item.name,
  price: item.price,
  image: item.image,
  dateAdded: item.dateAdded
});
