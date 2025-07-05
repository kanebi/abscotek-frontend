import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Abscotek - Premium Tech & Electronics Store',
  description = 'Discover premium tech gadgets, smartphones, laptops, and electronics at Abscotek. Stay ahead with the latest technology designed for your lifestyle.',
  keywords = 'electronics, smartphones, laptops, tech gadgets, iPhone, Samsung, Apple, technology store',
  image = '/android-chrome-512x512.png',
  url = '',
  type = 'website',
  canonical = '',
  structuredData = null,
  noindex = false,
  nofollow = false,
  children
}) => {
  const robotsContent = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Abscotek" />
      {url && <meta property="og:url" content={url} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData])}
        </script>
      )}
      
      {/* Additional children (custom meta tags) */}
      {children}
    </Helmet>
  );
};

export default SEO; 