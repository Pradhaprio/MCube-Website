export function getStoreMapLink(profile) {
  if (profile?.latitude && profile?.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${profile.latitude},${profile.longitude}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${profile?.addressLine1 || ''} ${profile?.city || ''}`
  )}`;
}
