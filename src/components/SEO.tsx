import { useEffect } from 'react';
import type { FC } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export const SEO: FC<SEOProps> = ({
  title = 'AbilityCenterBI - Enterprise Data Analytics Platform',
  description = 'Transform your data into actionable insights with AbilityCenterBI. Connect Google Sheets, BigQuery, and generate beautiful dashboards with AI-powered analytics.',
  keywords = 'business intelligence, data analytics, dashboards, google sheets, bigquery, data visualization, charts, reports',
  image = '/og-image.png',
  url = 'https://ability-center-bi.vercel.app',
  type = 'website'
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) ||
                    document.querySelector(`meta[name="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', type);
    updateMetaTag('og:site_name', 'AbilityCenterBI');

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:url', url);

    // Additional SEO tags
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'AbilityCenterBI');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', url);

    // JSON-LD structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'AbilityCenterBI',
      description: description,
      url: url,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free business intelligence platform'
      },
      creator: {
        '@type': 'Organization',
        name: 'AbilityCenterBI',
        url: url
      }
    };

    let jsonLdElement = document.querySelector('#json-ld-seo');
    if (!jsonLdElement) {
      jsonLdElement = document.createElement('script');
      jsonLdElement.setAttribute('type', 'application/ld+json');
      jsonLdElement.setAttribute('id', 'json-ld-seo');
      document.head.appendChild(jsonLdElement);
    }
    jsonLdElement.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, url, type]);

  return null; // This component doesn't render anything
};
