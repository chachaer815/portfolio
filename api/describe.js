// Vercel AI API 路由
// 部署到 Vercel 后，在 Vercel 控制台添加环境变量 DEEPSEEK_API_KEY

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { projectName, projectUrl } = await request.json();

    // 火山引擎 DeepSeek 配置
    const endpoint = process.env.DEEPSEEK_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-v3.2';

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'API未配置',
        description: '丸子的项目' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemPrompt = `你是一个友好的个人作品集助手。请根据项目名称和网址生成简短的项目描述。要求：1. 描述30字以内 2. 友好、简洁 3. 直接返回描述文字`;

    const userPrompt = `项目名称：${projectName}\n项目网址：${projectUrl}\n\n请生成简短的项目描述：`;

// 调用火山引擎 DeepSeek API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: 'API调用失败',
        description: '丸子的项目'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content?.trim() || '丸子的项目';

    return new Response(JSON.stringify({ 
      description,
      projectName,
      projectUrl
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      description: '丸子的项目'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
