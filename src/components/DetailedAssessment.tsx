import React, { useState, useEffect } from 'react';

interface DetailedAssessmentProps {
  userName?: string;
  userEmail?: string;
}

const DetailedAssessment: React.FC<DetailedAssessmentProps> = ({ userName = '', userEmail = '' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showPreResult, setShowPreResult] = useState(false);
  const [isSubmittingToUTAGE, setIsSubmittingToUTAGE] = useState(false);

  // 診断結果の型定義
  interface PreResult {
    type: string;
    icon: string;
    color: string;
    currentState: string;
    curiosityGaps: string[];
    deepDiagnosis: string;
    finalCatch: string;
  }

  const [preResult, setPreResult] = useState<PreResult | null>(null);

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
      analyzePreResult();
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

  // 診断完了時の処理（オプトインページへ遷移）
  const handleDiagnosisComplete = async () => {
    console.log('🚀 診断完了処理開始');
    setIsSubmittingToUTAGE(true);

    const diagnosisResults = calculateDiagnosisResults();
    
    const resultPageId = `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const resultPageUrl = `https://online.konkanjizai.com/result/${resultPageId}`;
    
    const params = new URLSearchParams({
      mail: userEmail || '',
      name: userName || '',
      free22: diagnosisResults.totalScore.toString(),
      free23: preResult?.type || '',
      free24: diagnosisResults.averageScore.toFixed(2),
      free25: diagnosisResults.bodyEnergyScore.toString(),
      free26: diagnosisResults.emotionRoleScore.toString(),
      free27: diagnosisResults.lifeMeaningScore.toString(),
      free28: JSON.stringify(diagnosisResults.responses),
      free29: resultPageUrl
    });
    
    console.log('📊 送信データ:', {
      email: userEmail,
      name: userName,
      diagnosticData: diagnosisResults,
      resultPageUrl: resultPageUrl
    });
    
    // UTAGEオプトインページへ遷移
    const UTAGE_OPTIN_URL = "https://online.konkanjizai.com/p/optin15";
    window.location.href = `${UTAGE_OPTIN_URL}?${params.toString()}`;
  };

  // 簡易結果分析ロジック
  const analyzePreResult = () => {
    const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);
    const averageScore = totalScore / 15;

    let result: PreResult;

    if (averageScore <= 1) {
      result = {
        type: "微かな違和感を心の羅針盤にする探求者",
        icon: "🌱",
        color: "#10B981",
        currentState: "あなたは今、心の奥底にある微かな違和感に気づき始めています。外から見ると何の問題もないように見える生活の中で、『何かが違う』という声が聞こえ始めているのではないでしょうか。",
        curiosityGaps: [
          "なぜ成功しているのに満たされないのか？",
          "この違和感の正体は何なのか？",
          "あなたの本当の人生の目的とは？"
        ],
        deepDiagnosis: "実は、この微かな違和感こそが、あなたが本物の人生へと向かう最初のサインなのです。",
        finalCatch: "違和感は、本物への招待状です。"
      };
    } else if (averageScore <= 2) {
      result = {
        type: "仮面と素顔の間で真実を探す探求者",
        icon: "🎭",
        color: "#EC4899",
        currentState: "社会的な役割と本当の自分との間で、あなたは静かな葛藤を抱えています。『○○先生』と呼ばれる自分と、素の自分のギャップに気づいているはずです。",
        curiosityGaps: [
          "いつから仮面をつけ始めたのか？",
          "本当の自分を見失った瞬間は？",
          "仮面を外す勇気を持つには？"
        ],
        deepDiagnosis: "仮面の下にいる本当のあなたは、もう限界を感じています。でも、その声に耳を傾ける準備はできています。",
        finalCatch: "仮面を外す時が来ました。"
      };
    } else if (averageScore <= 3) {
      result = {
        type: "偽物感と本物感の狭間を生きる探求者",
        icon: "⚖️",
        color: "#6366F1",
        currentState: "成功と虚無感、評価と自己否定、あなたは両極端の間で揺れ動いています。外的な成功と内的な充実感のギャップが、日に日に大きくなっているのを感じているでしょう。",
        curiosityGaps: [
          "なぜ成功するほど空虚になるのか？",
          "偽物感の根本原因は何か？",
          "本物の充実感を得る方法とは？"
        ],
        deepDiagnosis: "この狭間にいることは苦しいですが、実は変容への最も重要な時期にいるのです。",
        finalCatch: "今が、人生の転換点です。"
      };
    } else if (averageScore <= 4) {
      result = {
        type: "偽物の鎧を脱ぎ捨てる勇気を育む探求者",
        icon: "🦋",
        color: "#F59E0B",
        currentState: "長年着続けてきた『偽物の鎧』の重さに、もう耐えられなくなっています。心の奥底では『もう限界』という声が響いているはずです。",
        curiosityGaps: [
          "鎧を脱ぐことへの恐れの正体は？",
          "本当の自分で生きる準備は？",
          "変容への第一歩をどう踏み出すか？"
        ],
        deepDiagnosis: "鎧を脱ぐ勇気は、すでにあなたの中に芽生えています。あとは、その勇気を信じるだけです。",
        finalCatch: "脱ぎ捨てる時が、今です。"
      };
    } else {
      result = {
        type: "本物の自分との再会を前に立つ探求者",
        icon: "✨",
        color: "#DC2626",
        currentState: "もう偽物でいることに限界を感じています。心も身体も『本物の自分で生きたい』と叫んでいます。変化への準備は整いました。",
        curiosityGaps: [
          "本物の自分とは何者なのか？",
          "どうすれば本物として生きられるか？",
          "今すぐ始められる変化とは？"
        ],
        deepDiagnosis: "あなたは今、人生で最も重要な扉の前に立っています。その扉の向こうに、本物のあなたが待っています。",
        finalCatch: "扉を開ける、その時です。"
      };
    }

    setPreResult(result);
  };

  // デバッグ用：取得したパラメータの表示
  const showDebugInfo = userEmail || userName;

  // 結果表示画面（5問診断と同じダークテーマUI）
  if (showPreResult && preResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 py-8">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8">
          
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

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
              🎯 あなたの偽物感の正体が見えました
            </h1>
            <p className="text-white/90">深層心理分析の結果をお伝えします</p>
          </div>

          {/* 結果表示 */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <div className="text-6xl mb-4">{preResult.icon}</div>
              <h2 className="text-2xl font-bold mb-4 leading-relaxed text-white">
                {preResult.type}
              </h2>
            </div>
          </div>

          {/* 現状認識セクション */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mb-6 border border-white/20">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">
              💭 今のあなたの状態
            </h3>
            <p className="text-white/90 leading-relaxed">
              {preResult.currentState}
            </p>
          </div>

          {/* 未解明ポイント */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mb-6 border border-white/20">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">
              ❓ まだ解明されていない重要なポイント
            </h3>
            <div className="space-y-2">
              {preResult.curiosityGaps.map((gap, index) => (
                <div key={index} className="flex items-start text-white/90">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>{gap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 希望提示セクション */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-white/20">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">
              ✨ でも、大丈夫です
            </h3>
            <p className="text-white/90 leading-relaxed mb-4">
              {preResult.deepDiagnosis}
            </p>
            <p className="text-2xl font-bold text-center text-yellow-400">
              {preResult.finalCatch}
            </p>
          </div>

          {/* 価値提示 */}
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-yellow-400/50">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              📊 あなただけの個別診断レポートを無料作成
            </h3>
            <p className="text-center text-white/80 mb-4 text-sm">
              通常30,000円相当の個別分析を、今回は特別に無料でご提供します
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-white/90">
                <span className="text-yellow-400 mr-3 text-xl">📊</span>
                <span><strong>3つの領域の詳細分析</strong>による徹底的な自己分析</span>
              </div>
              <div className="flex items-center text-white/90">
                <span className="text-yellow-400 mr-3 text-xl">🧬</span>
                <span>あなたの偽物感の<strong>根本原因の完全解明</strong></span>
              </div>
              <div className="flex items-center text-white/90">
                <span className="text-yellow-400 mr-3 text-xl">🗺️</span>
                <span>本物の自分に戻るための<strong>具体的なステップ</strong></span>
              </div>
              <div className="flex items-center text-white/90">
                <span className="text-yellow-400 mr-3 text-xl">💼</span>
                <span>HIROによる<strong>個別メッセージ</strong></span>
              </div>
              <div className="flex items-center text-white/90">
                <span className="text-yellow-400 mr-3 text-xl">⚡</span>
                <span>今すぐ始められる<strong>実践ワーク</strong></span>
              </div>
            </div>
          </div>

          {/* CTAセクション */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm p-6 rounded-2xl mb-6 relative overflow-hidden border-2 border-yellow-400/70 shadow-2xl">
            <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg animate-bounce">
              <span className="flex items-center">
                ⭐ 完全無料 ⭐
              </span>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                📧 個別診断レポートを今すぐ受け取る
              </h3>
              <p className="text-white/80 text-sm mb-3">
                <strong className="text-yellow-400">HIROが直接作成</strong>するあなただけの詳細分析<br/>
                + <strong className="text-yellow-400">改善プラン</strong>を無料でお届けします
              </p>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl text-sm text-white/90 border border-white/20">
                ⚠️ <strong>注意</strong>：このような詳細分析は通常有料サービスです<br/>
                今だけ<strong className="text-yellow-400">期間限定で完全無料</strong>でお送りしています
              </div>
            </div>
            
            <div className="text-center mb-3">
              <span className="text-yellow-400 text-3xl animate-bounce inline-block">⬇</span>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={handleDiagnosisComplete}
                disabled={isSubmittingToUTAGE}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-5 rounded-xl font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-110 shadow-2xl relative overflow-hidden group animate-pulse-custom disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  animation: isSubmittingToUTAGE ? 'none' : 'pulseScale 2s ease-in-out infinite',
                  boxShadow: '0 0 40px rgba(251, 191, 36, 0.6), 0 10px 25px rgba(0, 0, 0, 0.3)',
                }}>
                <span className="relative z-10 flex items-center justify-center text-lg">
                  {isSubmittingToUTAGE ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      処理中...
                    </>
                  ) : (
                    <>
                      <span className="mr-2 text-2xl animate-bounce">🎯</span>
                      個別診断レポートを今すぐ受け取る（無料）
                      <span className="ml-2 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>→</span>
                    </>
                  )}
                </span>
                {!isSubmittingToUTAGE && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}
              </button>
              <style>{`
                @keyframes pulseScale {
                  0%, 100% {
                    transform: scale(1);
                  }
                  50% {
                    transform: scale(1.05);
                  }
                }
              `}</style>
            </div>
            
            <p className="text-center text-xs text-white/60 mt-3">
              ※ 質の高い分析レポートをお届けします。不要になれば即座に配信停止できます。
            </p>
            
            {/* 緊急性と希少性 */}
            <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-xl border-2 border-orange-400 animate-pulse">
              <p className="text-center text-sm text-white font-bold">
                ⏰ <strong className="text-yellow-400 text-base">このレベルの詳細分析</strong>を無料提供できるのは<br/>
                システムの都合上<strong className="text-orange-300 text-base">今月末まで</strong>の期間限定です
              </p>
            </div>
          </div>

          {/* 社会的証明と安心感 */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm px-4 py-2 rounded-full inline-block mb-4">
              <p className="text-sm text-white font-bold">
                ✨ 既に<span className="text-yellow-400 text-lg">2,847名</span>の方が新しい生き方を見つけています ✨
              </p>
            </div>
            <div className="border-t border-white/20 pt-4">
              <p className="text-xs text-white/50 mb-2">
                「もう一度最初から診断したい」という方は...
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
                🔄 診断をやり直す
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 診断質問画面（5問診断と同じダークテーマUI）
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
      </div>
    </div>
  );
};

export default DetailedAssessment;