// src/utils/avatarUtils.js

/**
 * Gets the avatar URL for a user with fallback logic.
 * Prioritizes direct avatar properties, then nested profile avatars, 
 * and finally generates a DiceBear avatar if nothing else exists.
 * 
 * @param {Object} user - User object containing avatar information
 * @returns {string} Valid avatar URL
 */
export const getUserAvatar = (user) => {
  if (!user) return getDefaultAvatar();

  // 1. Check direct properties on the user object
  if (user.avatar && user.avatar.trim() !== '') return user.avatar;
  if (user.avatarUrl && user.avatarUrl.trim() !== '') return user.avatarUrl;

  // 2. Check nested profile object (common in some backend structures)
  if (user.profile?.avatar && user.profile.avatar.trim() !== '') return user.profile.avatar;
  if (user.profile?.avatarUrl && user.profile.avatarUrl.trim() !== '') return user.profile.avatarUrl;

  // 3. Check for 'hosteller' object inside stay records (specific to room cards)
  if (user.hosteller?.avatar && user.hosteller.avatar.trim() !== '') return user.hosteller.avatar;
  if (user.hosteller?.avatarUrl && user.hosteller.avatarUrl.trim() !== '') return user.hosteller.avatarUrl;

  // 4. Generate fallback based on available identity fields
  const seed = user.fullName || user.name || user.email || user.username || 'User';
  return getDefaultAvatar(seed);
};

/**
 * Generates a consistent default avatar URL using DiceBear API.
 * Uses the 'adventurer' style to match your application theme.
 * 
 * @param {string} seed - Unique seed string (name, email, etc.)
 * @returns {string} DiceBear API URL
 */
export const getDefaultAvatar = (seed = 'default') => {
  // Clean the seed to ensure valid URL characters
  const cleanSeed = seed.toString().replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 20);
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanSeed || 'default'}`;
};
