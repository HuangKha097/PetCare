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
