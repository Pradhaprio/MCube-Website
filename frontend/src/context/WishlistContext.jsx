import { createContext, useContext, useMemo, useState } from 'react';

const WishlistContext = createContext(null);

function readWishlist() {
  try {
    const raw = localStorage.getItem('mcube-wishlist');
    return raw ? JSON.parse(raw) : [];
  } catch {
    localStorage.removeItem('mcube-wishlist');
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(readWishlist);

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
