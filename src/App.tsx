import { useEffect, useState } from 'react'
import FreeTrialAssessment from './components/NewFreeTrialAssessment'
import DetailedAssessment from './components/DetailedAssessment'
import { initGoogleAdsTag } from './utils/googleTag'

function App() {
  const [assessmentType, setAssessmentType] = useState<string>('');

  useEffect(() => {
    // URLパラメータを取得
    const searchParams = new URLSearchParams(window.location.search);
    const typeParam = searchParams.get('type') || 'basic';
    setAssessmentType(typeParam);
    
    initGoogleAdsTag();
  }, []);

  // URLパラメータに応じて診断を切り替え
  if (assessmentType === 'detailed') {
    return <DetailedAssessment />;  // 15問版
  } else {
    return <FreeTrialAssessment />; // 5問版（デフォルト）
  }
}

export default App