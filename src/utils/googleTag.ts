// @ts-nocheck
export const initGoogleAdsTag = () => {
  const adsId = '924434837';
  if (!adsId) return;

  // GTMが既に存在するかチェック（GTMのdataLayerが存在するか）
  if (window.dataLayer && window.dataLayer.length > 0) {
    // GTMが存在する場合：GTM経由でGoogle広告も管理
    console.log('GTM detected - using GTM for Google Ads tracking');
    
    // GTM用にGoogle広告設定をdataLayerにpush（修正：独自イベント名を使用）
    window.dataLayer.push({
      'event': 'diagnosis_gtm_detected', // 修正：gtm.dom → 独自イベント名に変更
      'google_ads_id': adsId
    });
    return;
  }

  // GTMがない場合：従来の直接実装（フォールバック）
  console.log('GTM not detected - using direct Google Ads implementation');
  
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
  
  // 方法1: GTMのdataLayerを使用（推奨）
  if (window.dataLayer) {
    console.log('Sending conversion via GTM dataLayer');
    window.dataLayer.push({
      'event': 'conversion',
      'google_conversion_id': adsId,
      'google_conversion_label': conversionLabel,
      'google_conversion_value': 1,
      'conversion_type': 'diagnosis_complete'
    });
  }
  
  // 方法2: 従来のgtag実装（フォールバック）
  if (window.gtag && adsId && conversionLabel) {
    console.log('Sending conversion via direct gtag');
    window.gtag('event', 'conversion', {
      'send_to': `AW-${adsId}/${conversionLabel}`
    });
  }
};

// GTM用のカスタムイベント送信関数（新機能）
export const trackCustomEvent = (eventName, eventData = {}) => {
  if (window.dataLayer) {
    console.log(`Sending custom event: ${eventName}`, eventData);
    window.dataLayer.push({
      'event': eventName,
      ...eventData
    });
  }
};

// 診断進捗トラッキング（新機能）
export const trackDiagnosisProgress = (questionNumber, answerValue) => {
  trackCustomEvent('diagnosis_progress', {
    'step': `question_${questionNumber}`,
    'question_id': questionNumber,
    'answer_value': answerValue
  });
};

// 診断完了トラッキング（新機能）
export const trackDiagnosisComplete = (diagnosisType, totalScore, averageScore) => {
  trackCustomEvent('diagnosis_complete', {
    'diagnosis_type': diagnosisType,
    'total_score': totalScore,
    'average_score': averageScore
  });
};