// ユニークID生成
export const generateUniqueId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
};

// 診断タイプ判定（5段階）
export const getDiagnosisType = (score: number): string => {
  if (score <= 15) return "微かな違和感を心の羅針盤にする探求者";
  if (score <= 30) return "仮面と素顔の間で真実を探す探求者";
  if (score <= 45) return "偽物感と本物感の狭間を生きる探求者";
  if (score <= 60) return "偽物の鎧を脱ぎ捨てる勇気を育む探求者";
  return "本物の自分との再会を前に立つ探求者";
};

// メッセージ生成（診断タイプ別）
export const generateMessages = (
  totalScore: number,
  bodyScore: number,
  emotionScore: number,
  lifeScore: number,
  userName: string
) => {
  const name = userName || 'あなた';
  
  // スコアに基づいた個別メッセージ生成
  let message1 = '';
  let message2 = '';
  let message3 = '';
  let message4 = '';
  
  if (totalScore <= 15) {
    // 微かな違和感タイプ
    message1 = `${name}さんの診断結果を拝見して、まず驚いたのは、総合スコア${totalScore}点という素晴らしい結果です。これは「偽物感」がほとんどない、とても稀有な状態を示しています。多くの人が自分を見失いがちな現代において、${name}さんは既に本物の自分と深く繋がっている可能性が高いです。`;
    
    message2 = `しかし、「微かな違和感を心の羅針盤にする探求者」というタイプ名が示すように、${name}さんの心の奥底には、まだ言語化できない小さな違和感が存在しているかもしれません。この微細な感覚こそが、更なる成長への重要な手がかりとなります。`;
    
    message3 = `身体スコア${bodyScore}点、感情スコア${emotionScore}点、人生スコア${lifeScore}点という内訳から見えるのは、全体的にバランスの取れた状態です。ただし、最も高いスコアの領域に、まだ探求すべき深い智慧が眠っている可能性があります。`;
    
    message4 = `ジシン覚醒プログラムは、既に高い自己認識を持つ${name}さんが、その微かな違和感を手がかりに、更に深い本質へと到達するための道筋を示します。多くの人が目指す地点から、${name}さんの本当の旅が始まるのです。`;
    
  } else if (totalScore <= 30) {
    // 仮面と素顔タイプ
    message1 = `${name}さんの総合スコア${totalScore}点という結果は、「仮面と素顔の間で真実を探す探求者」として、日常的に感じている違和感が明確に現れています。これは決して悪いことではなく、むしろ自己認識が高まっている証拠です。`;
    
    message2 = `特に注目すべきは、身体${bodyScore}点、感情${emotionScore}点、人生${lifeScore}点という配分です。最も高いスコアの領域で、${name}さんは「本当の自分」と「演じている自分」のギャップを強く感じているはずです。この気づきこそが、変容への第一歩なのです。`;
    
    message3 = `仮面を被ることは、時に必要な自己防衛でもあります。しかし、その仮面が重くなりすぎて、素顔を忘れそうになっていませんか？${name}さんの中には、既に「本物の自分」を取り戻したいという強い願望が芽生えています。`;
    
    message4 = `ジシン覚醒プログラムでは、仮面を急に外すのではなく、安全に、段階的に、本来の${name}さんらしさを取り戻していく方法をお伝えします。仮面の下にある素顔は、想像以上に美しく、力強いものです。`;
    
  } else if (totalScore <= 45) {
    // 偽物感と本物感の狭間タイプ
    message1 = `${name}さんの診断結果、総合スコア${totalScore}点は「偽物感と本物感の狭間を生きる探求者」という、まさに人生の転換点に立っていることを示しています。この状態は、多くの人が経験する「魂の目覚め」の前兆でもあります。`;
    
    message2 = `身体エネルギー${bodyScore}点、感情思考${emotionScore}点、人生存在${lifeScore}点という結果から、${name}さんは日々「これでいいのか？」という問いと向き合いながら生きていることが分かります。特に最も高いスコアの領域で、強い偽物感を感じているでしょう。`;
    
    message3 = `しかし、この「狭間」にいることは、実は大きなチャンスでもあります。完全に偽物感に支配されているわけでもなく、かといって現状に満足しているわけでもない。この微妙なバランスの中で、${name}さんの魂は「本物の自分」への扉を探しているのです。`;
    
    message4 = `ジシン覚醒プログラムは、まさに${name}さんのような「狭間の探求者」のために設計されています。偽物感から完全に解放され、本物の自分として生きる具体的な方法を、5本の動画で段階的にお伝えします。今が、変化の最適なタイミングです。`;
    
  } else if (totalScore <= 60) {
    // 偽物の鎧を脱ぐタイプ
    message1 = `${name}さん、総合スコア${totalScore}点という結果を見て、正直に申し上げます。${name}さんは今、かなり重い「偽物の鎧」を身にまとっている状態です。「偽物の鎧を脱ぎ捨てる勇気を育む探求者」として、大きな変容の可能性を秘めています。`;
    
    message2 = `身体${bodyScore}点、感情${emotionScore}点、人生${lifeScore}点という配分が示すのは、全体的に強い偽物感に覆われた日常です。特に最高スコアの領域では、もはや自分が何者なのか分からなくなるほどの違和感を抱えているのではないでしょうか。`;
    
    message3 = `この鎧は、${name}さんを守るために必要だった時期もあったでしょう。しかし今、その重さに押しつぶされそうになっていませんか？本当の${name}さんは、この鎧の下で必死に呼吸をしようとしています。もう、脱ぎ捨てる時が来ているのです。`;
    
    message4 = `ジシン覚醒プログラムは、その重い鎧を安全に、一枚ずつ脱いでいく方法を提供します。急激な変化ではなく、${name}さんのペースで、確実に本物の自分を取り戻していく。その先には、想像もしなかった自由と喜びが待っています。`;
    
  } else {
    // 本物の自分との再会タイプ
    message1 = `${name}さん、総合スコア${totalScore}点という結果を拝見して、心から${name}さんに伝えたいことがあります。${name}さんは今、人生の中で最も重要な岐路に立っています。「本物の自分との再会を前に立つ探求者」として、魂が強く変容を求めています。`;
    
    message2 = `身体${bodyScore}点、感情${emotionScore}点、人生${lifeScore}点という高いスコアは、もはや限界に近い偽物感の中で生きていることを示しています。毎日が演技の連続で、本当の自分を完全に見失いかけている。この苦しみは、想像を絶するものでしょう。`;
    
    message3 = `しかし、ここまで偽物感が強いということは、逆説的に、${name}さんの魂が「もう限界だ！」と叫んでいる証拠でもあります。この診断を受けたこと自体が、無意識からの強いSOSであり、同時に変化への準備が整った合図でもあるのです。`;
    
    message4 = `ジシン覚醒プログラムは、まさに${name}さんのような状態から、完全な変容を遂げた人々の経験を基に作られています。どん底からの復活、偽物の自分との決別、そして本物の自分との感動的な再会。その全てのプロセスを、5本の動画で丁寧にガイドします。${name}さんの人生は、ここから劇的に変わり始めます。`;
  }
  
  return {
    message1,
    message2,
    message3,
    message4
  };
};

// HTML生成メイン関数
export const generateResultHTML = (
  userName: string,
  responses: any,
  templateHTML: string
): { html: string; url: string; id: string } => {
  
  // スコア計算
  const totalScore = Object.values(responses).reduce((sum: number, val: any) => sum + val, 0);
  const bodyScore = [1,2,3,4,5].reduce((sum, id) => sum + (responses[id] || 0), 0);
  const emotionScore = [6,7,8,9,10].reduce((sum, id) => sum + (responses[id] || 0), 0);
  const lifeScore = [11,12,13,14,15].reduce((sum, id) => sum + (responses[id] || 0), 0);
  
  // パーセンテージ計算
  const totalPercent = Math.round((totalScore / 75) * 100);
  const bodyPercent = Math.round((bodyScore / 25) * 100);
  const emotionPercent = Math.round((emotionScore / 25) * 100);
  const lifePercent = Math.round((lifeScore / 25) * 100);
  
  // 診断タイプとメッセージ
  const diagnosisType = getDiagnosisType(totalScore);
  const messages = generateMessages(totalScore, bodyScore, emotionScore, lifeScore, userName);
  
  // 現在の日付
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  
  // 変数置換マップ
  const replacements: { [key: string]: string } = {
    '{{ユーザー名}}': userName || 'あなた',
    '{{診断日}}': dateStr,
    '{{診断タイプ名}}': diagnosisType,
    '{{総合スコア}}': totalScore.toString(),
    '{{総合スコアパーセント}}': totalPercent.toString(),
    '{{身体スコア}}': bodyScore.toString(),
    '{{身体スコアパーセント}}': bodyPercent.toString(),
    '{{感情スコア}}': emotionScore.toString(),
    '{{感情スコアパーセント}}': emotionPercent.toString(),
    '{{人生スコア}}': lifeScore.toString(),
    '{{人生スコアパーセント}}': lifePercent.toString(),
    '{{診断メッセージ段落1}}': messages.message1,
    '{{診断メッセージ段落2}}': messages.message2,
    '{{診断メッセージ段落3}}': messages.message3,
    '{{診断メッセージ段落4}}': messages.message4,
    '{{CTAタイトル}}': 'ジシン覚醒プログラムで本物の自分へ',
    '{{CTA説明文}}': 'この診断結果は、あなたの変容への第一歩に過ぎません。<br>5本の動画プログラムで、偽物感から解放され、<br>本物の自分として生きる道筋を手に入れましょう。',
    '{{CTAリンク}}': 'https://online.konkanjizai.com/p/jishin-awakening',
    '{{CTAボタンテキスト}}': '無料で動画を視聴する',
    '{{CTA注記}}': '※ 完全無料・いつでも解除可能'
  };
  
  // テンプレート置換
  let html = templateHTML;
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
    html = html.replace(regex, value);
  });
  
  // noindex追加（セキュリティ）
  if (!html.includes('robots')) {
    html = html.replace('</head>', 
      '<meta name="robots" content="noindex, nofollow, noarchive">\n</head>');
  }
  
  // ユニークID生成
  const id = generateUniqueId();
  const url = `https://eloquent-fairy-7272c1.netlify.app/results/${id}`;
  
  return { html, url, id };
};