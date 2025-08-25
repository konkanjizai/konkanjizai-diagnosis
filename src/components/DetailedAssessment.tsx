import { useState, useEffect } from 'react';

const DetailedAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showPreResult, setShowPreResult] = useState(false);
  
  // 追加：URLパラメータから取得するユーザー情報
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  
  // 質問変更時に自動スクロール + URLパラメータ取得
  useEffect(() => {
    // URLパラメータ取得処理を追加
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || '';
    const name = urlParams.get('name') || '';
    
    setUserEmail(email);
    setUserName(name);
    
    console.log('取得したパラメータ:', { email, name }); // デバッグ用
    
    if (showPreResult) {
      // 診断結果表示時は一番上にスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep > 0) {
      // 質問進行中は質問カードにスクロール
      const questionElement = document.getElementById('question-card');
      if (questionElement) {
        questionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [currentStep, showPreResult]);
  
  // 🔧 修正版：オプトインページでデータ更新後、サンクスページにリダイレクト
  const handleEmailRegistration = () => {
    // 診断データを準備
    const totalScore: number = Object.values(responses).reduce((sum: number, val: number) => sum + val, 0);
    const averageScore: string = (totalScore / 15).toFixed(1);
    
    // 3領域別スコア計算
    const bodyEnergyScore = [1,2,3,4,5].reduce((sum, id) => sum + (responses[id] || 0), 0);
    const emotionRoleScore = [6,7,8,9,10].reduce((sum, id) => sum + (responses[id] || 0), 0);
    const lifeMeaningScore = [11,12,13,14,15].reduce((sum, id) => sum + (responses[id] || 0), 0);
    
    // ✅ 修正：オプトインページで既存ユーザー情報を更新
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://online.konkanjizai.com/p/optin';
    form.style.display = 'none';
    
    // フォームフィールドを追加（既存ユーザー情報の更新）
    const fields = {
      email: userEmail,                                 // ユーザー識別用（必須）
      name: userName || '',                             // ユーザー名
      free22: preResult?.type || "",                    // 詳細診断タイプ
      free23: averageScore,                             // 平均スコア
      free24: totalScore.toString(),                    // 総合スコア（75点満点）
      free25: bodyEnergyScore.toString(),               // 身体・エネルギースコア
      free26: emotionRoleScore.toString(),              // 感情・思考・役割スコア
      free27: lifeMeaningScore.toString(),              // 人生・存在・意味スコア
      free28: JSON.stringify(responses),                // 全回答データ
      redirect_url: 'https://online.konkanjizai.com/p/thanks-15'  // 処理完了後のリダイレクト先
    };
    
    // 各フィールドをフォームに追加
    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    
    // デバッグ用：送信データの確認
    console.log('送信データ:', fields);
    
    // フォームをDOMに追加して送信
    document.body.appendChild(form);
    form.submit();
  };

  // 15問の質問データ（3領域×5問）
  const questions = [
    // 【身体・エネルギー領域】5問
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
    
    // 【感情・思考・役割領域】5問
    {
      id: 6,
      category: "感情・思考・役割",
      categoryColor: "#EC4899",
      categoryIcon: "🧠",
      text: "周りから評価されている自分が、本当にその評価に値する人間なのか疑問に思うことがある",
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
    
    // 【人生・存在・意味領域】5問
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
      text: "誰にも理解してもらえない孤独感を、成功すればするほど強く感じる",
      explanation: "成功者特有の孤独感は深い存在不安の表れです"
    },
    {
      id: 13,
      category: "人生・存在・意味",
      categoryColor: "#6366F1",
      categoryIcon: "🧘‍♀️",
      text: "『私は何のために生まれてきたのだろう？』という問いが、心の奥でくすぶり続けている",
      explanation: "存在意義への問いは魂の渇望を表します"
    },
    {
      id: 14,
      category: "人生・存在・意味",
      categoryColor: "#6366F1",
      categoryIcon: "🧘‍♀️",
      text: "物質的には何不自由ないのに、心の中に説明できない空虚感がある",
      explanation: "内なる空虚感は精神的充足の不足を示します"
    },
    {
      id: 15,
      category: "人生・存在・意味",
      categoryColor: "#6366F1",
      categoryIcon: "🧘‍♀️",
      text: "心にポッカリ空いた穴を埋めるために、占いやスピリチュアルを求めてしまう",
      explanation: "外側への探求は内なる答えの渇望を表します"
    }
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleResponseChange = (value: number) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const nextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPreResult(true);
    }
  };

  const prevQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 【簡単結果表示版】の分析ロジック（詳細解説資料誘導）
  const analyzePreResult = () => {
    if (Object.keys(responses).length !== 15) return null;
    const totalScore: number = Object.values(responses).reduce((sum: number, val: number) => sum + val, 0);
    const averageScore: number = totalScore / 15;

    const getSimpleResultType = (score: number) => {
      if (score <= 1) return {
        type: "深い安定感をお持ちの探求者",
        icon: "🌟",
        color: "#10B981",
        currentState: "あなたは心身のバランスが比較的良く保たれており、日常的な大きなストレスは少ない状態です。ただし、時折感じる「もっと深い何かがあるのでは？」という探求心は、実は重要なサインかもしれません。",
        curiosityGaps: [
          "なぜ安定しているのに「もっと」を求めてしまうのか？",
          "この探求心の正体は何なのか？",
          "次のステージへの具体的な道筋とは？"
        ]
      };
      
      if (score <= 2) return {
        type: "微細な違和感を感じ始めた気づきの人",
        icon: "🌸",
        color: "#3B82F6",
        currentState: "日常生活は順調でも、心の奥で「何かが少し違う」という微細な違和感を感じることが増えているのではないでしょうか。この早期の気づきは、実は貴重なサインです。",
        curiosityGaps: [
          "この微妙な違和感の正体は何なのか？",
          "なぜ成功しているのにしっくりこないのか？",
          "この状態を根本から改善する方法とは？"
        ]
      };
      
      if (score <= 3) return {
        type: "本音と建前のギャップに悩む真面目な努力家",
        icon: "💭",
        color: "#F59E0B",
        currentState: "「本当の自分」と「期待される自分」の間で明確なギャップを感じ、時として深い疲れを覚えることがあるのではないでしょうか。この状態は、実は多くの成功者が経験する一般的な現象です。",
        curiosityGaps: [
          "なぜ偽物感を感じてしまうのか？",
          "この状態から確実に抜け出す方法とは？",
          "自然体で愛される具体的なステップとは？"
        ]
      };
      
      if (score <= 4) return {
        type: "深い疲労感と孤独感を抱える頑張り屋さん",
        icon: "🎭",
        color: "#EF4444",
        currentState: "毎日が舞台のように感じられ、「いつまでこの演技を続けなければならないのか」という深い疲労感を抱えていらっしゃるのではないでしょうか。この深刻な状態には、科学的な原因と解決方法があります。",
        curiosityGaps: [
          "なぜこれほど深い疲労感を感じるのか？",
          "この状態から完全に回復する方法とは？",
          "同じ状態から回復した人の具体的事例とは？"
        ]
      };
      
      return {
        type: "存在の意味を問い続ける深い探求者",
        icon: "🌑",
        color: "#991B1B",
        currentState: "「この人生に本当に意味があるのか」という根本的な問いに日々向き合い、存在そのものへの深い疑問を抱えていらっしゃるのではないでしょうか。この状態は、実は魂からの重要なメッセージかもしれません。",
        curiosityGaps: [
          "なぜこれほど深い虚無感を感じるのか？",
          "この苦しみの真の意味とは？",
          "存在の喜びを取り戻す具体的な方法とは？"
        ]
      };
    };

    return getSimpleResultType(averageScore);
  };

  const preResult = Object.keys(responses).length === 15 ? analyzePreResult() : null;

  // デバッグ用：取得したパラメータの表示（開発時のみ）
  const showDebugInfo = userEmail || userName;

  if (showPreResult && preResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            
            {/* デバッグ情報表示（開発時のみ） */}
            {showDebugInfo && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-bold text-blue-800 mb-2">🔧 取得済み情報（開発確認用）</h3>
                <div className="text-xs text-blue-700">
                  <p>メールアドレス: {userEmail || '未取得'}</p>
                  <p>お名前: {userName || '未取得'}</p>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                🎯 あなたの状態が見えてきました
              </h1>
              <p className="text-gray-600">15問診断の簡単結果をお伝えします</p>
            </div>

            {/* 結果表示 */}
            <div className="text-center mb-8">
              <div className="mb-6">
                <div className="text-6xl mb-4">{preResult.icon}</div>
                <h2 className="text-2xl font-bold mb-4 leading-relaxed" style={{ color: preResult.color }}>
                  {preResult.type}
                </h2>
              </div>
            </div>

            {/* 簡易分析結果 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                💭 簡易分析結果
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {preResult.currentState}
              </p>
            </div>

            {/* 未解明ポイント */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                ❓ ただし、まだ解明されていない重要なポイントがあります
              </h3>
              <div className="space-y-2">
                {preResult.curiosityGaps.map((gap, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-orange-500 mr-2 text-lg">•</span>
                    <span className="text-gray-700">{gap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 重要なお知らせ */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                📋 重要なお知らせ
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                この簡易診断では、あなたの状態の「入口」しかお見せできていません。
              </p>
              <p className="text-gray-700 mb-4">
                実は、あなたが感じていらっしゃる状態には<strong>科学的な根拠</strong>があり、そして<strong>確実な改善方法</strong>も存在します。
              </p>
              
              <div className="bg-white p-4 rounded-xl mb-4">
                <h4 className="font-bold text-gray-800 mb-3">📊 詳細解説資料で明らかになること：</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    <span><strong>3領域別の詳細分析</strong>（身体・エネルギー、感情・思考・役割、人生・存在・意味の詳細状態）</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    <span><strong>科学的根拠に基づく原因解明</strong>（ハーバード大学研究データ含む）</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    <span><strong>あなたと同じタイプの改善事例</strong>（具体的な回復プロセス）</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    <span><strong>個別最適化された解決ステップ</strong>（今日から始められる方法）</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    <span><strong>専門家による個別ガイダンス</strong>（次のステップの明確化）</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-xl text-sm text-gray-700">
                <p className="mb-2">
                  <strong>なぜ無料で提供するのか：</strong><br/>
                  現在、この詳細分析手法の有効性を検証する研究を行っており、研究参加者として<strong>完全無料</strong>でご提供しています（通常50,000円相当）。
                </p>
                <p className="text-red-600 font-semibold">
                  ⏰ 研究枠の関係で、詳細解説資料の無料提供は<strong>今月末まで</strong>の期間限定です。
                </p>
              </div>
            </div>

            {/* CTAボタン */}
            <div className="bg-white border-2 border-purple-200 p-6 rounded-2xl mb-6 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                完全無料
              </div>
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  📧 詳細解説資料を今すぐ受け取る
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  <strong>15問診断結果に基づく完全個別対応</strong>の詳細解説資料<br/>
                  + <strong>専門家による個別ガイダンス</strong>を今すぐメール配信
                </p>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handleEmailRegistration}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  📧 詳細解説資料を今すぐ受け取る（完全無料）
                </button>
              </div>
              
              <p className="text-center text-xs text-gray-500 mt-3">
                ※ 15問分析に基づく高品質な詳細解説資料をお届けします。不要になれば即座に配信停止できます。
              </p>
            </div>

            {/* 安心要素 */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
                <div>
                  <div className="text-lg mb-1">⚠️</div>
                  <div>15問診断完了者限定</div>
                </div>
                <div>
                  <div className="text-lg mb-1">📊</div>
                  <div>既に1,247名が改善実現</div>
                </div>
                <div>
                  <div className="text-lg mb-1">🔒</div>
                  <div>配信停止いつでも可能</div>
                </div>
                <div>
                  <div className="text-lg mb-1">🎯</div>
                  <div>押し売り一切なし</div>
                </div>
              </div>
            </div>

            {/* 緊急性演出 */}
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-xl border border-orange-200 mb-6">
              <p className="text-center text-sm text-gray-700">
                <strong>⏰ このレベルの詳細分析を無料で受けられるのは、システムの都合上今月末までとなります。</strong><br/>
                次回の無料提供時期は未定です。
              </p>
            </div>

            {/* やり直しオプション */}
            <div className="text-center">
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-400 mb-2">
                  「もう一度最初から診断したい」という方は...
                </p>
                <button 
                  onClick={() => {
                    setCurrentStep(0);
                    setResponses({});
                    setShowPreResult(false);
                    // 診断開始位置にスクロール
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-gray-400 text-sm hover:text-gray-600 transition-colors underline"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto py-4">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          
          {/* デバッグ情報表示（開発時のみ） */}
          {showDebugInfo && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
              <h3 className="text-sm font-bold text-green-800 mb-2">🔧 URLパラメータ取得確認</h3>
              <div className="text-xs text-green-700">
                <p>メールアドレス: {userEmail || '未取得'}</p>
                <p>お名前: {userName || '未取得'}</p>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              偽物感の正体診断〜詳細版〜<br/>
              〜あなたの心にポッカリ空いた穴の完全解明診断〜
            </h1>
            <p className="text-gray-600">3つの領域から徹底分析・15項目による完全版深層心理診断</p>
          </div>

          {/* プログレスバー */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium" style={{ color: currentQuestion.categoryColor }}>
                {currentQuestion.categoryIcon} {currentQuestion.category} ({currentStep + 1}/15)
              </span>
              <span className="text-sm text-gray-500">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${currentQuestion.categoryColor}, ${currentQuestion.categoryColor}dd)`
                }}
              ></div>
            </div>
          </div>

          {/* 質問カード */}
          <div id="question-card" className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ 
                backgroundColor: currentQuestion.categoryColor + '20',
                color: currentQuestion.categoryColor
              }}>
                {currentQuestion.categoryIcon} {currentQuestion.category}領域
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 leading-relaxed">
                {currentQuestion.text}
              </h2>
              <p className="text-sm text-gray-500 italic">
                {currentQuestion.explanation}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[0, 1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleResponseChange(value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    (responses as Record<number, number>)[currentQuestion.id] === value
                      ? `border-purple-500 bg-purple-500 text-white transform scale-105`
                      : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs mt-1">
                    {value === 0 && '全く当てはまらない'}
                    {value === 1 && 'ほとんど当てはまらない'}
                    {value === 2 && 'あまり当てはまらない'}
                    {value === 3 && 'やや当てはまる'}
                    {value === 4 && 'かなり当てはまる'}
                    {value === 5 && 'とても当てはまる'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ナビゲーションボタン */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={prevQuestion}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-all duration-300"
            >
              ← 前の質問
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                進捗: {currentStep + 1}/15問
              </p>
              <div className="flex space-x-1">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index <= currentStep ? 'bg-purple-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={nextQuestion}
              disabled={(responses as Record<number, number>)[currentQuestion.id] === undefined}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              {currentStep === questions.length - 1 ? '簡単結果を見る 🎯' : '次の質問 →'}
            </button>
          </div>

          {/* 価値提示 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl text-center">
            <p className="text-sm text-gray-600">
              💡 この後、3つの領域からあなたの心を分析し<br/>
              <strong>詳細解説資料</strong>を無料でお送りします
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAssessment;