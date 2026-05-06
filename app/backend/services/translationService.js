const { translate } = require('bing-translate-api');

/**
 * Translates text into the target language.
 * Uses Bing Translate to bypass Google restrictions.
 * 
 * @param {string} text - The English text to translate.
 * @param {string} targetLang - The language code (e.g., 'vi', 'zh-Hans').
 * @returns {Promise<string>} - The translated string.
 */
exports.translateText = async (text, targetLang) => {
    if (!text || typeof text !== 'string') return text;
    
    // Convert generic 'zh' to 'zh-Hans' (Simplified Chinese) for Bing
    const langCode = targetLang === 'zh' ? 'zh-Hans' : targetLang;

    try {
        const res = await translate(text, null, langCode);
        return res.translation;
    } catch (error) {
        console.error(`[TranslationService] Error translating to ${langCode}:`, error.message);
        return text; // Fallback to original text on error
    }
};

/**
 * Creates a multilingual object { en, vi, zh } from an English string.
 * Used when a new product is created or updated.
 * 
 * @param {string} englishText 
 * @returns {Promise<object>}
 */
exports.createMultilingualField = async (input) => {
    if (!input) return null;

    // If input is already an object, extract English text
    const englishText = (typeof input === 'object') ? (input.en || '') : input;

    if (!englishText || typeof englishText !== 'string') {
        return typeof input === 'object' ? input : { en: input, vi: input, zh: input };
    }

    try {
        const [viText, zhText] = await Promise.all([
            exports.translateText(englishText, 'vi'),
            exports.translateText(englishText, 'zh')
        ]);

        return {
            en: englishText,
            vi: viText,
            zh: zhText
        };
    } catch (error) {
        console.error('[TranslationService] Error creating multilingual field:', error.message);
        // Fallback: all languages get the English text
        return { en: englishText, vi: englishText, zh: englishText };
    }
};
