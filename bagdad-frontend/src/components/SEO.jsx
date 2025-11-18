import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

function SEO({ 
  titleAz, 
  titleEn, 
  titleRu, 
  descriptionAz, 
  descriptionEn, 
  descriptionRu,
  path = '' 
}) {
  const { i18n } = useTranslation();
  const baseUrl = "https://bagdad.com.az";
  
  const titles = {
    az: titleAz,
    en: titleEn,
    ru: titleRu
  };
  
  const descriptions = {
    az: descriptionAz,
    en: descriptionEn,
    ru: descriptionRu
  };
  
  const currentPath = i18n.language === 'az' ? path : `/${i18n.language}${path}`;
  const currentUrl = `${baseUrl}${currentPath}`;

  return (
    <Helmet>
      <title>{titles[i18n.language]}</title>
      <meta name="description" content={descriptions[i18n.language]} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={titles[i18n.language]} />
      <meta property="og:description" content={descriptions[i18n.language]} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Bağdad Azərbaycan" />
      <meta property="og:locale" content={
        i18n.language === 'az' ? 'az_AZ' : 
        i18n.language === 'en' ? 'en_US' : 'ru_RU'
      } />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={titles[i18n.language]} />
      <meta name="twitter:description" content={descriptions[i18n.language]} />
      
      {/* Geo tags */}
      <meta name="geo.region" content="AZ" />
      <meta name="geo.placename" content="Azerbaijan" />
    </Helmet>
  );
}

export default SEO;