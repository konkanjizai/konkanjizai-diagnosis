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

  // 診断タイプを取得する関数
  const getDiagnosisType = (totalScore: number): string => {
    if (totalScore <= 15) return "微かな違和感を心の羅針盤にする探求者";
    if (totalScore <= 30) return "仮面と素顔の間で真実を探す探求者";
    if (totalScore <= 45) return "偽物感と本物感の狭間を生きる探求者";
    if (totalScore <= 60) return "偽物の鎧を脱ぎ捨てる勇気を育む探求者";
    return "本物の自分との再会を前に立つ探求者";
  };

  // 診断完了時の処理（オプトインページへ遷移）
  const handleDiagnosisComplete = async () => {
    console.log('🚀 診断完了処理開始');
    setIsSubmittingToUTAGE(true);

    const diagnosisResults = calculateDiagnosisResults();
    const diagnosisType = getDiagnosisType(diagnosisResults.totalScore);
    
    // 🆕 診断結果ページを保存してURLを取得
    const resultPageUrl = await saveResultAndGetUrl(
      userName || '',
      Object.values(responses),
      diagnosisResults.totalScore,
      diagnosisType
    );
    
    console.log('📊 送信データ:', {
      email: userEmail,
      name: userName,
      diagnosticData: diagnosisResults,
      resultPageUrl: resultPageUrl
    });
    
    // フォームを作成してPOST送信（UTAGEが正しく受け取れるように）
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://online.konkanjizai.com/p/optin15';
    form.style.display = 'none';

    const fields = {
      mail: userEmail || '',
      name: userName || '',
      free22: diagnosisResults.totalScore.toString(),
      free23: diagnosisType,
      free24: diagnosisResults.averageScore.toFixed(2),
      free25: diagnosisResults.bodyEnergyScore.toString(),
      free26: diagnosisResults.emotionRoleScore.toString(),
      free27: diagnosisResults.lifeMeaningScore.toString(),
      free28: JSON.stringify(diagnosisResults.responses),
      free29: resultPageUrl || '' // 🆕 診断結果ページURL
    };

    // フィールドを追加
    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    // フォームをDOMに追加して送信
    document.body.appendChild(form);
    form.submit();
  };

  // 簡易結果分析
  const analyzePreResult = () => {
    const results = calculateDiagnosisResults();
    const averageScore = results.averageScore;

    let resultData: PreResult;

    if (averageScore <= 1.5) {
      resultData = {
        type: "深い安定感をお持ちの探求者",
        icon: "🌟",
        color: "#10B981",
        currentState: "あなたは心身のバランスが比較的良く保たれており、日常的な大きなストレスは少ない状態です。ただし、時折感じる「もっと深い何かがあるのでは？」という探求心は、実は重要なサインかもしれません。",
        curiosityGaps: [
          "なぜ安定しているのに「もっと」を求めてしまうのか？",
          "この探求心の正体は何なのか？",
          "次のステージへの具体的な道筋とは？"
        ],
        deepDiagnosis: "実は、あなたの『深い安定感』の裏には、まだ探求されていない可能性が眠っているのです。",
        finalCatch: "次のステージへ進む準備ができています"
      };
    } else if (averageScore <= 2.5) {
      resultData = {
        type: "微細な違和感を感じ始めた気づきの人",
        icon: "🌸",
        color: "#3B82F6",
        currentState: "日常生活は順調でも、心の奥で「何かが少し違う」という微細な違和感を感じることが増えているのではないでしょうか。この早期の気づきは、実は貴重なサインです。",
        curiosityGaps: [
          "この微妙な違和感の正体は何なのか？",
          "なぜ成功しているのにしっくりこないのか？",
          "この状態を根本から改善する方法とは？"
        ],
        deepDiagnosis: "この『微細な違和感』こそ、あなたが本物の自分へと向かう最初の扉なのです。",
        finalCatch: "変化の兆しが現れています"
      };
    } else if (averageScore <= 3.5) {
      resultData = {
        type: "本音と建前のギャップに悩む真面目な努力家",
        icon: "💭",
        color: "#F59E0B",
        currentState: "「本当の自分」と「期待される自分」の間で明確なギャップを感じ、時として深い疲れを覚えることがあるのではないでしょうか。この状態は、実は多くの成功者が経験する一般的な現象です。",
        curiosityGaps: [
          "なぜ偽物感を感じてしまうのか？",
          "この状態から確実に抜け出す方法とは？",
          "自然体で愛される具体的なステップとは？"
        ],
        deepDiagnosis: "仮面を外す勇気を持つことで、真の自分との出会いが待っています。",
        finalCatch: "転換点に立っています"
      };
    } else if (averageScore <= 4.5) {
      resultData = {
        type: "深い疲労感と孤独感を抱える頑張り屋さん",
        icon: "🎭",
        color: "#EF4444",
        currentState: "毎日が舞台のように感じられ、「いつまでこの演技を続けなければならないのか」という深い疲労感を抱えていらっしゃるのではないでしょうか。この深刻な状態には、科学的な原因と解決方法があります。",
        curiosityGaps: [
          "なぜこれほど深い疲労感を感じるのか？",
          "この状態から完全に回復する方法とは？",
          "同じ状態から回復した人の具体的事例とは？"
        ],
        deepDiagnosis: "もう一人で頑張る必要はありません。サポートを受けることで、必ず道は開けます。",
        finalCatch: "解放への道が見えています"
      };
    } else {
      resultData = {
        type: "存在の意味を問い続ける深い探求者",
        icon: "🌑",
        color: "#991B1B",
        currentState: "「この人生に本当に意味があるのか」という根本的な問いに日々向き合い、存在そのものへの深い疑問を抱えていらっしゃるのではないでしょうか。この状態は、実は魂からの重要なメッセージかもしれません。",
        curiosityGaps: [
          "なぜこれほど深い虚無感を感じるのか？",
          "この苦しみの真の意味とは？",
          "存在の喜びを取り戻す具体的な方法とは？"
        ],
        deepDiagnosis: "この深い問いかけこそ、魂の目覚めへの呼び声なのです。",
        finalCatch: "新しい人生の扉が開きかけています"
      };
    }

    setPreResult(resultData);
  };

  // デバッグ用：取得したパラメータの表示（開発時のみ）
  const showDebugInfo = userEmail || userName;

  // 簡易結果画面（5問診断と同じダークテーマUI）
  if (showPreResult && preResult) {
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

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
                🎯 あなたの状態が見えてきました
              </h1>
              <p className="text-white/80">15問診断の簡易結果をお伝えします</p>
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

            {/* 簡易分析結果 */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mb-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">
                💭 簡易分析結果
              </h3>
              <p className="text-white/90 leading-relaxed">
                {preResult.currentState}
              </p>
            </div>

            {/* 未解明ポイント */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-yellow-400/30">
              <h3 className="text-lg font-bold text-white mb-3">
                ❓ ただし、まだ解明されていない重要なポイントがあります
              </h3>
              <div className="space-y-2">
                {preResult.curiosityGaps.map((gap, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span className="text-white/90">{gap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 詳細解説への誘導 */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-2xl text-white mb-8">
              <h2 className="text-2xl font-bold mb-4">
                📊 詳細な個別分析レポート（全15ページ）
              </h2>
              <p className="mb-6 text-lg">
                実は、あなたの回答には、<strong className="text-yellow-300">あなた自身も気づいていない重要なサイン</strong>が隠れています。
              </p>
              
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl mb-6">
                <h3 className="font-bold mb-3">📑 お送りする内容：</h3>
                <ul className="space-y-2 text-sm">
                  <li>✅ 3つの領域別の詳細分析（各5ページ）</li>
                  <li>✅ あなたの「偽物感」の真の原因と仕組み</li>
                  <li>✅ 今すぐできる具体的な改善方法</li>
                  <li>✅ 同じ悩みから解放された方の事例</li>
                  <li>✅ 30日間で変化を起こすロードマップ</li>
                </ul>
              </div>
              
              <p className="text-sm opacity-90">
                通常30,000円相当の個別分析を<strong className="text-yellow-300">今だけ完全無料</strong>でお届けします
              </p>
            </div>

            {/* メール登録フォーム */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-center mb-6 text-white">
                📧 詳細解説を無料で受け取る
              </h3>
              
              <button
                onClick={handleDiagnosisComplete}
                disabled={isSubmittingToUTAGE}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingToUTAGE ? '処理中...' : '無料で詳細解説を受け取る →'}
              </button>
              
              <p className="text-xs text-white/60 text-center mt-3">
                ※ 迷惑メールは一切送りません。いつでも配信停止可能です。
              </p>
            </div>

            {/* 安心要素 */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-6 border border-white/20">
              <h4 className="font-bold text-white mb-3">🔒 安心してご登録ください</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/80">
                <div>
                  <div className="text-lg mb-1">🔐</div>
                  <div>SSL暗号化通信</div>
                </div>
                <div>
                  <div className="text-lg mb-1">📧</div>
                  <div>配信停止いつでも可能</div>
                </div>
                <div>
                  <div className="text-lg mb-1">🎯</div>
                  <div>押し売り一切なし</div>
                </div>
              </div>
            </div>

            {/* 緊急性演出 */}
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm p-4 rounded-xl border border-orange-400/30 mb-6">
              <p className="text-center text-sm text-white">
                <strong>⏰ このレベルの詳細分析を無料で受けられるのは、システムの都合上今月末までとなります。</strong><br/>
                次回の無料提供時期は未定です。
              </p>
            </div>

            {/* やり直しオプション */}
            <div className="text-center">
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