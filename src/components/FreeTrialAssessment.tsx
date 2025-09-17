import { useState, useEffect } from 'react';

const FreeTrialAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [showPreResult, setShowPreResult] = useState(false);
  
  useEffect(() => {
    if (showPreResult) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, showPreResult]);

  // Google広告トラッキング機能
  useEffect(() => {
    // Google Ads タグ初期化
    const initGoogleAdsTag = () => {
      const adsId = '924434837';
      if (!adsId) return;

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

    initGoogleAdsTag();
  }, []);

  const trackConversion = () => {
    const adsId = '924434837';
    const conversionLabel = 'DOZuCOf2nrEaEJWD57gD';
    
    if (window.gtag && adsId && conversionLabel) {
      window.gtag('event', 'conversion', {
        'send_to': `AW-${adsId}/${conversionLabel}`
      });
      console.log('🎯 Google広告コンバージョン送信:', `AW-${adsId}/${conversionLabel}`);
    }
  };

  const handleEmailRegistration = () => {
    const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);
    const averageScore = (totalScore / 5).toFixed(1);
    
    const UTAGE_FORM_URL = "https://online.konkanjizai.com/p/shindan";
    
    const params = new URLSearchParams({
      free18: preResult?.type || "",
      free19: averageScore,
      free20: totalScore.toString(),
      free21: JSON.stringify(responses)
    });
    
    // Google広告コンバージョン送信
    trackConversion();
    
    window.open(`${UTAGE_FORM_URL}?${params.toString()}`, '_blank');
  };

  // 【元の5問】戦略的質問（絶対変更禁止）
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

  const handleResponse = (questionId, value) => {
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
    const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);
    const averageScore = totalScore / 5;

    const getPreResultType = (score) => {
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

  // 結果表示画面（元の構成に完全復元）
  if (showPreResult && preResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 py-8">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-5 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-3">
              🎯 あなたの偽物感の正体が見えました
            </h1>
            <p className="text-white/90 text-base">深層心理分析の結果をお伝えします</p>
          </div>

          {/* 結果表示 */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mb-6">
              <div className="text-5xl sm:text-6xl mb-4">{preResult.icon}</div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 leading-relaxed text-white px-2">
                {preResult.type}
              </h2>
            </div>
          </div>

          {/* 現状認識セクション */}
          <div className="bg-white/10 backdrop-blur-sm p-5 sm:p-6 rounded-2xl mb-5 sm:mb-6 border border-white/20">
            <h3 className="text-lg sm:text-lg font-bold text-yellow-400 mb-3">
              💭 今のあなたの状態
            </h3>
            <p className="text-white/90 leading-relaxed text-base sm:text-base">
              {preResult.currentState}
            </p>
          </div>

          {/* 欲求・願望セクション */}
          <div className="bg-white/10 backdrop-blur-sm p-5 sm:p-6 rounded-2xl mb-5 sm:mb-6 border border-white/20">
            <h3 className="text-lg sm:text-lg font-bold text-yellow-400 mb-3">
              💫 あなたが本当に求めているもの
            </h3>
            <p className="text-white/90 leading-relaxed text-base sm:text-base">
              {preResult.desire}
            </p>
          </div>

          {/* 希望提示セクション */}
          <div className="bg-white/10 backdrop-blur-sm p-5 sm:p-6 rounded-2xl mb-6 sm:mb-8 border border-white/20">
            <h3 className="text-lg sm:text-lg font-bold text-yellow-400 mb-3">
              ✨ でも、大丈夫です
            </h3>
            <p className="text-white/90 leading-relaxed mb-4 text-base sm:text-base">
              {preResult.hope}
            </p>
            <p className="text-white/70 text-sm italic">
              あなたと同じような気持ちを抱えていた多くの方が、新しい生き方を見つけています。
            </p>
          </div>

          {/* メールアドレス取得フォーム - シンプル版 */}
          <div className="bg-white/95 backdrop-blur-sm p-5 sm:p-8 rounded-3xl mb-6 relative shadow-2xl">
            
            {/* メインタイトル */}
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 leading-tight">
                ジシン覚醒<br/>
                <span className="text-yellow-500 text-2xl sm:text-4xl">5Days Video<br className="sm:hidden"/> プログラム</span>
              </h3>
              
              <div className="text-gray-700 text-lg sm:text-xl font-bold leading-relaxed mb-4">
                「偽物感」はあなたが特別な証！<br/>
                自分を楽しめば人生は上手くいく！
              </div>
              
              <div className="text-lg sm:text-xl font-bold text-yellow-500 my-4">
                実践ワーク中心だから<br className="sm:hidden"/>効果が持続する！
              </div>
              
              <div className="text-gray-700 text-base sm:text-lg font-bold mb-4">
                満たされながら成功して<br className="sm:hidden"/>生きていく方法を<br/>
                完全無料で公開します！
              </div>
            </div>
            
            {/* ボタン */}
            <div className="space-y-4">
              <button 
                onClick={handleEmailRegistration}
                className="w-full bg-yellow-400 text-gray-900 px-5 sm:px-8 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl font-black hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-xl border-4 border-gray-900"
                style={{
                  boxShadow: '4px 4px 0px rgba(0, 0, 0, 1)',
                }}>
                <span className="flex items-center justify-center">
                  今すぐ無料で受け取る！→
                </span>
              </button>
            </div>
          </div>

          {/* フッター */}
          <div className="text-center text-white/60 text-xs">
            <a 
              href="https://konkanjizai.com/privacy-policy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white/80 transition-colors underline"
            >
              プライバシーポリシー
            </a>
            <p className="mt-2">
              Copyright(c) 2025 魂感自在 All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 診断質問画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 w-full">
        
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-1 sm:mb-2">
            偽物感の正体診断
          </h1>
          <p className="text-white/80 text-sm sm:text-base">3分でわかる深層心理分析</p>
        </div>

        <div className="mb-4 sm:mb-8">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <span className="text-white/80 text-xs sm:text-sm">
              質問 {currentStep + 1} / {questions.length}
            </span>
            <span className="text-white/80 text-xs sm:text-sm">
              {Math.round(progress)}% 完了
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 sm:h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center mb-4 sm:mb-8">
          <div 
            className="inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-4"
            style={{ backgroundColor: currentQuestion.categoryColor }}
          >
            {currentQuestion.category}
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4 leading-relaxed px-2">
            {currentQuestion.text}
          </h2>
          <p className="text-xs sm:text-sm text-white/70 italic px-2">
            {currentQuestion.explanation}
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-8">
          {[1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              onClick={() => handleResponse(currentQuestion.id, value)}
              className={`w-full p-2.5 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all duration-200 text-sm sm:text-base ${
                responses[currentQuestion.id] === value
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3 sm:mr-4 text-base sm:text-xl">
                  {responses[currentQuestion.id] === value ? '●' : '○'}
                </span>
                <span className="text-xs sm:text-base">
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

        <div className="flex justify-between gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-white/10 text-white rounded-lg sm:rounded-xl disabled:opacity-50 hover:bg-white/20 transition-all duration-200 text-sm sm:text-base"
          >
            ← 前へ
          </button>
          <button
            onClick={handleNext}
            disabled={!responses[currentQuestion.id]}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-lg sm:rounded-xl disabled:opacity-50 hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 text-sm sm:text-base"
          >
            {currentStep === questions.length - 1 ? '結果を見る' : '次へ →'}
          </button>
        </div>

        <div className="mt-4 sm:mt-8 bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl text-center border border-white/20 hidden sm:block">
          <p className="text-xs sm:text-sm text-white/80">
            💡 この後、あなたの心の状態をより詳しく分析し<br/>
            <strong className="text-yellow-400">具体的な解決方法</strong>を無料でお送りします
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeTrialAssessment;