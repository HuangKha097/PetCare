const { translate } = require('bing-translate-api');


exports.translateText = async (text, targetLang) => {
    if (!text || typeof text !== 'string') return text;
    

    const langCode = targetLang === 'zh' ? 'zh-Hans' : targetLang;

    try {
        const res = await translate(text, null, langCode);
        return res.translation;
    } catch (error) {
        console.error(`[TranslationService] Error translating to ${langCode}:`, error.message);

    }
};


exports.createMultilingualField = async (input) => {
    if (!input) return null;


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

        return { en: englishText, vi: englishText, zh: englishText };
    }
};
