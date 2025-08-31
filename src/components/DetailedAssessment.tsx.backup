import { useState } from 'react';

interface DiagnosisResults {
  diagnosisType: string;
  averageScore: number;
  totalScore: number;
  bodyEnergyScore: number;
  emotionThoughtScore: number;
  lifeExistenceScore: number;
  allResponses: Record<number, number>;
}

const DetailedAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [isSubmittingToUTAGE, setIsSubmittingToUTAGE] = useState(false);

  // URLパラメータからユーザーメールを取得
  const getUserEmail = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('email') || localStorage.getItem('userEmail') || '';
  };

  // 診断結果を計算する関数
  const calculateDiagnosisResults = (): DiagnosisResults => {
    const responseValues = Object.values(responses);
    const totalScore = responseValues.reduce((sum, val) => sum + val, 0);
    const averageScore = totalScore / 15;

    // 3領域別スコア計算（問1-5: 身体, 問6-10: 感情思考, 問11-15: 人生存在）
    const bodyEnergyScore = [1,2,3,4,5].reduce((sum, q) => sum + (responses[q] || 0), 0);
    const emotionThoughtScore = [6,7,8,9,10].reduce((sum, q) => sum + (responses[q] || 0), 0);
    const lifeExistenceScore = [11,12,13,14,15].reduce((sum, q) => sum + (responses[q] || 0), 0);

    // 診断タイプを決定
    let diagnosisType = '';
    if (averageScore >= 4.5) diagnosisType = '存在の意味探求';
    else if (averageScore >= 3.5) diagnosisType = '深い疲労感';
    else if (averageScore >= 2.5) diagnosisType = '本音建前ギャップ';
    else if (averageScore >= 1.5) diagnosisType = '微細な違和感';
    else diagnosisType = '深い安定感';

    return {
      diagnosisType,
      averageScore: Math.round(averageScore * 10) / 10,
      totalScore,
      bodyEnergyScore,
      emotionThoughtScore,
      lifeExistenceScore,
      allResponses: responses
    };
  };

  // 診断結果をローカルストレージに保存する関数
  const saveDiagnosisResults = (diagnosisResults: DiagnosisResults): void => {
    try {
      // 診断結果をローカルストレージに保存
      localStorage.setItem('diagnosisResults15', JSON.stringify({
        ...diagnosisResults,
        timestamp: new Date().toISOString()
      }));
      console.log('💾 診断結果をローカルストレージに保存しました');
    } catch (error) {
      console.error('❌ ローカルストレージ保存エラー:', error);
    }
  };

  // 診断完了処理（optin15ページへ遷移）
  const handleDiagnosisComplete = async () => {
    console.log('🚀 診断完了ボタンが押されました');
    setIsSubmittingToUTAGE(true);

    const diagnosisResults = calculateDiagnosisResults();
    const userEmail = getUserEmail();

    console.log('📧 ユーザーメール:', userEmail);
    console.log('📊 診断結果:', diagnosisResults);

    // メールアドレスがない場合の処理
    if (!userEmail) {
      console.warn('⚠️ メールアドレスが見つかりません');
      // メールアドレスなしでも診断結果は保存して遷移を許可
    }

    // 診断結果をローカルストレージに保存
    saveDiagnosisResults(diagnosisResults);

    // 全回答データを読みやすい形式に変換
    // 例：Q1:4, Q2:5, Q3:4... という形式
    const formattedResponses = Object.entries(diagnosisResults.allResponses)
      .map(([question, score]) => `Q${question}:${score}`)
      .join(', ');

    // URLパラメータを構築（診断データを含む）
    const params = new URLSearchParams({
      mail: userEmail || '', // 'mail'がUTAGEの標準パラメータ名
      free22: diagnosisResults.diagnosisType,
      free23: diagnosisResults.averageScore.toString(),
      free24: diagnosisResults.totalScore.toString(),
      free25: diagnosisResults.bodyEnergyScore.toString(),
      free26: diagnosisResults.emotionThoughtScore.toString(),
      free27: diagnosisResults.lifeExistenceScore.toString(),
      free28: formattedResponses // 読みやすい形式で保存
    });

    // 15問オプトインページへリダイレクト
    const redirectUrl = `https://online.konkanjizai.com/p/optin15?${params.toString()}`;
    
    console.log('🔄 オプトインページへリダイレクト:', redirectUrl);
    console.log('📝 送信データ:', {
      mail: userEmail,
      free22: diagnosisResults.diagnosisType,
      free23: diagnosisResults.averageScore,
      free24: diagnosisResults.totalScore,
      free25: diagnosisResults.bodyEnergyScore,
      free26: diagnosisResults.emotionThoughtScore,
      free27: diagnosisResults.lifeExistenceScore,
      free28: formattedResponses
    });
    
    // 少し待機してからリダイレクト（UXのため）
    await new Promise(resolve => setTimeout(resolve, 500));
    
    window.location.href = redirectUrl;
  };

  // 15問の質問データ
  const questions = [
    {
      id: 1,
      category: "身体・エネルギー",
      text: "どんなに休んでも、心の奥の疲れが取れない感覚がある",
      categoryColor: "#10B981"
    },
    {
      id: 2,
      category: "身体・エネルギー", 
      text: "身体は元気だが、なぜかエネルギーが湧いてこない",
      categoryColor: "#10B981"
    },
    {
      id: 3,
      category: "身体・エネルギー",
      text: "十分寝ているのに、朝起きるのがつらい",
      categoryColor: "#10B981"
    },
    {
      id: 4,
      category: "身体・エネルギー",
      text: "以前は楽しめていたことに、エネルギーを感じられない",
      categoryColor: "#10B981"
    },
    {
      id: 5,
      category: "身体・エネルギー",
      text: "頭では分かっているのに、身体がついてこない感覚がある",
      categoryColor: "#10B981"
    },
    {
      id: 6,
      category: "感情・思考・役割",
      text: "周りから評価されている自分が、本当にその評価に値する人間なのか疑問に思うことがある",
      categoryColor: "#EC4899"
    },
    {
      id: 7,
      category: "感情・思考・役割",
      text: "「本当の自分」と「演じている自分」のギャップを感じる",
      categoryColor: "#EC4899"
    },
    {
      id: 8,
      category: "感情・思考・役割",
      text: "成功や成果を上げても、心から喜べない",
      categoryColor: "#EC4899"
    },
    {
      id: 9,
      category: "感情・思考・役割",
      text: "他人の期待に応えることが、自分らしさを失っているように感じる",
      categoryColor: "#EC4899"
    },
    {
      id: 10,
      category: "感情・思考・役割",
      text: "自分の感情や欲求が、よく分からなくなることがある",
      categoryColor: "#EC4899"
    },
    {
      id: 11,
      category: "人生・存在・意味",
      text: "恵まれているのに『人生これでいいの？』と罪悪感を感じる",
      categoryColor: "#8B5CF6"
    },
    {
      id: 12,
      category: "人生・存在・意味",
      text: "成功するほど強くなる孤独感を感じる",
      categoryColor: "#8B5CF6"
    },
    {
      id: 13,
      category: "人生・存在・意味",
      text: "自分が本当に望んでいることが分からない",
      categoryColor: "#8B5CF6"
    },
    {
      id: 14,
      category: "人生・存在・意味",
      text: "人生の意味や目的について、深く考えることが多い",
      categoryColor: "#8B5CF6"
    },
    {
      id: 15,
      category: "人生・存在・意味",
      text: "占いやスピリチュアル、心理学に答えを求めてしまう",
      categoryColor: "#8B5CF6"
    }
  ];

  const handleResponse = (questionId: number, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 最後の質問の場合、結果表示
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 結果表示部分
  if (showResult) {
    const result = calculateDiagnosisResults();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-white">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ✨
            </div>
            <h1 className="text-3xl font-bold mb-4">
              15問詳細診断が完了しました
            </h1>
            <p className="text-xl opacity-90">
              あなたのタイプ：<strong>{result.diagnosisType}</strong>
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span>身体・エネルギー</span>
                <span className="font-bold">{result.bodyEnergyScore}/25点</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(result.bodyEnergyScore / 25) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span>感情・思考・役割</span>
                <span className="font-bold">{result.emotionThoughtScore}/25点</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(result.emotionThoughtScore / 25) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span>人生・存在・意味</span>
                <span className="font-bold">{result.lifeExistenceScore}/25点</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(result.lifeExistenceScore / 25) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-yellow-400/20 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-3">📊 総合スコア</h2>
            <div className="flex justify-between items-center">
              <span className="text-lg">合計点数</span>
              <span className="text-2xl font-bold">{result.totalScore}/75点</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg">平均スコア</span>
              <span className="text-2xl font-bold">{result.averageScore}/5.0</span>
            </div>
          </div>

          <button
            onClick={handleDiagnosisComplete}
            disabled={isSubmittingToUTAGE}
            className="w-full px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg rounded-xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmittingToUTAGE ? '診断結果を準備中...' : '詳細な診断結果を受け取る →'}
          </button>

          <p className="text-center text-sm opacity-80 mt-4">
            ※ ボタンをクリックすると、お名前の入力ページへ移動します<br/>
            その後、詳細な診断結果をメールでお送りします
          </p>
        </div>
      </div>
    );
  }

  // 質問表示部分
  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-white">
        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm opacity-80">進捗</span>
            <span className="text-sm opacity-80">{currentStep + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* カテゴリー表示 */}
        <div className="text-center mb-6">
          <span 
            className="inline-block px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: currentQuestion.categoryColor + '30', color: 'white' }}
          >
            {currentQuestion.category}
          </span>
        </div>

        {/* 質問文 */}
        <h2 className="text-2xl font-bold text-center mb-8">
          {currentQuestion.text}
        </h2>

        {/* 回答選択肢 */}
        <div className="space-y-3 mb-8">
          {[1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              onClick={() => handleResponse(currentQuestion.id, value)}
              className={`w-full p-4 rounded-xl transition-all duration-200 ${
                responses[currentQuestion.id] === value
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-4 text-xl">
                  {responses[currentQuestion.id] === value ? '●' : '○'}
                </span>
                <span>
                  {value === 1 && 'まったく当てはまらない'}
                  {value === 2 && 'あまり当てはまらない'}
                  {value === 3 && 'どちらとも言えない'}
                  {value === 4 && 'やや当てはまる'}
                  {value === 5 && 'とても当てはまる'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-white/10 text-white rounded-xl disabled:opacity-50 hover:bg-white/20 transition-all duration-200"
          >
            ← 前の質問
          </button>
          <button
            onClick={handleNext}
            disabled={!responses[currentQuestion.id]}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-xl disabled:opacity-50 hover:from-yellow-300 hover:to-orange-400 transition-all duration-300"
          >
            {currentStep === questions.length - 1 ? '結果を見る' : '次の質問 →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedAssessment;