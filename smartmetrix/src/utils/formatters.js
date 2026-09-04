export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return dateString;
};

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0.00';
  if (typeof amount === 'string' && amount.includes('₹')) return amount;
  return `₹${amount}`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
