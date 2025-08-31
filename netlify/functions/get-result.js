const { Redis } = require('@upstash/redis');

// Redis接続
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// HTMLテンプレートを読み込む関数
const generateResultHTML = (resultData) => {
  const {
    userName,
    totalScore,
    diagnosisType,
    bodyScore,
    emotionScore,
    meaningScore,
    responses,
    timestamp
  } = resultData;

  // 診断結果HTMLテンプレート（魂感自在道デザイン）
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>${userName}様の診断結果 - 魂感自在道</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Noto Sans JP', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .result-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 2px solid #e0e0e0;
        }
        
        .user-name {
            font-size: 1.8em;
            color: #764ba2;
            margin-bottom: 10px;
        }
        
        .diagnosis-type {
            font-size: 1.4em;
            color: #667eea;
            margin-bottom: 20px;
            font-weight: bold;
        }
        
        .total-score {
            font-size: 3em;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: bold;
        }
        
        .score-label {
            color: #666;
            font-size: 1.1em;
        }
        
        .scores-section {
            margin: 40px 0;
        }
        
        .score-item {
            margin-bottom: 30px;
        }
        
        .score-title {
            font-size: 1.2em;
            color: #333;
            margin-bottom: 10px;
            font-weight: bold;
        }
        
        .score-bar {
            background: #f0f0f0;
            height: 30px;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
        }
        
        .score-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 15px;
            color: white;
            font-weight: bold;
            transition: width 1.5s ease-out;
        }
        
        .message-section {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 30px;
            margin-top: 40px;
        }
        
        .message-title {
            font-size: 1.3em;
            color: #764ba2;
            margin-bottom: 15px;
            font-weight: bold;
        }
        
        .message-content {
            line-height: 1.8;
            color: #555;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #e0e0e0;
        }
        
        .timestamp {
            color: #999;
            font-size: 0.9em;
        }
        
        .logo {
            font-size: 1.5em;
            color: #764ba2;
            font-weight: bold;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="result-card">
            <div class="header">
                <div class="user-name">${userName}様</div>
                <div class="diagnosis-type">${diagnosisType}</div>
                <div class="total-score">${totalScore}点</div>
                <div class="score-label">総合スコア</div>
            </div>
            
            <div class="scores-section">
                <div class="score-item">
                    <div class="score-title">身体・エネルギー領域</div>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${(bodyScore/25)*100}%">
                            ${bodyScore}/25点
                        </div>
                    </div>
                </div>
                
                <div class="score-item">
                    <div class="score-title">感情・思考・役割領域</div>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${(emotionScore/25)*100}%">
                            ${emotionScore}/25点
                        </div>
                    </div>
                </div>
                
                <div class="score-item">
                    <div class="score-title">人生・存在・意味領域</div>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${(meaningScore/25)*100}%">
                            ${meaningScore}/25点
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="message-section">
                <div class="message-title">あなたの診断結果について</div