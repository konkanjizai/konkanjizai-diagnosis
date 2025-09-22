// @ts-nocheck
import { useState, useEffect } from 'react';
import { Heart, Users, BookOpen, Clock, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { initGoogleAdsTag, trackCustomEvent, trackDiagnosisComplete } from '../utils/googleTag';

const FreeTrialAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [showPreResult, setShowPreResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15分
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  
  // Google広告・GTM初期化（元のバージョンを維持）
  useEffect(() => {
    initGoogleAdsTag();
  }, []);

  // スクロール進捗とリーディングタイム
  useEffect(() => {
    if (!showPreResult) return;
    
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showPreResult]);

  // リーディングタイム計測
  useEffect(() => {
    if (!showPreResult) return;
    
    const timer = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [showPreResult]);

  // 限定タイマー
  useEffect(() => {
    if (!showPreResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [showPreResult]);

  // 体験談のローテーション
  useEffect(() => {
    if (!showPreResult) return;
    
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, [showPreResult]);

  // アニメーション制御
  useEffect(() => {
    if (!showPreResult) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setIsVisible(prev => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll('[data-animate="true"]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [showPreResult]);

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
    
    // 診断完了の詳細トラッキング（コンバージョンではない）
    console.log('🎯 診断完了 - UTAGEへ遷移');
    
    // 1. 診断完了の詳細トラッキング（関心段階の計測）
    trackDiagnosisComplete(preResult?.type || "", totalScore, parseFloat(averageScore));
    
    // 2. UTAGEへの遷移イベント（関心から検討段階への移行）
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  // 【フリー版5問】の分析ロジック（絶対変更禁止）
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

  const testimonials = [
    {
      story: "「偽物感があったから、今の私がある。HIROさんの言う通り、それが特別な証だったんですね。今は楽しみながら仕事ができて、クライアントとの関係も自然体で深くなりました。収入も以前の1.5倍になりました。」",
      author: "Y.Mさん（コンサルタント・福岡）",
      highlight: "偽物感が特別な証",
      result: "収入1.5倍アップ",
      icon: "🌟"
    },
    {
      story: "「実践ワークが本当に効果的でした。頭で理解するだけじゃなく、身体で感じられるから変化が続いています。自分を楽しめるようになって、仕事の成果も自然に上がり、家族との関係も劇的に改善しました。」",
      author: "T.Kさん（セラピスト・名古屋）",
      highlight: "実践ワークで効果が持続",
      result: "家族関係も劇的改善",
      icon: "✨"
    },
    {
      story: "「満たされながら成功するって、こういうことなんですね。以前は成果を出すために自分を犠牲にしていましたが、今は自分らしさを大切にしながら、より良い結果が出ています。セッション単価も2倍になりました。」",
      author: "M.Sさん（カウンセラー・大阪）",
      highlight: "満たされながら成功",
      result: "セッション単価2倍",
      icon: "🚀"
    }
  ];

  // ====== 以下は【完璧版】からそっくりそのまま移植した結果表示部分 ======
  if (showPreResult && preResult) {
    const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);
    const averageScore = totalScore / 5;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative">
        
        {/* 進捗バー（固定） */}
        <div className="fixed top-0 left-0 w-full h-2 bg-white/30 backdrop-blur-sm z-50">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        {/* 限定オファータイマー（固定） */}
        <div className="fixed top-2 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold z-40 shadow-lg animate-pulse">
          <Clock className="w-4 h-4 inline mr-2" />
          限定公開: {formatTime(timeLeft)}
        </div>

        {/* リーディングタイム表示 */}
        <div className="fixed top-2 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-gray-600 z-40">
          📖 {Math.floor(readingTime / 60)}分{readingTime % 60}秒
        </div>
        
        {/* 診断結果表示（感動的演出） */}
        <div className="py-20 px-6 bg-gradient-to-br from-white via-purple-50 to-blue-50 relative overflow-hidden">
          {/* 背景装飾 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            
            {/* 感動的な導入 */}
            <div className="text-center mb-16">
              <div className="inline-block bg-white/60 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/40 shadow-lg">
                <span className="text-purple-700 font-medium text-lg">✨ あなたの心の扉が開かれました ✨</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-light text-gray-800 mb-8 leading-tight">
                ついに見つかりました
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                あなたが探し続けていた<br/>
                <strong className="text-purple-700">本当の答え</strong>がここにあります
              </p>
            </div>

            {/* 診断結果（ドラマティック表示） */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 md:p-16 shadow-2xl mb-12 border border-white/50 relative overflow-hidden">
              {/* 光の演出 */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5"></div>
              
              <div className="text-center relative">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-8 shadow-lg relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
                  <span className="text-6xl">{preResult.icon}</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-8">
                  あなたのタイプが判明しました
                </h2>
                
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 mb-8 shadow-inner border border-purple-100">
                  <h3 className="text-2xl md:text-3xl font-bold text-purple-700 mb-6 leading-relaxed">
                    {preResult.type}
                  </h3>
                  
                  <div className="flex justify-center items-center gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-light text-purple-600 mb-1">{averageScore.toFixed(1)}</div>
                      <div className="text-gray-500 text-sm">診断スコア</div>
                    </div>
                    <div className="text-gray-400">/</div>
                    <div className="text-center">
                      <div className="text-4xl font-light text-gray-400 mb-1">5.0</div>
                      <div className="text-gray-500 text-sm">最大値</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-3 rounded-full transition-all duration-3000 ease-out"
                      style={{ width: `${(averageScore / 5) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="bg-white/80 rounded-2xl p-6 shadow-sm">
                    <p className="text-purple-600 font-medium text-lg mb-2">🎯 これはとても特別なことです</p>
                    <p className="text-gray-700 leading-relaxed">
                      このスコアは、あなたが<strong className="text-purple-700">高い感受性と深い洞察力</strong>を持っていることを示しています。
                      実は、最も成功している人ほど、このような感覚を持っているのです。
                    </p>
                  </div>
                </div>

                {/* 深い共感メッセージ（段階的表示） */}
                <div className="text-left space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-6 border-blue-400 p-8 rounded-r-2xl shadow-lg">
                    <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-3 text-lg">
                      <span className="text-2xl">💙</span> 今、あなたの心で起きていること
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {preResult.currentState}
                      セラピストとして、専門家として、そして一人の人間として...すべての役割で成果を出しているのに、心の奥で<strong className="text-blue-700">「本当の私はどこにいるの？」</strong>という声が聞こえているのではないでしょうか。
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-6 border-emerald-400 p-8 rounded-r-2xl shadow-lg">
                    <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-3 text-lg">
                      <span className="text-2xl">🌱</span> あなたの魂が本当に求めているもの
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {preResult.desire}
                      その気持ち、痛いほどよくわかります。なぜなら、私も同じ道を歩んできたからです。
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-6 border-amber-400 p-8 rounded-r-2xl shadow-lg">
                    <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-3 text-lg">
                      <span className="text-2xl">✨</span> でも、今日がその終わりの始まりです
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      {preResult.hope}
                      あなたと同じような気持ちを抱えていた<strong className="text-amber-700">数千人の方々</strong>が、新しい生き方を見つけています。
                    </p>
                    <div className="bg-white/80 rounded-xl p-4 border border-amber-200">
                      <p className="text-amber-700 font-semibold text-center">
                        🌟 そして私も、15年前までは、あなたと全く同じ苦しみの中にいました 🌟
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* インポスター症候群の権威的説明 */}
        <div 
          id="understanding-section"
          data-animate="true"
          className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-8 shadow-xl">
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-8">
                この感覚には、名前があります
              </h2>
              <p className="text-xl text-gray-600">
                そして、それはあなたが特別な存在である証なのです
              </p>
            </div>

            <div className={`bg-white rounded-3xl p-10 md:p-16 shadow-2xl mb-12 transform transition-all duration-1000 ${
              isVisible['understanding-section'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}>
              
              <div className="text-center mb-12">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-8 border border-blue-100">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    インポスター症候群
                  </h3>
                  <p className="text-xl text-gray-600 italic mb-6">Imposter Syndrome</p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    外面的には成功していても、内面では「自分は偽物かもしれない」「いつか化けの皮が剥がれるのでは」という不安を抱える心理状態
                  </p>
                </div>
                
                {/* 驚きの事実 */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 border border-red-200">
                    <div className="text-4xl font-bold text-red-600 mb-3">70%</div>
                    <p className="text-gray-700 font-medium">成功者がこの感覚を経験</p>
                    <p className="text-sm text-gray-600 mt-2">ハーバード大学研究より</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-3">↗️</div>
                    <p className="text-gray-700 font-medium">能力が高いほど強く感じる</p>
                    <p className="text-sm text-gray-600 mt-2">パラドックス現象</p>
                  </div>
                </div>
              </div>

              {/* 著名人の告白（より感動的に） */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-10">
                <h4 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                  🌟 世界的な成功者たちもあなたと同じ感覚を味わっています 🌟
                </h4>
                
                <div className="space-y-8">
                  {[
                    {
                      name: "マヤ・アンジェロウ",
                      role: "詩人・作家（クリントン大統領就任式で朗読）",
                      quote: "「今度こそ気づかれてしまう。私がみんなを騙していたことを。本当の私がどの程度の人間なのか、見つけてしまうことになるだろう」",
                      achievement: "7つの名誉博士号、50以上の栄誉を受賞"
                    },
                    {
                      name: "エマ・ワトソン",
                      role: "女優・国連親善大使",
                      quote: "「自分がいい仕事をすればするほど、『私はそんなに褒められる資格なんてない』という気持ちが大きくなっていく」",
                      achievement: "ハリーポッター主演、国連でのスピーチ"
                    },
                    {
                      name: "山中伸弥教授",
                      role: "京都大学教授・ノーベル賞受賞者",
                      quote: "自らの研究が「本当に価値があるのか」と常に疑問を持ち続けていた",
                      achievement: "iPS細胞の開発でノーベル生理学・医学賞"
                    }
                  ].map((person, index) => (
                    <div key={index} className="border-l-4 border-purple-400 pl-6 bg-white p-6 rounded-r-2xl shadow-sm">
                      <div className="mb-4">
                        <h5 className="font-bold text-gray-800 text-xl mb-1">{person.name}</h5>
                        <p className="text-purple-600 font-medium mb-1">{person.role}</p>
                        <p className="text-sm text-gray-500 italic">{person.achievement}</p>
                      </div>
                      <blockquote className="text-gray-700 leading-relaxed border-l-2 border-gray-200 pl-4 italic">
                        "{person.quote}"
                      </blockquote>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                  <p className="text-lg font-bold text-purple-700">
                    つまり、この感覚こそ、あなたが「特別である証拠」なのです
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1回目オファー（超自然） */}
        <div className="py-16 px-6 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border-2 border-purple-200 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                🤔 もしかして、こんな疑問が湧いていませんか？
              </h3>
              
              <div className="text-left space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">💭</span>
                  <p className="text-gray-700">「でも、どうやってこの感覚から解放されるの？」</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">💭</span>
                  <p className="text-gray-700">「本当に変われるの？今までも色々試したけど...」</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">💭</span>
                  <p className="text-gray-700">「自分らしく生きるって、具体的にはどういうこと？」</p>
                </div>
              </div>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                実は、その答えを知っている人がいます。<br/>
                同じ道を歩き、そして見つけた人が...
              </p>
              
              <div className="inline-block bg-gradient-to-r from-orange-100 to-pink-100 rounded-full px-8 py-3 border border-orange-200">
                <span className="text-orange-700 font-medium">
                  ✨ その人の話を、少し聞いてみませんか？ ✨
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 最高レベルのHIROストーリー */}
        <div className="py-20 px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
          {/* 背景エフェクト */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full mb-8 shadow-xl">
                <span className="text-4xl">🤲</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-light mb-8 leading-tight">
                同じ絶望を味わった男の<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-bold">奇跡の発見</span>
              </h2>
              <p className="text-xl text-gray-300">
                自己認識と覚醒の専門家<br/>
                <strong className="text-white text-2xl">魂感自在 ＨＩＲＯ</strong>
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 md:p-16 shadow-2xl border border-white/20">
              
              <div className="space-y-8 text-lg leading-relaxed">
                
                {/* 苦悩の時代 */}
                <div className="border-l-4 border-red-400 pl-8 bg-red-900/20 p-6 rounded-r-2xl">
                  <h3 className="text-2xl font-bold text-red-300 mb-4">🌑 絶望の日々</h3>
                  <p className="text-gray-200">
                    私は長年、どれだけ成功をおさめても満足できず、心の奥底で<strong className="text-red-300">「こんな自分ではダメだ」</strong><strong className="text-red-300">「いつか化けの皮が剥がれるのでは」</strong>という深い不安に苦しんでいました。何不自由ない生活を送っているはずなのに、なぜかいつも満たされない。
                  </p>
                  <p className="text-gray-200 mt-4">
                    悩みを相談しても、周りには「十分恵まれているじゃない」と言われ、<strong className="text-red-300 text-xl">誰にも理解されない孤独</strong>に苦しんでいました。
                  </p>
                </div>

                {/* 転換点 */}
                <div className="border-l-4 border-yellow-400 pl-8 bg-yellow-900/20 p-6 rounded-r-2xl">
                  <h3 className="text-2xl font-bold text-yellow-300 mb-4">⚡ 運命の転換点</h3>
                  <p className="text-gray-200">
                    でも今になって分かります。<br/>
                    <strong className="text-yellow-300 text-xl">あの時の「偽物感」こそが、私の特別な証だったのです。</strong>
                  </p>
                  <p className="text-gray-200 mt-4">
                    そんな絶望的な状況の中で、15年前に運命の出会いから「三位一体統合」という新しい視点を発見しました。私たちの中には<strong className="text-yellow-300">魂・精神・肉体という三つの自分</strong>が存在し、そのバラバラな状態がインポスター症候群の正体だったのです。
                  </p>
                </div>

                {/* 最重要発見 */}
                <div className="border-l-4 border-green-400 pl-8 bg-green-900/20 p-6 rounded-r-2xl">
                  <h3 className="text-2xl font-bold text-green-300 mb-4">💚 人生を変えた発見</h3>
                  <p className="text-gray-200">
                    そして何より大切な発見は、<br/>
                    <strong className="text-green-300 text-xl">「自分を楽しめるようになると、人生は面白いほど上手くいく」</strong><br/>
                    ということでした。
                  </p>
                  <p className="text-gray-200 mt-4">
                    演技をやめ、仮面を外し、本来の自分で生きるようになったとき...収入は数倍になり、人間関係は劇的に改善し、何より<strong className="text-green-300">毎朝鏡を見るのが楽しみ</strong>になったのです。
                  </p>
                </div>

                {/* 使命の発見 */}
                <div className="border-l-4 border-purple-400 pl-8 bg-purple-900/20 p-6 rounded-r-2xl">
                  <h3 className="text-2xl font-bold text-purple-300 mb-4">🌟 新たな使命</h3>
                  <p className="text-gray-200">
                    {preResult.type}が感じている、心にポッカリ空いた穴の正体を、私は知っています。この15年間で<strong className="text-purple-300">5,000人以上の方々</strong>をサポートしてきた経験から、<strong className="text-purple-300">実践的なワークを通じて「演じる自分」から「本来の自分」へと戻る道筋</strong>をお伝えできます。
                  </p>
                  
                  <div className="bg-white/10 rounded-xl p-6 mt-6 border border-purple-300/30">
                    <p className="text-purple-200 font-semibold text-center text-lg">
                      頭で理解するだけでなく、身体で感じ、心で納得できる方法だからこそ、<br/>
                      <strong className="text-purple-100">変化が長続きする</strong>のです。
                    </p>
                  </div>
                </div>

                {/* 壮大な使命 */}
                <div className="text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-8 border border-white/20">
                  <p className="text-xl leading-relaxed mb-6">
                    私の夢は、一人ひとりが<br/>
                    <strong className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 text-2xl">満たされながら成功し、自分らしさを楽しんで</strong><br/>
                    生きられる世界を創ることです。
                  </p>
                  
                  <div className="space-y-4 text-lg">
                    <p className="text-purple-200 font-medium">
                      そのためには、まずあなたが「演じる自分」から解放されて、心から安心できる毎日を手に入れることが大切だと思うのです。
                    </p>
                    
                    <p className="text-blue-200 font-medium">
                      あなたが本来の自分で輝けば、きっとその光は周りの人たちにも伝わっていく。そんな小さな変化の輪が、やがて大きな世界の変化につながると信じています。
                    </p>
                    
                    <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-xl p-6 mt-8 border border-orange-300/30">
                      <p className="text-orange-200 font-bold text-xl">
                        だからこそ、これから5日間で、その第一歩を一緒に歩んでみませんか？
                      </p>
                      <p className="text-orange-100 mt-2">
                        急がなくて大丈夫です。あなたのペースで、ゆっくりと。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 橋渡し（感動的） */}
        <div className="py-12 px-6 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-200">
              <h3 className="text-2xl font-bold text-amber-800 mb-4">
                🌈 希望の証明をお見せします
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                実際に、この道を歩まれた方々がどのように変化されたのか、<br/>
                リアルな変容の瞬間をご紹介させてください。<br/>
                きっと、あなたの心にも<strong className="text-amber-700">確かな希望</strong>が生まれるはずです。
              </p>
              <div className="inline-block bg-gradient-to-r from-amber-200 to-orange-200 rounded-full px-6 py-2">
                <span className="text-amber-800 font-semibold">✨ 変容の軌跡をご覧ください ✨</span>
              </div>
            </div>
          </div>
        </div>

        {/* 最強の体験者の声（動的表示） */}
        <div 
          id="testimonials-section"
          data-animate="true"
          className="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Users className="w-16 h-16 mx-auto mb-8 text-blue-500" />
              <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-8">
                奇跡は本当に起きています
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                劇的な変化ではありません。<br/>
                でも、<strong className="text-blue-700">確実に人生が変わり始めています</strong>
              </p>
              
              <div className="flex justify-center items-center gap-4 mt-8">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <span className="text-lg font-semibold text-gray-700">多くの方が変容を実感しています</span>
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
              </div>
            </div>

            {/* メイン体験談（アニメーション付き） */}
            <div className="bg-white rounded-3xl p-10 shadow-2xl mb-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              
              <div className={`transition-all duration-500 ${currentTestimonial === 0 ? 'opacity-100' : 'opacity-0 absolute inset-0 p-10'}`}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonials[0].icon}
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold mb-3">
                        {testimonials[0].highlight}
                      </span>
                      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                        <span className="text-yellow-700 font-bold">🎯 結果: {testimonials[0].result}</span>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 text-lg leading-relaxed mb-4 italic border-l-4 border-yellow-300 pl-4">
                      "{testimonials[0].story}"
                    </blockquote>
                    <div className="text-right text-gray-600 font-medium">
                      {testimonials[0].author}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-500 ${currentTestimonial === 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 p-10'}`}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonials[1].icon}
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <span className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-bold mb-3">
                        {testimonials[1].highlight}
                      </span>
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <span className="text-purple-700 font-bold">🎯 結果: {testimonials[1].result}</span>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 text-lg leading-relaxed mb-4 italic border-l-4 border-purple-300 pl-4">
                      "{testimonials[1].story}"
                    </blockquote>
                    <div className="text-right text-gray-600 font-medium">
                      {testimonials[1].author}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-500 ${currentTestimonial === 2 ? 'opacity-100' : 'opacity-0 absolute inset-0 p-10'}`}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonials[2].icon}
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold mb-3">
                        {testimonials[2].highlight}
                      </span>
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <span className="text-green-700 font-bold">🎯 結果: {testimonials[2].result}</span>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 text-lg leading-relaxed mb-4 italic border-l-4 border-green-300 pl-4">
                      "{testimonials[2].story}"
                    </blockquote>
                    <div className="text-right text-gray-600 font-medium">
                      {testimonials[2].author}
                    </div>
                  </div>
                </div>
              </div>

              {/* インジケーター */}
              <div className="flex justify-center gap-2 mt-8">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentTestimonial === index ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 統計データ */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-purple-100">
                <div className="text-4xl font-bold text-purple-600 mb-2">94%</div>
                <p className="text-gray-700 font-medium">が変化を実感</p>
                <p className="text-sm text-gray-500 mt-2">5日間プログラム参加者</p>
              </div>
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-blue-100">
                <div className="text-4xl font-bold text-blue-600 mb-2">87%</div>
                <p className="text-gray-700 font-medium">が3ヶ月後も継続</p>
                <p className="text-sm text-gray-500 mt-2">長期追跡調査結果</p>
              </div>
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-green-100">
                <div className="text-4xl font-bold text-green-600 mb-2">多数</div>
                <p className="text-gray-700 font-medium">の方が実践中</p>
                <p className="text-sm text-gray-500 mt-2">現在進行形</p>
              </div>
            </div>
          </div>
        </div>

        {/* 究極のプログラム紹介 */}
        <div 
          id="program-section"
          data-animate="true"
          className="py-20 px-6 bg-white relative overflow-hidden"
        >
          {/* 背景装飾 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-5xl mx-auto relative">
            <div className="text-center mb-16">
              <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-8 py-4 mb-8 border border-purple-200">
                <span className="text-purple-700 font-bold text-lg">🎁 特別なご案内</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-light text-gray-800 mb-8 leading-tight">
                ジシン覚醒<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 font-bold">5Days Video プログラム</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                15年間の研究と5,000人の実践から生まれた<br/>
                <strong className="text-purple-700">完全体系化プログラム</strong>
              </p>
              
              <div className="inline-block bg-gradient-to-r from-red-100 to-pink-100 rounded-full px-6 py-3 border-2 border-red-300">
                <span className="text-red-700 font-bold">⚡ 今だけ完全無料で公開中 ⚡</span>
              </div>
            </div>

            {/* 4つの核心価値 */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              
              <div className={`bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border-2 border-orange-200 shadow-lg transform transition-all duration-1000 hover:scale-105 ${
                isVisible['program-section'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}>
                <div className="text-center">
                  <div className="text-5xl mb-4">🌟</div>
                  <h3 className="text-2xl font-bold text-orange-800 mb-4">
                    あなたの「偽物感」が<br/>特別な証である理由
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    HIROの体験談と最新の心理学研究から明かされる、なぜ優秀な人ほど偽物感を感じるのかの真実
                  </p>
                  <div className="bg-white/80 rounded-xl p-4 border border-orange-200">
                    <p className="text-orange-700 font-bold text-sm">✨ Day1で体験できます</p>
                  </div>
                </div>
              </div>

              <div className={`bg-gradient-to-br from-pink-50 to-red-50 rounded-3xl p-8 border-2 border-pink-200 shadow-lg transform transition-all duration-1000 hover:scale-105 ${
                isVisible['program-section'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`} style={{ transitionDelay: '200ms' }}>
                <div className="text-center">
                  <div className="text-5xl mb-4">💖</div>
                  <h3 className="text-2xl font-bold text-pink-800 mb-4">
                    自分を楽しんで<br/>人生を上手くいかせる秘密
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    「頑張る」から「楽しむ」へのパラダイムシフト。楽しさと成功の科学的関係性を解明
                  </p>
                  <div className="bg-white/80 rounded-xl p-4 border border-pink-200">
                    <p className="text-pink-700 font-bold text-sm">✨ Day2で体験できます</p>
                  </div>
                </div>
              </div>

              <div className={`bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 border-2 border-purple-200 shadow-lg transform transition-all duration-1000 hover:scale-105 ${
                isVisible['program-section'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`} style={{ transitionDelay: '400ms' }}>
                <div className="text-center">
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="text-2xl font-bold text-purple-800 mb-4">
                    実践ワークで効果が<br/>持続する本当の仕組み
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    三位一体統合の7分間ワーク。頭ではなく身体で感じる変化が長続きする理由
                  </p>
                  <div className="bg-white/80 rounded-xl p-4 border border-purple-200">
                    <p className="text-purple-700 font-bold text-sm">✨ Day3-4で体験できます</p>
                  </div>
                </div>
              </div>

              <div className={`bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 border-2 border-green-200 shadow-lg transform transition-all duration-1000 hover:scale-105 ${
                isVisible['program-section'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`} style={{ transitionDelay: '600ms' }}>
                <div className="text-center">
                  <div className="text-5xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-green-800 mb-4">
                    満たされながら成功する<br/>新しい生き方
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    犠牲ではなく調和による成功法則。自分らしさを保ちながら結果を出し続ける方法
                  </p>
                  <div className="bg-white/80 rounded-xl p-4 border border-green-200">
                    <p className="text-green-700 font-bold text-sm">✨ Day5で体験できます</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 価値の強調 */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-10 border-2 border-orange-300 shadow-xl">
                <h3 className="text-3xl font-bold text-orange-800 mb-6">
                  🎁 これら全てを完全無料で公開します！
                </h3>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  これら全ての内容を<br/>
                  <strong className="text-orange-700">完全無料</strong>でお届けします
                </p>
                <div className="bg-white/80 rounded-xl p-6 border border-orange-200">
                  <p className="text-red-600 font-bold text-lg">
                    ⚠️ この無料公開は予告なく終了します ⚠️
                  </p>
                  <p className="text-gray-600 mt-2">
                    残り時間: {formatTime(timeLeft)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 最終メッセージ（感動のクライマックス） */}
        <div 
          id="final-message-section"
          data-animate="true"
          className="py-20 px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white relative overflow-hidden"
        >
          {/* 背景エフェクト */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className={`bg-white/10 backdrop-blur-xl rounded-3xl p-12 md:p-16 shadow-2xl border border-white/20 transform transition-all duration-1000 ${
              isVisible['final-message-section'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}>
              
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-light mb-8 leading-tight">
                  最後に、あなたにお伝えしたい<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-bold">たった一つのこと</span>
                </h2>
              </div>
              
              <div className="space-y-8 text-lg md:text-xl leading-relaxed">
                <p className="text-gray-200">
                  私は15年間、数千人の方と一緒にこの道を歩いてきました。
                </p>
                
                <p className="text-gray-200">
                  その中で、確信していることがあります。
                </p>
                
                <div className="text-center bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-8 border border-purple-300/30">
                  <p className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-bold mb-4">
                    変化は、静かに訪れるということ。
                  </p>
                </div>
                
                <p className="text-gray-200">
                  劇的な変化をお約束することはできません。<br/>
                  でも、<strong className="text-white">確実に何かが変わり始めます</strong>。
                </p>
                
                <div className="bg-purple-900/50 rounded-2xl p-8 border border-purple-400/30">
                  <div className="text-center space-y-3 text-lg">
                    <p className="text-purple-200">朝、鏡を見た時の感覚。</p>
                    <p className="text-blue-200">人と話している時の呼吸。</p>
                    <p className="text-green-200">夜、眠りにつく前の心地よさ。</p>
                  </div>
                </div>
                
                <p className="text-gray-200">
                  そんな小さな変化の積み重ねが、<br/>
                  いつの間にか、<strong className="text-white">大きな変容</strong>になっていく。
                </p>
                
                <div className="text-center bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-8 border border-orange-300/30">
                  <p className="text-gray-200">
                    変わりたいという気持ちは、<br/>
                    時間とともに日常に埋もれていきがちです。
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-bold mb-6">
                    だから、もし少しでも興味があるなら<br/>
                    今、このタイミングを大切にしてください。
                  </p>
                  
                  <p className="text-3xl md:text-4xl font-light text-white mt-8">
                    一緒に、歩いてみませんか？
                  </p>
                </div>
              </div>
              
              <div className="text-right mt-12">
                <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 italic font-light">
                  魂感自在 ＨＩＲＯ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 最終オファー（シンプル版） */}
        <div className="py-16 px-6 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
              
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
          <div className="text-gray-500 text-sm space-y-2">
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

  // ====== 診断入力部分（偽物感の正体診断5問アプリ2025/09/16版から移植） ======
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