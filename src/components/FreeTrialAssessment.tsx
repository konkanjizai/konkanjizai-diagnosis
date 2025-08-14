import { useState, useEffect } from 'react';

const FreeTrialAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showPreResult, setShowPreResult] = useState(false);
  
  // 質問変更時に自動スクロール
  useEffect(() => {
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
  
  // メール登録処理関数
  const handleEmailRegistration = () => {
    // 診断データを準備
    const totalScore: number = Object.values(responses).reduce((sum: number, val: number) => sum + val, 0);
    const averageScore: string = (totalScore / 5).toFixed(1);
    
    // UTAGEフォームURL
    const UTAGE_FORM_URL = "https://online.konkanjizai.com/p/optin";
    
    // UTAGEカスタムフィールドに対応したパラメータ準備
    const params = new URLSearchParams({
      free18: preResult?.type || "",           // diagnosis_type → free18
      free19: averageScore,                    // diagnosis_score → free19
      free20: totalScore.toString(),           // diagnosis_total → free20
      free21: JSON.stringify(responses)        // responses → free21
    });
    
    // UTAGEフォームにリダイレクト
    window.open(`${UTAGE_FORM_URL}?${params.toString()}`, '_blank');
  };

  // 戦略的5問（【完全版】質問内容）
  const questions = [
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
      category: "感情・思考・役割",
      categoryColor: "#EC4899", 
      categoryIcon: "🧠",
      text: "周りから評価されている自分が、本当にその評価に値する人間なのか疑問に思うことがある",
      explanation: "自分への根本的な疑問が偽物感の核心を表します"
    },
    {
      id: 3,
      category: "人生・存在・意味",
      categoryColor: "#6366F1",
      categoryIcon: "🧘‍♀️", 
      text: "これだけ恵まれているのに『人生これでいいの？』と思ってしまう自分に罪悪感を感じる",
      explanation: "成功への虚無感は心の奥からのサインです"
    },
    {
      id: 4,
      category: "感情・思考・役割",
      categoryColor: "#EC4899",
      categoryIcon: "🧠",
      text: "誰にも理解してもらえない孤独感を、成功すればするほど強く感じる",
      explanation: "成功者特有の孤独感は深い偽物感の表れです"
    },
    {
      id: 5,
      category: "人生・存在・意味",
      categoryColor: "#6366F1",
      categoryIcon: "🧘‍♀️", 
      text: "心にポッカリ空いた穴を埋めるために、占いやスピリチュアルを求めてしまう",
      explanation: "外側に答えを求める行動は内なる空虚感の現れです"
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

  // 【フリー版5問】の分析ロジック（感情共感＋解決希望型）
  const analyzePreResult = () => {
    if (Object.keys(responses).length !== 5) return null;
    const totalScore: number = Object.values(responses).reduce((sum: number, val: number) => sum + val, 0);
    const averageScore: number = totalScore / 5;

    const getPreResultType = (score: number) => {
      if (score <= 1) return {
        type: "「そのままで十分」と言われたいあなた",
        icon: "🌟",
        color: "#10B981",
        currentState: "あなたは既に素晴らしいバランス感覚をお持ちです。でも時々「本当にこのままでいいのかな？」と不安になることはありませんか？",
        desire: "「あなたはもう十分頑張っている」「そのままのあなたが一番素敵」そんな安心できる言葉を求めているのではないでしょうか。",
        hope: "実はあなたのような方にこそ、もっと自分を信頼し、内なる声に耳を傾ける方法があります。",
        valueProposition: "さらに自分らしさを磨き、揺るぎない自信を育てる具体的なステップ"
      };
      
      if (score <= 2.5) return {
        type: "「もう頑張らなくていい」と言われたいあなた",
        icon: "🕊️",
        color: "#3B82F6",
        currentState: "いつも一生懸命で、周りからも評価されているけれど、心の奥で「いつまで頑張り続けなければいけないんだろう」と感じていませんか？",
        desire: "「もう十分頑張った」「少し休んでもいい」そんな温かい言葉に、心の底から安心したいと思っているのではないでしょうか。",
        hope: "頑張ることをやめても愛され続ける、そんな新しい生き方が実際にあります。",
        valueProposition: "頑張らなくても自然に愛され、評価される「力を抜く」技術"
      };
      
      if (score <= 3.5) return {
        type: "「本当のあなたが一番素敵」と認められたいあなた",
        icon: "💖",
        color: "#F59E0B",
        currentState: "表面的には順調に見えるけれど、「本当の私を知られたらどう思われるだろう」という不安を抱えていませんか？",
        desire: "ありのままの自分を見せても「それがあなたらしくて素敵」と受け入れてもらえる、そんな関係性を心から求めているのではないでしょうか。",
        hope: "実は、本当の自分を表現するほど人から愛される秘訣があります。",
        valueProposition: "ありのままの自分で深く愛され、信頼される関係性の築き方"
      };
      
      if (score <= 4.5) return {
        type: "「ありのままでいいよ」と言われたいあなた",
        icon: "🌸",
        color: "#EF4444",
        currentState: "いつも「こうあるべき」「もっとしっかりしなきゃ」と自分にプレッシャーをかけて、疲れを感じていませんか？",
        desire: "「完璧じゃなくても大丈夫」「ありのままのあなたでいい」そんな無条件の受容を、心から感じたいと思っているのではないでしょうか。",
        hope: "完璧でなくても、むしろ人間らしい弱さがあるほど愛される方法があります。",
        valueProposition: "完璧主義を手放し、不完璧な自分も愛せるようになる具体的な方法"
      };
      
      return {
        type: "「もう演じなくていいよ」と言われたいあなた",
        icon: "🎭",
        color: "#991B1B",
        currentState: "毎日がまるで舞台のように感じて、いつも「期待される自分」を演じ続けることに、深い疲労を感じていませんか？",
        desire: "「仮面を外してもいい」「演技をやめても愛される」そんな安全な場所を、心の底から求めているのではないでしょうか。",
        hope: "実は、演技をやめて自然体になるほど、本当に大切な人たちとの関係が深まる方法があります。",
        valueProposition: "演技を手放し、自然体で過ごしながらも深く愛され続ける秘訣"
      };
    };

    return getPreResultType(averageScore);
  };

  const preResult = Object.keys(responses).length === 5 ? analyzePreResult() : null;

  if (showPreResult && preResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                🎯 あなたの偽物感の正体が見えました
              </h1>
              <p className="text-gray-600">深層心理分析の結果をお伝えします</p>
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

            {/* 現状認識セクション */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                💭 今のあなたの状態
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {preResult.currentState}
              </p>
            </div>

            {/* 欲求・願望セクション */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-2xl mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                💫 あなたが本当に求めているもの
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {preResult.desire}
              </p>
            </div>

            {/* 希望提示セクション */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                ✨ でも、大丈夫です
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {preResult.hope}
              </p>
              <p className="text-gray-600 text-sm italic">
                あなたと同じような気持ちを抱えていた多くの方が、新しい生き方を見つけています。
              </p>
            </div>

            {/* さらなる価値の提示 */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                🔍 でも、5問だけでは見えない部分があります
              </h3>
              <p className="text-center text-gray-600 mb-4 text-sm">
                実は、あなたの本当の状態を知るには<strong>さらに詳細な分析</strong>が必要です
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-purple-500 mr-3 text-xl">📊</span>
                  <span><strong>完全版15項目診断</strong>による徹底的な自己分析</span>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-3 text-xl">🧬</span>
                  <span>なぜそう感じるのか？<strong>科学的根拠に基づく詳細レポート</strong></span>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-3 text-xl">🗺️</span>
                  <span>{preResult.valueProposition}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-3 text-xl">💼</span>
                  <span>同じタイプの人が実際に変われた<strong>具体的事例集</strong></span>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-3 text-xl">⚡</span>
                  <span>今すぐ始められる<strong>3つの実践ステップ</strong></span>
                </div>
              </div>
            </div>

            {/* メールアドレス取得フォーム */}
            <div className="bg-white border-2 border-purple-200 p-6 rounded-2xl mb-6 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                完全無料
              </div>
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  📧 完全版診断と詳細分析レポートを受け取る
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  <strong>15項目の詳細診断</strong>で、あなたの状態を徹底分析<br/>
                  + <strong>個別対応の改善プラン</strong>を今すぐメール配信
                </p>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-xl text-sm text-gray-700">
                  ⚠️ <strong>注意</strong>：このような詳細分析は通常有料サービスです<br/>
                  今だけ<strong>期間限定で完全無料</strong>でお送りしています
                </div>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handleEmailRegistration}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  🔍 完全版15項目診断を今すぐ受け取る（無料）
                </button>
              </div>
              
              <p className="text-center text-xs text-gray-500 mt-3">
                ※ 質の高い分析レポートをお届けします。不要になれば即座に配信停止できます。
              </p>
              
              {/* 緊急性と希少性の追加 */}
              <div className="mt-4 p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl border border-orange-200">
                <p className="text-center text-sm text-gray-700">
                  ⏰ <strong>このレベルの詳細分析</strong>を無料提供できるのは<br/>
                  システムの都合上<strong>今月末まで</strong>の期間限定です
                </p>
              </div>
            </div>

            {/* 社会的証明と安心感 */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                ✨ 既に2,847名の方が新しい生き方を見つけています ✨
              </p>
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              偽物感の正体診断<br/>
              〜あなたの心にポッカリ空いた穴を科学的に解明〜
            </h1>
            <p className="text-gray-600">なぜ成功しているのに満たされないのか？3分でわかる深層心理分析</p>
          </div>

          {/* プログレスバー */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium" style={{ color: currentQuestion.categoryColor }}>
                {currentQuestion.categoryIcon} {currentQuestion.category} ({currentStep + 1}/5)
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
                進捗: {currentStep + 1}/5問
              </p>
              <div className="flex space-x-1">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
              {currentStep === questions.length - 1 ? '結果を見る 🎯' : '次の質問 →'}
            </button>
          </div>

          {/* 価値提示 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl text-center">
            <p className="text-sm text-gray-600">
              💡 この後、あなたの心の状態をより詳しく分析し<br/>
              <strong>具体的な解決方法</strong>を無料でお送りします
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTrialAssessment;