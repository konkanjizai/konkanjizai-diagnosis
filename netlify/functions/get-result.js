const { Redis } = require('@upstash/redis');

// Upstash Redis クライアントの初期化
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

exports.handler = async (event, context) => {
  // GETリクエストのみ処理
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // URLパラメータからIDを取得
  const id = event.queryStringParameters?.id;
  
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'ID is required' }),
    };
  }

  try {
    // Redisから診断結果を取得
    const resultData = await redis.get(`result:${id}`);
    
    if (!resultData) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
        body: `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>診断結果が見つかりません</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
    }
    p {
      color: #666;
      line-height: 1.6;
    }
    a {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 30px;
      transition: transform 0.3s;
    }
    a:hover {
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>診断結果が見つかりません</h1>
    <p>申し訳ございません。指定された診断結果が見つかりませんでした。</p>
    <p>診断結果は30日間保存されます。期限が過ぎている可能性があります。</p>
    <a href="https://eloquent-fairy-7272c1.netlify.app/?type=detailed">もう一度診断する</a>
  </div>
</body>
</html>
        `,
      };
    }

    // 診断結果ページを生成
    const html = generateResultPage(resultData);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
      body: html,
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// 診断結果ページを生成する関数
function generateResultPage(data) {
  const { userName, totalScore, diagnosisType, bodyScore, emotionScore, meaningScore, responses, timestamp } = data;
  
  // パーセンテージ計算
  const totalPercent = Math.round((totalScore / 75) * 100);
  const bodyPercent = Math.round((bodyScore / 25) * 100);
  const emotionPercent = Math.round((emotionScore / 25) * 100);
  const meaningPercent = Math.round((meaningScore / 25) * 100);
  
  // 診断日のフォーマット
  const diagnosisDate = new Date(timestamp).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title>${userName || 'あなた'}様の診断結果 - 魂感自在道</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 2rem;
      margin-bottom: 10px;
    }
    
    .header .date {
      opacity: 0.9;
      font-size: 0.9rem;
    }
    
    .content {
      padding: 40px;
    }
    
    .diagnosis-type {
      text-align: center;
      margin-bottom: 40px;
      padding: 30px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 15px;
    }
    
    .diagnosis-type h2 {
      color: #764ba2;
      font-size: 1.8rem;
      margin-bottom: 15px;
    }
    
    .total-score {
      font-size: 3rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 10px;
    }
    
    .total-score span {
      font-size: 1.5rem;
      color: #999;
    }
    
    .score-bar {
      width: 100%;
      height: 30px;
      background: #e0e0e0;
      border-radius: 15px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    
    .score-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 1s ease;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 10px;
      color: white;
      font-weight: bold;
    }
    
    .area-scores {
      margin: 40px 0;
    }
    
    .area-scores h3 {
      margin-bottom: 20px;
      color: #333;
    }
    
    .score-item {
      margin-bottom: 20px;
    }
    
    .score-item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .score-item-title {
      font-weight: 600;
      color: #555;
    }
    
    .score-item-value {
      color: #667eea;
      font-weight: bold;
    }
    
    .message-section {
      margin: 40px 0;
      padding: 30px;
      background: #f8f9fa;
      border-radius: 15px;
      border-left: 4px solid #764ba2;
    }
    
    .message-section h3 {
      color: #764ba2;
      margin-bottom: 15px;
    }
    
    .message-section p {
      line-height: 1.8;
      color: #444;
      margin-bottom: 15px;
    }
    
    .cta-section {
      margin-top: 40px;
      padding: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      text-align: center;
      color: white;
    }
    
    .cta-section h3 {
      font-size: 1.5rem;
      margin-bottom: 15px;
    }
    
    .cta-section p {
      margin-bottom: 20px;
      opacity: 0.95;
    }
    
    .cta-button {
      display: inline-block;
      padding: 15px 40px;
      background: white;
      color: #764ba2;
      text-decoration: none;
      border-radius: 30px;
      font-weight: bold;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .footer {
      text-align: center;
      padding: 20px;
      color: #999;
      font-size: 0.9rem;
    }
    
    @media (max-width: 640px) {
      .header h1 {
        font-size: 1.5rem;
      }
      
      .diagnosis-type h2 {
        font-size: 1.3rem;
      }
      
      .total-score {
        font-size: 2.5rem;
      }
      
      .content {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${userName || 'あなた'}様の診断結果</h1>
      <div class="date">診断日: ${diagnosisDate}</div>
    </div>
    
    <div class="content">
      <div class="diagnosis-type">
        <h2>${diagnosisType}</h2>
        <div class="total-score">${totalScore}<span>/75点</span></div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${totalPercent}%">
            ${totalPercent}%
          </div>
        </div>
      </div>
      
      <div class="area-scores">
        <h3>3つの領域別スコア</h3>
        
        <div class="score-item">
          <div class="score-item-header">
            <span class="score-item-title">🏃 身体・エネルギー領域</span>
            <span class="score-item-value">${bodyScore}/25点</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${bodyPercent}%">
              ${bodyPercent}%
            </div>
          </div>
        </div>
        
        <div class="score-item">
          <div class="score-item-header">
            <span class="score-item-title">💭 感情・思考・役割領域</span>
            <span class="score-item-value">${emotionScore}/25点</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${emotionPercent}%">
              ${emotionPercent}%
            </div>
          </div>
        </div>
        
        <div class="score-item">
          <div class="score-item-header">
            <span class="score-item-title">🧘 人生・存在・意味領域</span>
            <span class="score-item-value">${meaningScore}/25点</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${meaningPercent}%">
              ${meaningPercent}%
            </div>
          </div>
        </div>
      </div>
      
      <div class="message-section">
        <h3>HIROからの個別メッセージ</h3>
        <p>
          ${userName || 'あなた'}様、診断を受けていただきありがとうございます。
        </p>
        <p>
          あなたの診断結果「${diagnosisType}」は、多くの成功者が経験する深い心の状態を表しています。
          外面的には十分な成果を収めながらも、内面では「本当の自分」を求める渇望を抱えていらっしゃるのではないでしょうか。
        </p>
        <p>
          特に${getStrongestArea(bodyScore, emotionScore, meaningScore)}の領域に強い反応が見られます。
          これは、あなたが既に変化への準備ができていることを示しています。
        </p>
        <p>
          この診断結果は、あなたが新しい人生の扉を開く第一歩です。
          魂感自在道では、この状態から本物の自分へと変容するための具体的な道筋をご用意しています。
        </p>
      </div>
      
      <div class="cta-section">
        <h3>次のステップへ</h3>
        <p>
          5日間の無料動画プログラムで、<br>
          あなたの変容への道筋をお伝えします
        </p>
        <a href="https://online.konkanjizai.com/p/jishin-awakening" class="cta-button">
          無料動画を視聴する
        </a>
        <p style="font-size: 0.9rem; margin-top: 15px; opacity: 0.9;">
          ※ 完全無料・いつでも解除可能
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p>© 2025 魂感自在道 - Konkan Jizai Do</p>
      <p>この診断結果は30日間保存されます</p>
    </div>
  </div>
  
  <script>
    // スコアバーのアニメーション
    window.addEventListener('load', () => {
      const scoreFills = document.querySelectorAll('.score-fill');
      scoreFills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.width = width;
        }, 100);
      });
    });
  </script>
</body>
</html>
  `;
}

// 最も高いスコアの領域を判定
function getStrongestArea(bodyScore, emotionScore, meaningScore) {
  const max = Math.max(bodyScore, emotionScore, meaningScore);
  if (max === bodyScore) return '身体・エネルギー';
  if (max === emotionScore) return '感情・思考・役割';
  return '人生・存在・意味';
}