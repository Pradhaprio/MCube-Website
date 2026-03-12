import { mutateStore, readStore } from '../services/dataStore.js';
import { nowIso, sanitizeText } from '../utils/helpers.js';

function computeIsOpen(profile) {
  if (!profile) {
    return false;
  }
  if (typeof profile.isShopOpenOverride === 'boolean') {
    return profile.isShopOpenOverride;
  }
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Asia/Kolkata' })
    .format(new Date())
    .toLowerCase();
  return Boolean(profile.openingHours?.[day]);
}

function resolveTextField(payload, key, currentValue) {
  if (!Object.prototype.hasOwnProperty.call(payload, key)) {
    return currentValue;
  }
  return sanitizeText(payload[key]);
}

export async function getProfile(req, res) {
  const data = await readStore();
  if (!data.storeProfile) {
    return res.json({ profile: null });
  }
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
      shopName: resolveTextField(payload, 'shopName', data.storeProfile.shopName),
      logoUrl: resolveTextField(payload, 'logoUrl', data.storeProfile.logoUrl),
      bannerUrl: resolveTextField(payload, 'bannerUrl', data.storeProfile.bannerUrl),
      phone: resolveTextField(payload, 'phone', data.storeProfile.phone),
      whatsappNumber: resolveTextField(payload, 'whatsappNumber', data.storeProfile.whatsappNumber),
      email: resolveTextField(payload, 'email', data.storeProfile.email),
      addressLine1: resolveTextField(payload, 'addressLine1', data.storeProfile.addressLine1),
      addressLine2: resolveTextField(payload, 'addressLine2', data.storeProfile.addressLine2),
      city: resolveTextField(payload, 'city', data.storeProfile.city),
      state: resolveTextField(payload, 'state', data.storeProfile.state),
      postalCode: resolveTextField(payload, 'postalCode', data.storeProfile.postalCode),
      announcementText: resolveTextField(payload, 'announcementText', data.storeProfile.announcementText),
      openingHours: Object.prototype.hasOwnProperty.call(payload, 'openingHours')
        ? payload.openingHours
        : data.storeProfile.openingHours,
      updatedAt: nowIso()
    };
    return data;
  });
  return res.json({ profile: { ...next.storeProfile, isOpen: computeIsOpen(next.storeProfile) } });
}
