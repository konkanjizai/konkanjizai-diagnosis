export const initGoogleAdsTag = () => {
  const adsId = import.meta.env.VITE_GOOGLE_ADS_ID;
  if (!adsId) return;

  // @ts-ignore でTypeScriptエラーを無視
  if ((window as any).gtag) return;

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
  
  // @ts-ignore でTypeScriptエラーを無視
  (window as any).gtag = function(){
    (window as any).dataLayer.push(arguments);
  };
};

// 診断完了時のコンバージョン送信
export const trackConversion = () => {
  const adsId = import.meta.env.VITE_GOOGLE_ADS_ID;
  const conversionLabel = import.meta.env.VITE_CONVERSION_LABEL;
  
  // @ts-ignore でTypeScriptエラーを無視
  if ((window as any).gtag && adsId && conversionLabel) {
    (window as any).gtag('event', 'conversion', {
      'send_to': `AW-${adsId}/${conversionLabel}`
    });
  }
};