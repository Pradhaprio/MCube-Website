import { mutateStore, readStore } from '../services/dataStore.js';
import { nowIso, sanitizeText } from '../utils/helpers.js';

function computeIsOpen(profile) {
  if (typeof profile.isShopOpenOverride === 'boolean') {
    return profile.isShopOpenOverride;
  }
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Asia/Kolkata' })
    .format(new Date())
    .toLowerCase();
  return Boolean(profile.openingHours?.[day]);
}

export async function getProfile(req, res) {
  const data = await readStore();
  return res.json({
    profile: {
      ...data.storeProfile,
      isOpen: computeIsOpen(data.storeProfile)
    }
  });
}

export async function updateProfile(req, res) {
  const payload = req.body;
  const next = await mutateStore((data) => {
    data.storeProfile = {
      ...data.storeProfile,
      shopName: sanitizeText(payload.shopName || data.storeProfile.shopName),
      logoUrl: sanitizeText(payload.logoUrl || data.storeProfile.logoUrl),
      bannerUrl: sanitizeText(payload.bannerUrl || data.storeProfile.bannerUrl),
      phone: sanitizeText(payload.phone || data.storeProfile.phone),
      whatsappNumber: sanitizeText(payload.whatsappNumber || data.storeProfile.whatsappNumber),
      email: sanitizeText(payload.email || data.storeProfile.email),
      addressLine1: sanitizeText(payload.addressLine1 || data.storeProfile.addressLine1),
      addressLine2: sanitizeText(payload.addressLine2 || data.storeProfile.addressLine2),
      city: sanitizeText(payload.city || data.storeProfile.city),
      state: sanitizeText(payload.state || data.storeProfile.state),
      postalCode: sanitizeText(payload.postalCode || data.storeProfile.postalCode),
      announcementText: sanitizeText(payload.announcementText || data.storeProfile.announcementText),
      openingHours: payload.openingHours || data.storeProfile.openingHours,
      updatedAt: nowIso()
    };
    return data;
  });
  return res.json({ profile: { ...next.storeProfile, isOpen: computeIsOpen(next.storeProfile) } });
}
