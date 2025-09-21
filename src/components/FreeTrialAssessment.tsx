// @ts-nocheck
import { useState, useEffect } from 'react';
// ✅ 修正: trackConversion を import から削除
import { initGoogleAdsTag, trackCustomEvent, trackDiagnosisComplete } from '../utils/googleTag';

const FreeTrialAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [showPreResult, setShowPreResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (showPreResult) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, showPreResult]);

  // Google広告・GTM初期化（新しいバージョン）
  useEffect(() => {
    initGoogleAdsTag();
  }, []);

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
    
    // ✅ 修正: 診断完了の詳細トラッキング（コンバージョンではない）
    console.log('🎯 診断完了 - UTAGEへ遷移');
    
    // 1. 診断完了の詳細トラッキング（関心段階の計測）
    trackDiagnosisComplete(preResult?.type || "", totalScore, parseFloat(averageScore));
    
    // 3. UTAGEへの遷移イベント（関心から検討段階への移行）
    trackCustomEvent('utage_transition', {
      diagnosis_type: preResult?.type || "",
      total_score: totalScore,
      average_score: parseFloat(averageScore),
      transition_to: 'optin_page'
    });
    
    setIsSubmitting(true);
    setTimeout(() => {
      // UTAGEに移動
      window.open(`${UTAGE_FORM_URL}?${params.toString()}`, '_blank');
      setIsSubmitting(false);
    }, 500);
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

  // ✅ 新しい診断結果表示画面（HIRO統合ワークデザイン）
  if (showPreResult && preResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        
        {/* 静かで温かい診断結果表示 */}
        <div className="py-16 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            
            {/* 優しい診断完了の確認 */}
            <div className="text-center mb-12">
              <div className="inline-block bg-purple-50 rounded-full px-6 py-3 mb-6 border border-purple-100">
                <span className="text-purple-700 font-medium">あなたの心の声が聞こえました</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-6 leading-relaxed">
                診断結果をお伝えします
              </h1>
              <p className="text-lg text-gray-600">
                5つの質問から見えてきた、あなたの心の状態
              </p>
            </div>

            {/* 診断結果 - 温かい共感重視 */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-lg mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-md">
                  <span className="text-3xl">💖</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-6">
                  あなたのタイプ
                </h2>
                
                <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                  <div className="text-5xl mb-4">{preResult.icon}</div>
                  <h3 className="text-xl md:text-2xl font-medium text-purple-700 mb-4">
                    {preResult.type}
                  </h3>
                </div>

                {/* 深い共感メッセージ */}
                <div className="text-left space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-300 p-6 rounded-r-lg">
                    <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                      <span>💙</span> 今のあなたの気持ち
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {preResult.currentState}
                    </p>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-300 p-6 rounded-r-lg">
                    <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                      <span>🌱</span> あなたが本当に求めているもの
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {preResult.desire}
                    </p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-300 p-6 rounded-r-lg">
                    <h4 className="font-medium text-yellow-800 mb-3 flex items-center gap-2">
                      <span>✨</span> でも、大丈夫です
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {preResult.hope}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* インポスター症候群の優しい説明 */}
        <div className="py-16 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 shadow-md">
                <span className="text-2xl">📖</span>
              </div>
              <h2 className="text-3xl font-light text-gray-800 mb-6">
                あなたの感じていること
              </h2>
              <p className="text-lg text-gray-600">
                実は、名前があります
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-8">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
                  <h3 className="text-2xl font-medium text-gray-800 mb-3">
                    インポスター症候群
                  </h3>
                  <p className="text-gray-600 italic">成功者が感じる心の状態</p>
                </div>
                
                <div className="text-left space-y-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    外面的には成功していても、内面では「自分は偽物かもしれない」「いつか化けの皮が剥がれるのでは」という不安を抱える心理状態です。
                  </p>
                </div>
              </div>

              {/* 特徴の優しい説明 */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800 mb-4">こんな気持ちはありませんか？</h4>
                
                <div className="grid gap-3">
                  {[
                    "「いつか本当の自分がバレてしまう」という恐怖",
                    "成功を「運が良かっただけ」と感じてしまう",
                    "褒められても素直に受け取れない",
                    "自分の能力を過小評価してしまう",
                    "完璧でないと不安になる",
                    "他の人と比較して劣っていると感じる"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-2 h-2 bg-purple-300 rounded-full mt-3"></div>
                      <p className="text-gray-700 text-base">{feature}</p>
                    </div>
                  ))}
                </div>
                
                {/* インポスター症候群の事実 */}
                <div className="mt-8">
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    実はこの現象は特に<strong className="text-purple-700">高い能力を持つ人々</strong>に多く見られます
                  </p>
                  
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="text-lg font-medium text-purple-800 mb-3">驚くべき事実</h4>
                    <div className="space-y-2 text-gray-700 text-base">
                      <p>• 成功者の約<strong className="text-purple-700">70%</strong>がインポスター症候群を経験しています</p>
                      <p>• 能力が高い人ほどこの感覚を強く感じやすい</p>
                      <p>• 成功が増えるほど、偽物感が強まる傾向があります</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 有名人の告白 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="text-lg font-medium text-gray-800 mb-6 text-center">有名人の告白</h4>
              
              <div className="space-y-6">
                {[
                  {
                    name: "マヤ・アンジェロウ",
                    role: "詩人・作家・歌手・女優・公民権運動活動家",
                    work: "1993年ビル・クリントン大統領就任式で自作詩朗読",
                    quote: "「今度こそ気づかれてしまう。私がみんなを騙していたことを。本当の私がどの程度の人間なのか、見つけてしまうことになるだろう」"
                  },
                  {
                    name: "エマ・ワトソン",
                    role: "女優・国連UN Women親善大使・人権活動家",
                    work: "ハリーポッターのハーマイオニー",
                    quote: "「自分がいい仕事をすればするほど、『私はそんなに褒められる資格なんてない』という気持ちが大きくなっていく」"
                  },
                  {
                    name: "山中伸弥教授",
                    role: "京都大学iPS細胞研究所 名誉所長・教授・医学博士",
                    work: "iPS細胞の開発・ノーベル生理学・医学賞受賞",
                    quote: "自らの研究が「本当に価値があるのか」と疑問を持っていたと告白"
                  }
                ].map((person, index) => (
                  <div key={index} className="border-l-4 border-purple-200 pl-4 bg-gray-50 p-4 rounded-r-lg">
                    <div className="mb-2">
                      <h5 className="font-semibold text-gray-800 text-xl">{person.name}</h5>
                      <p className="text-purple-600 text-base font-medium">{person.role}</p>
                      <p className="text-gray-600 text-base italic">{person.work}</p>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed">{person.quote}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 1回目オファー */}
        <div className="py-12 px-6 bg-gray-25">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-lg">
              
              {/* メインタイトル */}
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  ジシン覚醒
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-orange-500 mb-8">
                  5Days Video<br/>
                  プログラム
                </h3>
                
                <div className="space-y-6 text-lg md:text-xl font-bold text-gray-700 leading-relaxed">
                  <p>「偽物感」はあなたが特別な証！</p>
                  <p>自分を楽しめば人生は上手くいく！</p>
                  <p className="text-orange-500">実践ワーク中心だから<br/>効果が持続する！</p>
                  <p>満たされながら成功して<br/>生きていく方法を<br/>完全無料で公開します！</p>
                </div>
              </div>
              
              {/* CTA ボタン */}
              <div className="text-center">
                <button
                  onClick={handleEmailRegistration}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
                    minWidth: '300px'
                  }}
                >
                  {isSubmitting ? (
                    '準備しています...'
                  ) : (
                    <>
                      <span className="mr-2">🌟</span>
                      今すぐ無料で受け取る！
                      <span className="ml-2">→</span>
                    </>
                  )}
                </button>
                
                <p className="mt-6 text-gray-500 text-base">
                  あなたの直感を、信じてあげてください
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* HIROからの心温まる招待 */}
        <div className="py-16 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-lg">
              
              {/* HIROの温かい自己紹介 */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <span className="text-2xl">🤲</span>
                </div>
                <h2 className="text-2xl font-light text-gray-800 mb-6">
                  初めまして。<br/>
                  自己認識と覚醒の専門家、<br/>
                  魂感自在ＨＩＲＯと申します。
                </h2>
              </div>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  実は私も、あなたと全く同じ苦しみを味わってきました。大手企業で「間違うこと自体が許されない」環境にいた頃、毎日「今日こそバレる日かもしれない」という恐怖と共に出勤していました。誰にも相談できない孤独感と、「何かが足りない」という虚無感に苦しんでいました。
                </p>
                
                <p>
                  そんな絶望的な状況の中で、15年前に運命の出会いから「三位一体統合」という新しい視点を発見しました。私たちの中には魂・精神・肉体という三つの自分が存在し、そのバラバラな状態がインポスター症候群の正体だったのです。
                </p>
                
                <p>
                  あなたが感じている「もう演じるのに疲れた」という気持ちの正体を、私は知っています。この15年間で5,000人以上の方々をサポートしてきた経験から、「演じる自分」から「本来の自分」へと戻る道筋をお伝えできます。
                </p>
                
                <p>
                  私の夢は、一人ひとりが本来の自分らしさで生きられる世界を創ることです。
                </p>
                
                <p className="font-medium text-purple-700">
                  そのためには、まずあなたが「演じる自分」から解放されて、心から安心できる毎日を手に入れることが大切だと思うのです。
                </p>
                
                <p className="font-medium text-purple-700">
                  あなたが本来の自分で輝けば、きっとその光は周りの人たちにも伝わっていく。そんな小さな変化の輪が、やがて大きな世界の変化につながると信じています。
                </p>
                
                <p className="font-medium text-purple-700">
                  だからこそ、これから5日間で、その第一歩を一緒に歩んでみませんか？
                </p>
                
                <p className="font-medium text-purple-700">
                  急がなくて大丈夫です。あなたのペースで、ゆっくりと。
                </p>
              </div>
              
              {/* 希望への道筋を示すセクション */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 my-8 border-l-4 border-orange-300">
                <h4 className="text-2xl font-medium text-orange-800 mb-6 text-center">
                  なぜ、これまでの方法では変われなかったのか？
                </h4>
                
                <div className="space-y-6 text-lg text-gray-700">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="space-y-3 text-base">
                      <p>• <strong>頭だけのアプローチ</strong>：理解しても、なぜか変われない</p>
                      <p>• <strong>感情だけの癒し</strong>：一時的で、また元の状態に戻ってしまう</p>
                      <p>• <strong>意志力だけの変化</strong>：無理をして、さらに疲弊してしまう</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 text-center">
                    <p className="text-xl font-medium text-purple-700 mb-4">
                      でも、もし別のアプローチがあるとしたら？
                    </p>
                    <p className="text-gray-700 leading-relaxed text-base">
                      頭で理解するだけでも、感情を癒すだけでもない。<br/>
                      もっと根本的で、もっと自然な方法が...
                    </p>
                  </div>
                  
                  <p className="text-center text-orange-700 font-medium text-xl">
                    それは、演技をやめて、ありのままでいられる人生。<br/>
                    評価を恐れず、自分を信頼できる毎日。
                  </p>
                  
                  <p className="text-center text-gray-600 italic text-base">
                    その方法について、これから5日間で<br/>
                    少しずつお伝えしていきます。
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                実際に、この道を歩まれた方々の変化を、少しご紹介させてください。
              </p>
            </div>
          </div>
        </div>

        {/* 体験者の深い変容談 */}
        <div className="py-16 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-4xl">👥</span>
              <h2 className="text-3xl font-light text-gray-800 mb-6 mt-6">
                同じ道を歩いた方々の声
              </h2>
              <p className="text-lg text-gray-600">
                劇的な変化ではありません。<br/>
                でも、確実に何かが変わり始めています。
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  story: "45歳のカウンセラーです。クライアントの前では自信満々なのに、同業者の前では萎縮していました。5日間のプログラムで「あぁ、だから苦しかったんだ」と腑に落ちました。今は、専門職としてのプライドを保ちながら、自然体でいられるようになりました。",
                  author: "M.Tさん（カウンセラー・東京）"
                },
                {
                  story: "押し付けがましくないのが良かったです。『無理にとは言いません』『あなたのペースで』という言葉に、とても安心できました。自分で選択できる感じが心地よかったです。",
                  author: "K.Sさん（セラピスト・大阪）"
                },
                {
                  story: "三位一体という考え方が、スッと心に入ってきました。難しい理論ではなく、『あぁ、そういうことなんだ』という自然な理解でした。朝、鏡を見た時の感覚が変わりました。",
                  author: "Y.Tさん（心理カウンセラー・名古屋）"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-200">
                  <p className="text-gray-700 italic leading-relaxed mb-4 text-base">
                    "{testimonial.story}"
                  </p>
                  <div className="text-right text-gray-500 text-base">
                    {testimonial.author}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-lg text-purple-700 font-medium">
                多くの方が次々と新しい生き方を歩み始めています
              </p>
            </div>
          </div>
        </div>

        {/* 静かな価値提示 */}
        <div className="py-16 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-800 mb-6">
                これから5日間で<br/>体験していただくこと
              </h2>
              <p className="text-lg text-gray-600">
                急がなくて大丈夫です。<br/>
                あなたのペースで、ゆっくりと。
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  day: 1,
                  title: "「私だけじゃなかった」という安心",
                  desc: "なぜ優秀な人ほど偽物感を感じるのか。その理由を知ることで、深い安心感を得られます。",
                  icon: "🤗"
                },
                {
                  day: 2,
                  title: "なぜ今まで変われなかったのか",
                  desc: "頭で理解することと、心と身体で変わることの違い。新しい視点から、あなたの可能性を見つめます。",
                  icon: "💡"
                },
                {
                  day: 3,
                  title: "あなたの中の三つの自分",
                  desc: "魂、精神、肉体。この三つがバラバラだから苦しかった。統合への第一歩を、優しく踏み出します。",
                  icon: "🧘‍♀️"
                },
                {
                  day: 4,
                  title: "身体が教えてくれること",
                  desc: "7分間の簡単なワーク。頭ではなく、身体で感じる小さな変化。それが大きな一歩になります。",
                  icon: "✨"
                },
                {
                  day: 5,
                  title: "日常に持ち帰る習慣",
                  desc: "特別なことは必要ありません。日常の中で、自然に続けられる小さな習慣をお伝えします。",
                  icon: "🌱"
                }
              ].map((day, index) => (
                <div key={day.day} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">
                      {day.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-purple-600 font-medium text-base">Day {day.day}</span>
                        <h3 className="text-lg font-medium text-gray-800">{day.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-base">{day.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 text-base">
                この体験を、まず感じてみてください
              </p>
            </div>
          </div>
        </div>

        {/* 慈愛深い最終メッセージ */}
        <div className="py-16 px-6 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
              <h2 className="text-2xl font-light text-center text-gray-800 mb-8">
                最後に、お伝えしたいこと
              </h2>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  私は15年間、多くの方と一緒にこの道を歩いてきました。
                </p>
                
                <p>
                  その中で、確信していることがあります。
                </p>
                
                <p className="text-xl text-purple-700 font-medium text-center">
                  変化は、静かに訪れるということ。
                </p>
                
                <p>
                  劇的な変化をお約束することはできません。<br/>
                  でも、確実に何かが変わり始めます。
                </p>
                
                <div className="bg-purple-50 rounded-xl p-6 my-8">
                  <p className="text-center">
                    朝、鏡を見た時の感覚。<br/>
                    人と話している時の呼吸。<br/>
                    夜、眠りにつく前の心地よさ。
                  </p>
                </div>
                
                <p>
                  そんな小さな変化の積み重ねが、<br/>
                  いつの間にか、大きな変容になっていく。
                </p>
                
                <p className="text-center">
                  変わりたいという気持ちは、<br/>
                  時間とともに日常に埋もれていきがちです。
                </p>
                
                <p className="text-xl text-purple-700 font-medium text-center">
                  だから、もし少しでも興味があるなら<br/>
                  今、このタイミングを大切にしてください。
                </p>
                
                <p className="text-2xl font-light text-center text-gray-800 mt-8">
                  一緒に、歩いてみませんか？
                </p>
              </div>
              
              <div className="text-right text-purple-500 italic text-lg mt-8">
                ＨＩＲＯ
              </div>
            </div>
          </div>
        </div>

        {/* 最終オファー */}
        <div className="py-16 px-6 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-lg">
              
              {/* メインタイトル */}
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  ジシン覚醒
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-orange-500 mb-8">
                  5Days Video<br/>
                  プログラム
                </h3>
                
                <div className="space-y-6 text-lg md:text-xl font-bold text-gray-700 leading-relaxed">
                  <p>「偽物感」はあなたが特別な証！</p>
                  <p>自分を楽しめば人生は上手くいく！</p>
                  <p className="text-orange-500">実践ワーク中心だから<br/>効果が持続する！</p>
                  <p>満たされながら成功して<br/>生きていく方法を<br/>完全無料で公開します！</p>
                </div>
              </div>
              
              {/* CTA ボタン */}
              <div className="text-center">
                <button
                  onClick={handleEmailRegistration}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
                    minWidth: '300px'
                  }}
                >
                  {isSubmitting ? (
                    '準備しています...'
                  ) : (
                    <>
                      <span className="mr-2">🌟</span>
                      今すぐ無料で受け取る！
                      <span className="ml-2">→</span>
                    </>
                  )}
                </button>
                
                <p className="mt-6 text-gray-500 text-base">
                  あなたの直感を、信じてあげてください
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* フッター */}
        <div className="py-8 px-6 bg-gray-50 text-center">
          <div className="text-gray-500 text-base space-y-2">
            <p>
              <a 
                href="https://konkanjizai.com/privacy-policy/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-700 transition-colors underline"
              >
                プライバシーポリシー
              </a>
            </p>
            <p>
              Copyright(c) 2025 魂感自在 All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 診断質問画面（既存のまま）
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