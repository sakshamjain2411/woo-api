import { supabase } from '../config/supabase.js';
import { fetchProductsByIds } from './product.service.js';
import { mapProduct } from '../utils/mapper.js';

export const getWishlist = async (customerId) => {
  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id, date_added')
    .eq('customer_id', customerId);

  if (error) throw { status: 500, code: 'INTERNAL_ERROR', message: error.message };
  if (!data?.length) return [];

  const rows = data;
  const ids = rows.map(r => r.product_id);
  const products = await fetchProductsByIds(ids);
  const productMap = Object.fromEntries(products.map(p => [p.id, mapProduct(p)]));

  return rows
    .map(row => {
      const mapped = productMap[row.product_id];
      if (!mapped) return null;
      return {
        productId: mapped.id,
        name: mapped.name,
        price: mapped.price,
        image: mapped.image,
        dateAdded: row.date_added
      };
    })
    .filter(Boolean);
};

export const addToWishlist = async (customerId, productId) => {
  const { error } = await supabase
    .from('wishlists')
    .upsert({ customer_id: customerId, product_id: productId }, { onConflict: 'customer_id,product_id' });

  if (error) throw { status: 500, code: 'INTERNAL_ERROR', message: error.message };
  return getWishlist(customerId);
};

export const removeFromWishlist = async (customerId, productId) => {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('customer_id', customerId)
    .eq('product_id', productId);

  if (error) throw { status: 500, code: 'INTERNAL_ERROR', message: error.message };
  return getWishlist(customerId);
};
