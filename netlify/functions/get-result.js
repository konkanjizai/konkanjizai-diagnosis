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
        body: JSON.stringify({ error: 'Result not found' }),
      };
    }

    // HTMLテンプレートを生成
    const html = getResultTemplate(resultData);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
      body: html,
    };
  } catch (error) {
    console.error('Error fetching result:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// 診断タイプを判定する関数
function getDiagnosisType(totalScore) {
  if (totalScore <= 15) return '初期段階';
  if (totalScore <= 30) return '軽度';
  if (totalScore <= 45) return '中度';
  if (totalScore <= 60) return '重度';
  return '極度';
}

// レベルの説明を取得する関数
function getScoreDescription(totalScore) {
  if (totalScore <= 15) {
    return '微かな違和感を感じ始めている段階です。早期の気づきは大きなチャンスです。';
  }
  if (totalScore <= 30) {
    return '仮面と本来の自分のギャップを認識し始めています。変容への準備が整いつつあります。';
  }
  if (totalScore <= 45) {
    return '偽物感と本物感の狭間で揺れ動いています。今こそ真実の自分と向き合う時です。';
  }
  if (totalScore <= 60) {
    return '深い偽物感に囚われています。しかし、その苦しみこそが変容への強い原動力となります。';
  }
  return '極度の偽物感に支配されています。最も深い闇の中にこそ、最も明るい光への道があります。';
}

// 身体分析のメッセージを取得
function getBodyAnalysis(bodyScore) {
  const percent = (bodyScore / 25) * 100;
  if (percent <= 30) {
    return '身体からのサインはまだ微かです。日常的な疲労感や違和感として現れていることがあります。身体の声に耳を傾けることで、より深い気づきを得られるでしょう。';
  }
  if (percent <= 60) {
    return '身体が「何かが違う」というメッセージを送っています。慢性的な緊張や疲労感は、本来の自分からのズレを教えてくれています。身体との対話を始める時期です。';
  }
  return '身体が強いSOSサインを発しています。この強い反応は、真の変容を求める魂の叫びです。身体の知恵を信頼し、本来の自分へと還る旅を始めましょう。';
}

// 感情分析のメッセージを取得
function getEmotionAnalysis(emotionScore) {
  const percent = (emotionScore / 25) * 100;
  if (percent <= 30) {
    return '感情面では比較的安定していますが、時折感じる違和感や空虚感があります。これらの微細な感情は、より深い自己理解への入り口となります。';
  }
  if (percent <= 60) {
    return '役割と本来の自分の間で感情が揺れ動いています。「期待に応えなければ」というプレッシャーと「本当の自分でいたい」という願望の間で葛藤しています。';
  }
  return '感情的に大きな負荷がかかっています。仮面をかぶり続けることの限界を感じています。この苦しみは、真の自己表現への強い欲求の表れです。';
}

// 人生分析のメッセージを取得
function getLifeAnalysis(lifeScore) {
  const percent = (lifeScore / 25) * 100;
  if (percent <= 30) {
    return '人生の意味や方向性について、漠然とした疑問を抱き始めています。「このままでいいのか」という問いが、新しい可能性への扉を開きます。';
  }
  if (percent <= 60) {
    return '成功や達成の裏側で、深い空虚感を抱えています。外的な成功と内的な充実感のギャップが広がっています。真の充実への道を模索する時です。';
  }
  return '人生の根本的な意味を問い直す段階にいます。今まで築いてきたものへの疑問は、より本質的な生き方への招待状です。魂の声に従う勇気を持ちましょう。';
}

// インポスター症候群の説明
function getImpostorDescription(totalScore) {
  if (totalScore >= 30) {
    return `
      <div class="revelation-section">
        <h2 style="text-align: center; color: #333; margin-bottom: 30px; font-size: 28px;">
          🔍 偽物感の正体
        </h2>
        
        <div class="syndrome-box">
          <div class="syndrome-name">インポスター症候群</div>
          <div class="syndrome-subtitle">Impostor Syndrome</div>
        </div>
        
        <p style="margin: 30px 0; line-height: 1.8;">
          あなたが感じている「偽物感」には、実は名前があります。
          <span class="highlight">インポスター症候群</span>と呼ばれる心理状態です。
        </p>
        
        <p style="margin: 30px 0; line-height: 1.8;">
          これは、外面的には成功していても、内面では「自分は偽物だ」「いつか化けの皮が剥がれる」
          という不安を抱える状態を指します。実は、多くの成功者がこの状態を経験しています。
        </p>
        
        <div class="explanation-list">
          <h3 style="margin-bottom: 20px;">インポスター症候群の特徴</h3>
          <ul>
            <li>成果を出しても「運が良かっただけ」と思ってしまう</li>
            <li>褒められても素直に受け取れない</li>
            <li>「本当の自分」を知られることを恐れる</li>
            <li>完璧主義で自分に厳しい</li>
            <li>他人と比較して劣等感を感じる</li>
          </ul>
        </div>
        
        <p style="margin: 30px 0; line-height: 1.8; font-weight: bold; text-align: center;">
          しかし、この状態は決してあなたの弱さではありません。<br>
          むしろ、真の自分へと変容する準備が整った証なのです。
        </p>
      </div>
    `;
  }
  return '';
}

// 診断結果HTMLテンプレート
function getResultTemplate(data) {
  const {
    userName = 'あなた',
    totalScore = 0,
    bodyScore = 0,
    emotionScore = 0,
    lifeScore = 0
  } = data;

  // パーセンテージ計算
  const bodyPercent = Math.round((bodyScore / 25) * 100);
  const emotionPercent = Math.round((emotionScore / 25) * 100);
  const lifePercent = Math.round((lifeScore / 25) * 100);

  // 診断タイプとメッセージを取得
  const diagnosisLevel = getDiagnosisType(totalScore);
  const scoreDescription = getScoreDescription(totalScore);
  const bodyAnalysis = getBodyAnalysis(bodyScore);
  const emotionAnalysis = getEmotionAnalysis(emotionScore);
  const lifeAnalysis = getLifeAnalysis(lifeScore);
  const impostorSection = getImpostorDescription(totalScore);

  // 現在の日付を取得
  const now = new Date();
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow, noarchive">
    <title>あなたの偽物感診断結果 - 魂感自在道</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
            line-height: 1.8;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 40px;
            text-align: center;
            position: relative;
        }

        .header::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700);
        }

        .diagnosis-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .user-name {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .diagnosis-date {
            font-size: 14px;
            opacity: 0.9;
        }

        .content {
            padding: 40px;
        }

        /* 診断タイプカード */
        .diagnosis-type-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 15px;
            padding: 40px;
            margin-bottom: 40px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .type-label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }

        .type-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            line-height: 1.5;
        }

        .overall-score {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .score-description {
            font-size: 16px;
            opacity: 0.95;
        }

        /* 詳細分析セクション */
        .analysis-section {
            background: #f9fafb;
            border-radius: 15px;
            padding: 35px;
            margin-bottom: 25px;
            border-left: 5px solid #667eea;
        }

        .analysis-title {
            color: #333;
            font-size: 22px;
            margin-bottom: 20px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .analysis-score {
            color: #667eea;
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 15px;
        }

        .score-bar {
            height: 10px;
            background: #e5e7eb;
            border-radius: 5px;
            overflow: hidden;
            margin-bottom: 20px;
        }

        .score-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 5px;
            transition: width 1.5s ease-out;
        }

        .analysis-content {
            line-height: 1.8;
            color: #4b5563;
        }

        .highlight {
            background: linear-gradient(transparent 60%, #FFD700 60%);
            padding: 2px 0;
            font-weight: bold;
        }

        /* バランス分析 */
        .balance-section {
            background: white;
            border-radius: 15px;
            padding: 35px;
            margin-bottom: 40px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.05);
            text-align: center;
        }

        .chart-container {
            display: flex;
            justify-content: center;
            margin: 30px 0;
        }

        /* 正体セクション */
        .revelation-section {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 40px;
            margin-bottom: 40px;
            position: relative;
            overflow: hidden;
        }

        .revelation-section::before {
            content: '💡';
            position: absolute;
            top: 30px;
            right: 30px;
            font-size: 40px;
            opacity: 0.3;
        }

        .syndrome-box {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            text-align: center;
        }

        .syndrome-name {
            color: #764ba2;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .syndrome-subtitle {
            color: #888;
            font-size: 18px;
            font-style: italic;
        }

        /* 説明リスト */
        .explanation-list {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 40px;
        }

        .explanation-list ul {
            list-style: none;
            padding: 0;
        }

        .explanation-list li {
            padding: 15px 0;
            border-bottom: 1px solid #e5e7eb;
            padding-left: 30px;
            position: relative;
        }

        .explanation-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
        }

        .explanation-list li:last-child {
            border-bottom: none;
        }

        .footer {
            text-align: center;
            padding: 30px;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
        }

        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .content {
                padding: 20px;
            }
            
            .user-name {
                font-size: 28px;
            }

            .overall-score {
                font-size: 36px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="diagnosis-badge">偽物感診断 分析レポート</div>
            <h1 class="user-name">${userName}様</h1>
            <p class="diagnosis-date">診断日: ${dateStr}</p>
        </div>

        <div class="content">
            <!-- 診断結果（偽物感の強さ・段階） -->
            <div class="diagnosis-type-card">
                <div class="type-label">YOUR DIAGNOSIS RESULT</div>
                <h2 class="type-name">偽物感 ${diagnosisLevel}</h2>
                <div class="overall-score">${totalScore}/75点</div>
                <p class="score-description">
                    ${scoreDescription}
                </p>
            </div>

            <!-- 詳細分析結果 -->
            <h2 style="text-align: center; color: #333; margin-bottom: 30px; font-size: 28px;">
                📊 詳細分析結果
            </h2>

            <!-- 1. 身体・エネルギー領域 -->
            <div class="analysis-section">
                <h3 class="analysis-title">
                    <span>💪</span>
                    <span>身体・エネルギー領域</span>
                </h3>
                <div class="analysis-score">スコア: ${bodyScore}/25点</div>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${bodyPercent}%;"></div>
                </div>
                <div class="analysis-content">
                    ${bodyAnalysis}
                </div>
            </div>

            <!-- 2. 感情・思考・役割領域 -->
            <div class="analysis-section">
                <h3 class="analysis-title">
                    <span>🧠</span>
                    <span>感情・思考・役割領域</span>
                </h3>
                <div class="analysis-score">スコア: ${emotionScore}/25点</div>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${emotionPercent}%;"></div>
                </div>
                <div class="analysis-content">
                    ${emotionAnalysis}
                </div>
            </div>

            <!-- 3. 人生・存在・意味領域 -->
            <div class="analysis-section">
                <h3 class="analysis-title">
                    <span>✨</span>
                    <span>人生・存在・意味領域</span>
                </h3>
                <div class="analysis-score">スコア: ${lifeScore}/25点</div>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${lifePercent}%;"></div>
                </div>
                <div class="analysis-content">
                    ${lifeAnalysis}
                </div>
            </div>

            <!-- 三位一体バランス分析 -->
            <div class="balance-section">
                <h2 style="color: #333; margin-bottom: 20px; font-size: 28px;">
                    ⚖️ 三位一体バランス分析
                </h2>
                <div class="chart-container">
                    <canvas id="balanceChart" width="300" height="300"></canvas>
                </div>
                <p style="color: #4b5563; line-height: 1.8;">
                    身体・感情・人生の3つの領域のバランスを見ることで、<br>
                    あなたの偽物感がどこから生じているのかが明確になります。
                </p>
            </div>

            ${impostorSection}

            <div class="footer">
                <p>&copy; 2025 魂感自在道 - Konkan Jizai Do</p>
                <p>この診断結果は30日間保存されます</p>
            </div>
        </div>
    </div>

    <script>
        // キャンバスでの三角形チャート描画
        const canvas = document.getElementById('balanceChart');
        const ctx = canvas.getContext('2d');
        const centerX = 150;
        const centerY = 150;
        const radius = 100;

        // スコアデータ
        const scores = {
            body: ${bodyPercent},
            emotion: ${emotionPercent},
            life: ${lifePercent}
        };

        // 三角形の頂点座標
        const vertices = [
            { x: centerX, y: centerY - radius, label: '身体' },
            { x: centerX + radius * Math.cos(Math.PI/6), y: centerY + radius * Math.sin(Math.PI/6), label: '感情' },
            { x: centerX - radius * Math.cos(Math.PI/6), y: centerY + radius * Math.sin(Math.PI/6), label: '人生' }
        ];

        // 背景三角形
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        vertices.forEach((v, i) => {
            if (i === 0) ctx.moveTo(v.x, v.y);
            else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        ctx.stroke();

        // グリッドライン
        for (let i = 0.2; i <= 0.8; i += 0.2) {
            ctx.strokeStyle = '#f3f4f6';
            ctx.lineWidth = 1;
            ctx.beginPath();
            vertices.forEach((v, j) => {
                const x = centerX + (v.x - centerX) * i;
                const y = centerY + (v.y - centerY) * i;
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.stroke();
        }

        // スコアの三角形
        const scoreVertices = [
            { x: centerX + (vertices[0].x - centerX) * scores.body / 100, 
              y: centerY + (vertices[0].y - centerY) * scores.body / 100 },
            { x: centerX + (vertices[1].x - centerX) * scores.emotion / 100, 
              y: centerY + (vertices[1].y - centerY) * scores.emotion / 100 },
            { x: centerX + (vertices[2].x - centerX) * scores.life / 100, 
              y: centerY + (vertices[2].y - centerY) * scores.life / 100 }
        ];

        ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        scoreVertices.forEach((v, i) => {
            if (i === 0) ctx.moveTo(v.x, v.y);
            else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // ラベル
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        vertices.forEach(v => {
            const labelY = v.y < centerY ? v.y - 10 : v.y + 25;
            ctx.fillText(v.label, v.x, labelY);
        });

        // アニメーション
        window.addEventListener('DOMContentLoaded', () => {
            const scoreFills = document.querySelectorAll('.score-fill');
            scoreFills.forEach((fill, index) => {
                setTimeout(() => {
                    fill.style.transition = 'width 1.5s ease-out';
                }, index * 200);
            });
        });
    </script>
</body>
</html>`;
}