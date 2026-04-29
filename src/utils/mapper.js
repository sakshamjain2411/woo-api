export const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  image: p.images?.[0]?.src,
  attributes: p.attributes,
  stockStatus: p.stock_status
});