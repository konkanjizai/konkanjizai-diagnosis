import { useState, useEffect } from 'react';

const FreeTrialAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showPreResult, setShowPreResult] = useState(false);
  
  // 質問変更時に自動スクロール
  useEffect(() => {
    if (showPreResult) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, showPreResult]);

  // 🔧 修正版：UTAGEカスタムフィールドに直接対応
  const handleEmailRegistration = () => {
    // 診断データを準備
    const totalScore = Object.values(responses).reduce((sum: number, val: number) => sum + val, 0);
    const averageScore = (totalScore / 5).toFixed(1);
    
    // UTAGEフォームURL
    const UTAGE_FORM_URL = "https://online.konkanjizai.com/p/optin";
    
    // ✅ 修正：パラメータ名をUTAGEカスタムフィールド名に直接対応
    const params = new URLSearchParams({
      free18: preResult?.type || "",                    // diagnosis_type → free18
      free19: averageScore,                            // diagnosis_score → free19  
      free20: totalScore.toString(),                   // diagnosis_total → free20
      free21: JSON.stringify(responses)                // responses → free21
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

  // 【フリー版5問】の分析ロジック（感情共感＋解決希望型）
  const analyzePreResult = () => {
    if (Object.keys(responses).length !== 5) return null;
    const totalScore = Object.values(responses).reduce((sum: number, val: number) => sum + val, 0);
    const averageScore = totalScore / 5;

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

  // 結果表示画面
  if (showPreResult && preResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 py-8">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8">
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

          {/* 欲求・願望セクション */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mb-6 border border-white/20">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">
              💫 あなたが本当に求めているもの
            </h3>
            <p className="text-white/90 leading-relaxed">
              {preResult.desire}
            </p>
          </div>

          {/* 希望提示セクション */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-white/20">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">
              ✨ でも、大丈夫です
            </h3>
            <p className="text-white/90 leading-relaxed mb-4">
              {preResult.hope}
            </p>
            <p className="text-white/70 text-sm italic">
              あなたと同じような気持ちを抱えていた多くの方が、新しい生き方を見つけています。
            </p>
          </div>

          {/* さらなる価値の提示 */}
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-yellow-400/50">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              🔍 でも、5問だけでは見えない部分があります
            </h3>
            <p className="text-center text-white/80 mb-4 text-sm">
              実は、あなたの本当の状態を知るには<strong className="text-yellow-400">さらに詳細な分析</strong>が必要です
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-white/90">
                <span className="text-yellow-400 mr-3 text-xl">📊</span>
                <span><strong>完全版15項目診断</strong>による徹底的な自己分析</span>
              </div>
              <div className="flex items-center text-white/90">
                <span className="text-yellow-400 mr-3 text-xl">🧬</span>
                <span>なぜそう感じるのか？<strong>科学的根拠に基づく詳細レポート</strong></span>
              </div>
              <div className="flex items-center text-white/90">
                <span className="text-yellow-400 mr-3 text-xl">🗺️</span>
                <span>{preResult.valueProposition}</span>
              </div>
              <div className="flex items-center text-white/90">
                <span className="text-yellow-400 mr-3 text-xl">💼</span>
                <span>同じタイプの人が実際に変われた<strong>具体的事例集</strong></span>
              </div>
              <div className="flex items-center text-white/90">
                <span className="text-yellow-400 mr-3 text-xl">⚡</span>
                <span>今すぐ始められる<strong>3つの実践ステップ</strong></span>
              </div>
            </div>
          </div>

          {/* メールアドレス取得フォーム */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm p-6 rounded-2xl mb-6 relative overflow-hidden border-2 border-yellow-400/70 shadow-2xl">
            <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg animate-bounce">
              <span className="flex items-center">
                ⭐ 完全無料 ⭐
              </span>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                📧 完全版診断と詳細分析レポートを受け取る
              </h3>
              <p className="text-white/80 text-sm mb-3">
                <strong className="text-yellow-400">15項目の詳細診断</strong>で、あなたの状態を徹底分析<br/>
                + <strong className="text-yellow-400">個別対応の改善プラン</strong>を今すぐメール配信
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
                onClick={handleEmailRegistration}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-5 rounded-xl font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-110 shadow-2xl relative overflow-hidden group animate-pulse-custom"
                style={{
                  animation: 'pulseScale 2s ease-in-out infinite',
                  boxShadow: '0 0 40px rgba(251, 191, 36, 0.6), 0 10px 25px rgba(0, 0, 0, 0.3)',
                }}>
                <span className="relative z-10 flex items-center justify-center text-lg">
                  <span className="mr-2 text-2xl animate-bounce">🔍</span>
                  完全版15項目診断を今すぐ受け取る（無料）
                  <span className="ml-2 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
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
            
            {/* 緊急性と希少性の追加 */}
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

  // 診断質問画面（新しいUIデザイン）
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8">
        
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
            偽物感の正体診断
          </h1>
          <p className="text-white/80">3分でわかる深層心理分析</p>
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
            💡 この後、あなたの心の状態をより詳しく分析し<br/>
            <strong className="text-yellow-400">具体的な解決方法</strong>を無料でお送りします
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeTrialAssessment;