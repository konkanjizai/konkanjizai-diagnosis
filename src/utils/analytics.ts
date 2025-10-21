// @ts-nocheck

/**
 * Google Analytics 4 イベント送信関数
 * 診断アプリの各ステップを測定
 */

/**
 * 基本的なイベント送信
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
    console.log('📊 GA4 Event:', eventName, params);
  }
};

/**
 * 診断開始（1問目に回答した時）
 */
export const trackDiagnosisStart = () => {
  trackEvent('diagnosis_start', {
    event_category: 'diagnosis',
    event_label: 'start'
  });
};

/**
 * 各質問への回答
 * @param questionNumber 質問番号（1-5）
 * @param value 回答値（1-5）
 */
export const trackQuestionAnswer = (questionNumber: number, value: number) => {
  trackEvent('question_answer', {
    event_category: 'diagnosis',
    event_label: `question_${questionNumber}`,
    question_number: questionNumber,
    answer_value: value
  });
};

/**
 * 診断完了（5問すべて回答）
 * @param totalScore 合計スコア
 * @param averageScore 平均スコア
 */
export const trackDiagnosisComplete = (totalScore: number, averageScore: number) => {
  trackEvent('diagnosis_complete', {
    event_category: 'diagnosis',
    event_label: 'complete',
    total_score: totalScore,
    average_score: averageScore
  });
};

/**
 * 診断結果表示
 * @param resultType 診断タイプ
 * @param score スコア
 */
export const trackResultView = (resultType: string, score: number) => {
  trackEvent('result_view', {
    event_category: 'result',
    event_label: resultType,
    result_type: resultType,
    score: score
  });
};

/**
 * CTAボタンクリック
 * @param resultType 診断タイプ
 */
export const trackCTAClick = (resultType: string) => {
  trackEvent('cta_click', {
    event_category: 'conversion',
    event_label: resultType,
    result_type: resultType
  });
};

/**
 * UTAGE遷移（最終コンバージョン）
 * @param resultType 診断タイプ
 * @param score スコア
 */
export const trackOptinTransition = (resultType: string, score: number) => {
  trackEvent('optin_transition', {
    event_category: 'conversion',
    event_label: resultType,
    result_type: resultType,
    score: score
  });
};