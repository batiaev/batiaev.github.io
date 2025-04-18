import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const GTM_ID = 'G-ZQVRL217XS';

export function GoogleTagManager() {
  useEffect(() => {
    // Load GTM script asynchronously
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });

    // Load GTM configuration
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GTM_ID}', {
        page_path: window.location.pathname,
        transport_url: 'https://www.google-analytics.com',
      });
    `;
    document.head.appendChild(gtmScript);

    return () => {
      // Cleanup
      document.head.removeChild(script);
      document.head.removeChild(gtmScript);
    };
  }, []);

  return null;
} 