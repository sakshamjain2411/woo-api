import { supabase } from '../config/supabase.js';
import { fetchProductById } from './product.service.js';
import { mapProduct } from '../utils/mapper.js';

export const getWishlist = async (customerId) => {
  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id, date_added')
    .eq('customer_id', customerId);

  if (error) throw { status: 500, code: 'INTERNAL_ERROR', message: error.message };

  const enriched = (await Promise.all(
    (data ?? []).map(async (row) => {
      try {
        const product = await fetchProductById(row.product_id);
        const mapped = mapProduct(product);
        return {
          productId: mapped.id,
          name: mapped.name,
          price: mapped.price,
          image: mapped.image,
          dateAdded: row.date_added
        };
      } catch {
        return null;
      }
    })
  )).filter(Boolean);

  return enriched;
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
