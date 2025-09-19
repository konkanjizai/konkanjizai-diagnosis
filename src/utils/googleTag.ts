// @ts-nocheck
// 修正済み googleTag.ts - 不適切なコンバージョントラッキングを削除

export const initGoogleAdsTag = () => {
  const adsId = '924434837';
  if (!adsId) return;

  // GTMが既に存在するかチェック（GTMのdataLayerが存在するか）
  if (window.dataLayer && window.dataLayer.length > 0) {
    // GTMが存在する場合：GTM経由でGoogle広告も管理
    console.log('GTM detected - using GTM for Google Ads tracking');
    
    // GTM用にGoogle広告設定をdataLayerにpush
    window.dataLayer.push({
      'event': 'diagnosis_gtm_detected',
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

// ❌ 削除：trackConversion() 関数
// この関数は診断完了時に間違ったコンバージョンを送信していた
// 真のコンバージョンはUTAGEサンクスページで発火すべき

// GTM用のカスタムイベント送信関数
export const trackCustomEvent = (eventName, eventData = {}) => {
  if (window.dataLayer) {
    console.log(`Sending custom event: ${eventName}`, eventData);
    window.dataLayer.push({
      'event': eventName,
      ...eventData
    });
  }
};

// 診断進捗トラッキング
export const trackDiagnosisProgress = (questionNumber, answerValue) => {
  trackCustomEvent('diagnosis_progress', {
    'step': `question_${questionNumber}`,
    'question_id': questionNumber,
    'answer_value': answerValue
  });
};

// 診断完了トラッキング（注意：これはコンバージョンではない）
export const trackDiagnosisComplete = (diagnosisType, totalScore, averageScore) => {
  trackCustomEvent('diagnosis_complete', {
    'diagnosis_type': diagnosisType,
    'total_score': totalScore,
    'average_score': averageScore
  });
};