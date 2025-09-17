// @ts-nocheck
export const initGoogleAdsTag = () => {
  const adsId = process.env.NODE_ENV === 'production' ? '924434837' : '924434837';
  if (!adsId) return;

  if (window.gtag) return;

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=AW-${adsId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-${adsId}');
  `;
  document.head.appendChild(script2);
  
  window.gtag = function(){
    window.dataLayer.push(arguments);
  };
};

export const trackConversion = () => {
  const adsId = '924434837';
  const conversionLabel = 'DOZuCOf2nrEaEJWD57gD';
  
  if (window.gtag && adsId && conversionLabel) {
    window.gtag('event', 'conversion', {
      'send_to': `AW-${adsId}/${conversionLabel}`
    });
  }
};