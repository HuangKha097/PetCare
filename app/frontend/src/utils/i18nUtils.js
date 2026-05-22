/**
 * Safely extracts the translated string from a multilingual field object.
 * 
 * @param {string|object} field - The database field (e.g., product.name)
 * @param {string} currentLang - The active language code from i18n (e.g., 'vi')
 * @returns {string} The localized string
 */
export const getLocalizedText = (field, currentLang) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[currentLang] || field.en || '';
};

/**
 * Formats a number to Vietnamese Dong (VNĐ) representation.
 * 
 * @param {number} price - The price value to format
 * @returns {string} The formatted currency string
 */
export const formatVND = (price) => {
    if (price === undefined || price === null || isNaN(price)) return '0đ';
    return new Intl.NumberFormat('vi-VN').format(Math.round(price)) + 'đ';
};

