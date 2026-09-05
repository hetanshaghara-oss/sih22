export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10 MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Only JPG, PNG, and WEBP images are supported.' };
  }

  if (file.size > maxSize) {
    return { valid: false, message: 'Image size must be less than 10 MB.' };
  }

  // Simulated image quality calculation
  const quality = file.size > 1.5 * 1024 * 1024 ? 'Good' : 'Needs Review';
  return { valid: true, quality };
};
