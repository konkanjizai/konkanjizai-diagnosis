const { Redis } = require('@upstash/redis');

// Redis接続
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

exports.handler = async (event, context) => {
  // CORSヘッダー
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // OPTIONSリクエスト対応
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // POSTリクエストのみ受け付け
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    // リクエストボディをパース
    const data = JSON.parse(event.body);
    const { id, resultData } = data;

    if (!id || !resultData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'ID and resultData are required' }),
      };
    }

    // resultDataにはすでにsei、mei、userNameが含まれているはず
    // 念のため確認してログ出力
    console.log('Received resultData with:', {
      id,
      sei: resultData.sei,
      mei: resultData.mei,
      userName: resultData.userName
    });

    // Redisに保存（30日間有効）
    // resultDataをそのまま保存（sei、mei、userNameが含まれている）
    await redis.set(`result:${id}`, JSON.stringify(resultData), {
      ex: 2592000, // 30日間（秒）
    });

    // 成功レスポンス
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Result saved successfully',
        id: id 
      }),
    };

  } catch (error) {
    console.error('Error saving result:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};