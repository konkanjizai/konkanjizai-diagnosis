import React, { useState, useEffect } from 'react';

// ユニークIDを生成する関数
const generateUniqueId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// 診断結果を保存してURLを返す関数
const saveResultAndGetUrl = async (
  userName: string,
  responses: number[],
  totalScore: number,
  diagnosisType: string
) => {
  const id = generateUniqueId();
  
  // 3領域のスコアを計算
  const bodyScore = responses.slice(0, 5).reduce((a, b) => a + b, 0);
  const emotionScore = responses.slice(5, 10).reduce((a, b) => a + b, 0);
  const meaningScore = responses.slice(10, 15).reduce((a, b) => a + b, 0);
  
  const resultData = {
    userName,
    totalScore,
    diagnosisType,
    bodyScore,
    emotionScore,
    meaningScore,
    responses,
    timestamp: new Date().toISOString()
  };
  
  try {
    // Netlify Functionに送信
    const response = await fetch('/.netlify/functions/save-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, resultData })
    });
    
    if (response.ok) {
      // 診断結果ページのURL
      return `https://eloquent-fairy-7272c1.netlify.app/.netlify/functions/get-result?id=${id}`;
    }
  } catch (error) {
    console.error('Error saving result:', error);
  }
  
  return null;
};

interface DetailedAssessmentProps {
  userName?: string;
  userEmail?: string;
}

const DetailedAssessment: React.FC<DetailedAssessmentProps> = ({ userName = '', userEmail = '' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showPreResult, setShowPreResult] = useState(false);
  const [isSubmittingToUTAGE, setIsSubmittingToUTAGE] = useState(false);

  // URLパラメータから情報を取得（UTAGEから遷移してきた場合）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get('email');
    const nameFromUrl = params.get('name');
    
    if (emailFromUrl) {
      console.log('Email from URL:', emailFromUrl);
    }
    if (nameFromUrl) {
      console.log('Name from URL:', nameFromUrl);
    }
  }, []);

  // 質問変更時に自動スクロール
  useEffect(() => {
    if (showPreResult) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, showPreResult]);

  // 15問の質問データ（オリジナル版）
  const questions = [
    // 身体・エネルギー領域（問1-5）
    {
      id: 1,
      category: "身体・エネルギー",
      categoryColor: "#10B981",
      categoryIcon: "💪",
      text: "どんなに休んでも、心の奥の疲れが取れない感覚がある",
      explanation: "身体の疲労は心の状態を映す鏡です"
    },
    {
      id: 2,
      category: "身体・エネルギー",
      categoryColor: "#10B981",
      categoryIcon: "💪",
      text: "朝起きた瞬間から、既に『今日も一日頑張らなければ』という重圧を感じる",
      explanation: "朝の状態は一日のエネルギーの基盤です"
    },
    {
      id: 3,
      category: "身体・エネルギー",
      categoryColor: "#10B981",
      categoryIcon: "💪",
      text: "人前に出る時や重要な場面で、身体が無意識に緊張してしまう",
      explanation: "身体の緊張は心の防御反応の表れです"
    },
    {
      id: 4,
      category: "身体・エネルギー",
      categoryColor: "#10B981",
      categoryIcon: "💪",
      text: "『リラックスしなさい』と言われても、どうすればいいのかわからない",
      explanation: "リラックス能力は心身の調和の指標です"
    },
    {
      id: 5,
      category: "身体・エネルギー",
      categoryColor: "#10B981",
      categoryIcon: "💪",
      text: "一日の終わりには、まるで電池が切れたような虚脱感を感じる",
      explanation: "エネルギーの消耗パターンは生き方を反映します"
    },
    
    // 感情・思考・役割領域（問6-10）
    {
      id: 6,
      category: "感情・思考・役割",
      categoryColor: "#EC4899",
      categoryIcon: "🧠",
      text: "『○○先生』『○○さん』と呼ばれる自分と、本当の自分の間にギャップを感じる",
      explanation: "自己評価と他者評価のギャップが偽物感を生みます"
    },
    {
      id: 7,
      category: "感情・思考・役割",
      categoryColor: "#EC4899",
      categoryIcon: "🧠",
      text: "本当は『疲れた』『休みたい』と言いたいのに、そんなことは言えない",
      explanation: "本音の封印は心の負担を増大させます"
    },
    {
      id: 8,
      category: "感情・思考・役割",
      categoryColor: "#EC4899",
      categoryIcon: "🧠",
      text: "周囲から期待されればされるほど、『期待に応えなければ』というプレッシャーで苦しくなる",
      explanation: "期待への重圧は役割疲れの典型的症状です"
    },
    {
      id: 9,
      category: "感情・思考・役割",
      categoryColor: "#EC4899",
      categoryIcon: "🧠",
      text: "成果を出しても『まぐれだった』『次はうまくいかないかも』と不安になる",
      explanation: "成功への不安は深い自信不足の表れです"
    },
    {
      id: 10,
      category: "感情・思考・役割",
      categoryColor: "#EC4899",
      categoryIcon: "🧠",
      text: "いつも『できる人』『しっかりした人』という仮面をかぶっていて、それを外すのが怖い",
      explanation: "仮面疲労は偽物感の最も典型的な症状です"
    },
    
    // 人生・存在・意味領域（問11-15）
    {
      id: 11,
      category: "人生・存在・意味",
      categoryColor: "#6366F1",
      categoryIcon: "🧘‍♀️",
      text: "これだけ恵まれているのに『人生これでいいの？』と思ってしまう自分に罪悪感を感じる",
      explanation: "成功への虚無感は魂からのサインです"
    },
    {
      id: 12,
      category: "人生・存在・意味",
      categoryColor: "#6366F1",
      categoryIcon: "🧘‍♀️",
      text: "成功するほど強くなる孤独感を感じる",
      explanation: "成功者特有の孤独感は深い存在不安の表れです"
    },
    {
      id: 13,
      category: "人生・存在・意味",
      categoryColor: "#6366F1",
      categoryIcon: "🧘‍♀️",
      text: "自分が本当に望んでいることが分からない",
      explanation: "存在意義への問いは魂の渇望を表します"
    },
    {
      id: 14,
      category: "人生・存在・意味",
      categoryColor: "#6366F1",
      categoryIcon: "🧘‍♀️",
      text: "「もし今すべてを失ったら、私には何が残るんだろう」と考えて不安になる",
      explanation: "内なる空虚感は精神的充足の不足を示します"
    },
    {
      id: 15,
      category: "人生・存在・意味",
      categoryColor: "#6366F1",
      categoryIcon: "🧘‍♀️",
      text: "占いやスピリチュアルセッション、心理学などをいろいろ試したが「手がかりすら掴めない」",
      explanation: "外側への探求は内なる答えの渇望を表します"
    }
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

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
      setShowPreResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 診断結果を計算する関数
  const calculateDiagnosisResults = () => {
    const bodyEnergyScore = [1, 2, 3, 4, 5].reduce((sum, id) => sum + (responses[id] || 0), 0);
    const emotionRoleScore = [6, 7, 8, 9, 10].reduce((sum, id) => sum + (responses[id] || 0), 0);
    const lifeMeaningScore = [11, 12, 13, 14, 15].reduce((sum, id) => sum + (responses[id] || 0), 0);
    
    const totalScore = bodyEnergyScore + emotionRoleScore + lifeMeaningScore;
    const averageScore = totalScore / 15;

    return {
      totalScore,
      averageScore,
      bodyEnergyScore,
      emotionRoleScore,
      lifeMeaningScore,
      responses
    };
  };

  // 診断タイプを取得する関数
  const getDiagnosisType = (totalScore: number): string => {
    if (totalScore <= 15) return "偽物感 ごく軽度";
    if (totalScore <= 30) return "偽物感 軽度";
    if (totalScore <= 45) return "偽物感 中度";
    if (totalScore <= 60) return "偽物感 重度";
    return "偽物感 極度";
  };

  // 診断完了時の処理（オプトインページへ遷移）
  const handleDiagnosisComplete = async () => {
    console.log('🚀 診断完了処理開始');
    setIsSubmittingToUTAGE(true);

    const diagnosisResults = calculateDiagnosisResults();
    const diagnosisType = getDiagnosisType(diagnosisResults.totalScore);
    
    // 診断結果ページを保存してURLを取得
    const resultPageUrl = await saveResultAndGetUrl(
      userName || '',
      Object.values(responses),
      diagnosisResults.totalScore,
      diagnosisType
    );
    
    // URLパラメータを作成（GETパラメータとして送信）
    const params = new URLSearchParams({
      mail: userEmail || '',
      name: userName || '',
      free22: diagnosisResults.totalScore.toString(),
      free23: diagnosisType,
      free24: diagnosisResults.averageScore.toFixed(2),
      free25: diagnosisResults.bodyEnergyScore.toString(),
      free26: diagnosisResults.emotionRoleScore.toString(),
      free27: diagnosisResults.lifeMeaningScore.toString(),
      free28: JSON.stringify(diagnosisResults.responses),
      free29: resultPageUrl || ''
    });
    
    console.log('📊 送信データ:', {
      email: userEmail,
      name: userName,
      diagnosticData: diagnosisResults,
      resultPageUrl: resultPageUrl
    });
    
    // UTAGEオプトインページへGETパラメータ付きで遷移
    const UTAGE_OPTIN_URL = "https://online.konkanjizai.com/p/optin15";
    window.location.href = `${UTAGE_OPTIN_URL}?${params.toString()}`;
  };

  // デバッグ用：取得したパラメータの表示（開発時のみ）
  const showDebugInfo = userEmail || userName;

  // 診断完了画面（新規作成）
  if (showPreResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
            
            {/* デバッグ情報表示（開発時のみ） */}
            {showDebugInfo && (
              <div className="bg-blue-500/20 border border-blue-400/50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-bold text-blue-300 mb-2">🔧 取得済み情報（開発確認用）</h3>
                <div className="text-xs text-blue-200">
                  <p>メールアドレス: {userEmail || '未取得'}</p>
                  <p>お名前: {userName || '未取得'}</p>
                </div>
              </div>
            )}

            {/* ヘッダー */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
                診断が完了しました
              </h1>
              <p className="text-white/80 text-lg">
                15問の回答から、あなただけの特別な診断レポートを作成しました
              </p>
            </div>

            {/* 診断レポート概要 */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                📊 あなただけの偽物感診断レポート
              </h2>
              
              <div className="space-y-6">
                {/* レポート内容紹介 */}
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-5 rounded-xl">
                  <h3 className="font-bold text-white mb-3 flex items-center">
                    <span className="text-2xl mr-2">📈</span>
                    <span>詳細な数値分析</span>
                  </h3>
                  <ul className="text-white/90 space-y-2 ml-8">
                    <li>• 偽物感の強さを5段階で判定</li>
                    <li>• 3つの領域（身体・感情・人生）別スコア</li>
                    <li>• あなたのバランス分析チャート</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-5 rounded-xl">
                  <h3 className="font-bold text-white mb-3 flex items-center">
                    <span className="text-2xl mr-2">🔍</span>
                    <span>偽物感の正体解明</span>
                  </h3>
                  <ul className="text-white/90 space-y-2 ml-8">
                    <li>• 実はあなたの偽物感には世界的に認められた正式名称があります</li>
                    <li>• 成功者の70%以上が経験する「インポスター症候群」について</li>
                    <li>• なぜ優秀な人ほど強く感じるのか、その科学的根拠</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-5 rounded-xl">
                  <h3 className="font-bold text-white mb-3 flex items-center">
                    <span className="text-2xl mr-2">💡</span>
                    <span>個別化された分析</span>
                  </h3>
                  <ul className="text-white/90 space-y-2 ml-8">
                    <li>• あなたの回答パターンから見える心の状態</li>
                    <li>• 最も影響を受けている領域の特定</li>
                    <li>• 同じ症候群を持つ著名人の例（夏目漱石、マヤ・アンジェロウなど）</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-5 rounded-xl">
                  <h3 className="font-bold text-white mb-3 flex items-center">
                    <span className="text-2xl mr-2">🌟</span>
                    <span>希望のメッセージ</span>
                  </h3>
                  <ul className="text-white/90 space-y-2 ml-8">
                    <li>• あなたの偽物感は「欠陥」ではなく「優秀さの証明」である理由</li>
                    <li>• なぜこの症候群が起こるのか、その心理的メカニズム</li>
                    <li>• 解放への第一歩となる重要な気づき</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 価値提示 */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-yellow-400/30">
              <div className="text-center">
                <div className="text-3xl mb-3">🎁</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  通常30,000円相当の個別分析レポート
                </h3>
                <p className="text-white/90">
                  今なら<strong className="text-yellow-300">完全無料</strong>でお届けします
                </p>
                <p className="text-sm text-white/70 mt-2">
                  ※ この診断レポートは30日間いつでも閲覧可能です
                </p>
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={handleDiagnosisComplete}
                disabled={isSubmittingToUTAGE}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmittingToUTAGE ? '処理中...' : '診断レポートを読む →'}
              </button>
            </div>

            {/* シンプルな注記 */}
            <div className="text-center mt-6">
              <p className="text-white/60 text-sm">
                診断レポートは30日間いつでも読み返せます
              </p>
            </div>

            {/* やり直しオプション */}
            <div className="text-center">
              <div className="border-t border-white/20 pt-4">
                <p className="text-xs text-white/50 mb-2">
                  診断をやり直したい場合は...
                </p>
                <button 
                  onClick={() => {
                    setCurrentStep(0);
                    setResponses({});
                    setShowPreResult(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-white/60 text-sm hover:text-white/80 transition-colors underline"
                >
                  🔄 最初から診断をやり直す
                </button>
              </div>
            </div>

            {/* フッター */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-center text-white/60 text-sm">
                © 2025 魂感自在 All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 診断質問画面（既存のまま）
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8">
        
        {/* デバッグ情報表示（開発時のみ） */}
        {showDebugInfo && (
          <div className="bg-green-500/20 border border-green-400/50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-bold text-green-300 mb-2">🔧 URLパラメータ取得確認</h3>
            <div className="text-xs text-green-200">
              <p>メールアドレス: {userEmail || '未取得'}</p>
              <p>お名前: {userName || '未取得'}</p>
            </div>
          </div>
        )}

        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
            偽物感の正体診断〜完全版〜
          </h1>
          <p className="text-white/80">15問で徹底分析する深層心理</p>
        </div>

        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm">
              質問 {currentStep + 1} / {questions.length}
            </span>
            <span className="text-white/80 text-sm">
              {Math.round(progress)}% 完了
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 質問カード */}
        <div className="text-center mb-8">
          <div 
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: currentQuestion.categoryColor }}
          >
            {currentQuestion.category}
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 leading-relaxed">
            {currentQuestion.text}
          </h2>
          <p className="text-sm text-white/70 italic">
            {currentQuestion.explanation}
          </p>
        </div>

        {/* 選択肢（1-5のラジオボタン形式） */}
        <div className="space-y-3 mb-8">
          {[1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              onClick={() => handleResponse(currentQuestion.id, value)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
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

        {/* 価値提示 */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm p-4 rounded-2xl text-center border border-white/20">
          <p className="text-sm text-white/80">
            💡 この後、3つの領域からあなたの心を分析し<br/>
            <strong className="text-yellow-400">個別診断レポート</strong>を無料でお送りします
          </p>
        </div>

        {/* フッター */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-center text-white/60 text-xs">
            © 2025 魂感自在 All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailedAssessment;