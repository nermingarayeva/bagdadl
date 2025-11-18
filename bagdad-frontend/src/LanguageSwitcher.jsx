import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Language configuration
  const languages = [
    { 
      code: 'az', 
      label: 'AZ',
      nativeName: 'Azərbaycanca',
      region: 'Azerbaijan',
      dir: 'ltr'
    },
    { 
      code: 'en', 
      label: 'EN',
      nativeName: 'English',
      region: 'International',
      dir: 'ltr'
    },
    { 
      code: 'ru', 
      label: 'RU',
      nativeName: 'Русский',
      region: 'Russia',
      dir: 'ltr'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Store language preference in localStorage
  const handleLanguageChange = (lang) => {
    // Change language
    i18n.changeLanguage(lang);
    
    // Store preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update HTML lang attribute for SEO
    document.documentElement.lang = lang;
    
    // Update URL
    const currentPath = location.pathname;
    let newPath = currentPath;
    
    // Remove existing language prefix
    if (currentPath.startsWith('/en/') || currentPath === '/en') {
      newPath = currentPath.replace(/^\/en/, '');
    } else if (currentPath.startsWith('/ru/') || currentPath === '/ru') {
      newPath = currentPath.replace(/^\/ru/, '');
    }
    
    // Add new language prefix
    if (lang === 'en') {
      newPath = '/en' + (newPath || '');
    } else if (lang === 'ru') {
      newPath = '/ru' + (newPath || '');
    }
    
    if (!newPath || newPath === '/') {
      newPath = lang === 'az' ? '/' : `/${lang}`;
    }
    
    // Navigate with smooth transition
    navigate(newPath);
    setIsOpen(false);
    
    // Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'language_change', {
        event_category: 'Language',
        event_label: lang,
        previous_language: i18n.language
      });
    }

    // Show confirmation toast (optional)
    showLanguageToast(lang);
  };

  const showLanguageToast = (lang) => {
    const langName = languages.find(l => l.code === lang)?.nativeName;
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'language-toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z" fill="#00AF66"/>
        <path d="M8 10L9.5 11.5L12.5 8.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Dil dəyişdirildi: ${langName}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  return (
    <>
      <div className="language-switcher-pro" ref={dropdownRef}>
        {/* Toggle Button */}
        <button
          className={`lang-toggle ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Change language"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <svg className="globe-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span className="current-lang">{currentLanguage.label}</span>
          <svg className="chevron-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div className={`lang-dropdown ${isOpen ? 'open' : ''}`}>
          <div className="dropdown-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span>Dil seçin / Choose language</span>
          </div>

          <div className="lang-options">
            {languages.map((lang, index) => (
              <button
                key={lang.code}
                className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
                style={{ animationDelay: `${index * 40}ms` }}
                role="option"
                aria-selected={i18n.language === lang.code}
              >
                <div className="lang-content">
                  <div className="lang-primary">
                    <span className="lang-code">{lang.label}</span>
                    <span className="lang-native">{lang.nativeName}</span>
                  </div>
                  <span className="lang-region">{lang.region}</span>
                </div>
                
                {i18n.language === lang.code && (
                  <svg className="check-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#00AF66"/>
                    <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="dropdown-footer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>Dil avtomatik yadda saxlanılır</span>
          </div>
        </div>
      </div>

      <style>{`
        .language-switcher-pro {
          position: relative;
          display: inline-block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        /* ========== TOGGLE BUTTON ========== */
        .lang-toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 15px;
          background: linear-gradient(135deg, #43280ab6 0%, #5a3a14 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(67, 40, 10, 0.2), 
                      0 4px 16px rgba(67, 40, 10, 0.1);
          position: relative;
          overflow: hidden;
        }

        .lang-toggle::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .lang-toggle:hover::before {
          opacity: 1;
        }

        .lang-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(67, 40, 10, 0.25), 
                      0 8px 24px rgba(67, 40, 10, 0.15);
        }

        .lang-toggle:active {
          transform: translateY(0);
        }

        .lang-toggle.active {
          background: linear-gradient(135deg, #5a3a14 0%, #6b4a20 100%);
        }

        .lang-toggle .globe-icon {
          animation: rotateGlobe 20s linear infinite;
          flex-shrink: 0;
        }

        @keyframes rotateGlobe {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .lang-toggle:hover .globe-icon {
          animation: rotateGlobe 3s linear infinite;
        }

        .lang-toggle .current-lang {
          font-weight: 700;
          letter-spacing: 0.8px;
          font-size: 13px;
        }

        .lang-toggle .chevron-icon {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .lang-toggle.active .chevron-icon {
          transform: rotate(180deg);
        }

        /* ========== DROPDOWN ========== */
        .lang-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 320px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12),
                      0 4px 16px rgba(0, 0, 0, 0.08),
                      0 0 0 1px rgba(0, 0, 0, 0.04);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px) scale(0.95);
          transform-origin: top right;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          overflow: hidden;
        }

        .lang-dropdown.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        /* Dropdown Header */
        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 18px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
        }

        .dropdown-header svg {
          color: #43280a;
          flex-shrink: 0;
        }

        .dropdown-header span {
          font-size: 13px;
          font-weight: 600;
          color: #43280a;
          letter-spacing: 0.3px;
        }

        /* Language Options */
        .lang-options {
          padding: 8px;
          max-height: 280px;
          overflow-y: auto;
        }

        .lang-options::-webkit-scrollbar {
          width: 6px;
        }

        .lang-options::-webkit-scrollbar-track {
          background: transparent;
        }

        .lang-options::-webkit-scrollbar-thumb {
          background: #e0e0e0;
          border-radius: 3px;
        }

        .lang-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 12px;
          background: transparent;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 4px;
          animation: slideIn 0.3s ease forwards;
          opacity: 0;
          position: relative;
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
        }

        .lang-option:hover {
          background: linear-gradient(135deg, #f8f5f0 0%, #f5f0e8 100%);
          transform: translateX(4px);
        }

        .lang-option.active {
          background: linear-gradient(135deg, #43280a10 0%, #43280a18 100%);
        }

        .lang-option.active:hover {
          background: linear-gradient(135deg, #43280a18 0%, #43280a20 100%);
        }

        .lang-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          flex: 1;
        }

        .lang-primary {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .lang-code {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 24px;
          background: linear-gradient(135deg, #43280a 0%, #5a3a14 100%);
          color: white;
          font-size: 11px;
          font-weight: 800;
          border-radius: 6px;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(67, 40, 10, 0.2);
        }

        .lang-native {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .lang-region {
          font-size: 12px;
          color: #666;
          font-weight: 500;
          margin-left: 42px;
        }

        .lang-option:hover .lang-native {
          color: #43280a;
        }

        .lang-option:hover .lang-region {
          color: #5a3a14;
        }

        .lang-option.active .lang-native {
          color: #43280a;
          font-weight: 700;
        }

        .lang-option.active .lang-region {
          color: #5a3a14;
          font-weight: 600;
        }

        .check-icon {
          flex-shrink: 0;
          animation: checkPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes checkPop {
          0% { transform: scale(0) rotate(-45deg); }
          50% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        /* Dropdown Footer */
        .dropdown-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
        }

        .dropdown-footer svg {
          color: #666;
          flex-shrink: 0;
        }

        .dropdown-footer span {
          font-size: 11px;
          color: #666;
          font-weight: 500;
        }

        /* ========== TOAST NOTIFICATION ========== */
        .language-toast {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12),
                      0 4px 16px rgba(0, 0, 0, 0.08);
          z-index: 10000;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .language-toast.show {
          opacity: 1;
          transform: translateY(0);
        }

        .language-toast span {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 768px) {
          .lang-toggle {
            padding: 8px 12px;
            font-size: 13px;
            gap: 6px;
          }

          .lang-toggle .globe-icon {
            width: 16px;
            height: 16px;
          }

          .lang-dropdown {
            width: 280px;
          }

          .dropdown-header {
            padding: 14px 16px;
          }

          .lang-option {
            padding: 12px 10px;
          }

          .lang-native {
            font-size: 14px;
          }

          .lang-region {
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .lang-toggle {
            padding: 7px 10px;
            font-size: 12px;
            gap: 5px;
          }

          .lang-toggle .globe-icon {
            width: 15px;
            height: 15px;
          }

          .lang-dropdown {
            width: 260px;
            right: -10px;
          }

          .lang-option {
            padding: 10px 8px;
          }

          .lang-code {
            width: 28px;
            height: 22px;
            font-size: 10px;
          }

          .lang-native {
            font-size: 13px;
          }

          .lang-region {
            font-size: 10px;
            margin-left: 38px;
          }

          .language-toast {
            bottom: 20px;
            right: 20px;
            left: 20px;
            padding: 12px 16px;
          }

          .language-toast span {
            font-size: 13px;
          }
        }

        /* Accessibility */
        .lang-toggle:focus-visible {
          outline: 3px solid #43280a;
          outline-offset: 3px;
        }

        .lang-option:focus-visible {
          outline: 2px solid #43280a;
          outline-offset: -2px;
        }

        /* Dark mode support (optional) */
        @media (prefers-color-scheme: dark) {
          .lang-dropdown {
            background: #1a1a1a;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          }

          .dropdown-header,
          .dropdown-footer {
            background: linear-gradient(135deg, #2a2a2a 0%, #252525 100%);
            border-color: rgba(255, 255, 255, 0.1);
          }

          .dropdown-header span,
          .dropdown-header svg,
          .dropdown-footer span,
          .dropdown-footer svg {
            color: #e0e0e0;
          }

          .lang-option {
            color: #e0e0e0;
          }

          .lang-option:hover {
            background: linear-gradient(135deg, #2a2a2a 0%, #323232 100%);
          }

          .lang-native {
            color: #e0e0e0;
          }

          .lang-region {
            color: #999;
          }

          .language-toast {
            background: #1a1a1a;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          }

          .language-toast span {
            color: #e0e0e0;
          }
        }
      `}</style>
    </>
  );
};

export default LanguageSwitcher;