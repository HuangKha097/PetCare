import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors font-bold text-sm">
                <Globe size={18} />
                <span className="uppercase">{i18n.resolvedLanguage || i18n.language || 'EN'}</span>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-surface-container-low rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <button 
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-surface-container-lowest transition-colors ${i18n.language === 'en' ? 'text-primary bg-primary/5' : 'text-on-background'}`}
                >
                    English
                </button>
                <button 
                    onClick={() => changeLanguage('vi')}
                    className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-surface-container-lowest transition-colors ${i18n.language === 'vi' ? 'text-primary bg-primary/5' : 'text-on-background'}`}
                >
                    Tiếng Việt
                </button>
                <button 
                    onClick={() => changeLanguage('zh')}
                    className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-surface-container-lowest transition-colors ${i18n.language === 'zh' ? 'text-primary bg-primary/5' : 'text-on-background'}`}
                >
                    中文
                </button>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
