export const initGoogleAdsTag = () => {
  const adsId = import.meta.env.VITE_GOOGLE_ADS_ID;
  if (!adsId) return;

  if (window.gtag) return;

  // Google広告のタグを読み込み
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=AW-${adsId}`;
  document.head.appendChild(script1);

  // gtag関数を設定
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

// 診断完了時のコンバージョン送信
export const trackConversion = () => {
  const adsId = import.meta.env.VITE_GOOGLE_ADS_ID;
  const conversionLabel = import.meta.env.VITE_CONVERSION_LABEL;
  
  if (window.gtag && adsId && conversionLabel) {
    window.gtag('event', 'conversion', {
      'send_to': `AW-${adsId}/${conversionLabel}`
    });
  }
};