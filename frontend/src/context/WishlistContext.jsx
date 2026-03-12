import { createContext, useContext, useMemo, useState } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => JSON.parse(localStorage.getItem('mcube-wishlist') || '[]'));

  const toggleWishlist = (id) => {
    const next = ids.includes(id) ? ids.filter((entry) => entry !== id) : [...ids, id];
    setIds(next);
    localStorage.setItem('mcube-wishlist', JSON.stringify(next));
  };

  const value = useMemo(() => ({ ids, toggleWishlist }), [ids]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  return useContext(WishlistContext);
}
