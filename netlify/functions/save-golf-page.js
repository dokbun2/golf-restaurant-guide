// GitHub API를 사용하여 파일을 저장하는 Netlify Function
exports.handler = async (event, context) => {
  // CORS 헤더
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // OPTIONS 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // POST 요청만 처리
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { fileName, content, githubToken } = JSON.parse(event.body);
    
    if (!fileName || !content) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '파일명과 내용이 필요합니다.' })
      };
    }

    // GitHub API 사용 (토큰이 제공된 경우)
    if (githubToken) {
      const { Octokit } = await import('@octokit/rest');
      const octokit = new Octokit({ auth: githubToken });
      
      const owner = 'dokbun2';
      const repo = 'golf-restaurant-guide';
      const path = fileName;
      
      // 파일 생성 또는 업데이트
      try {
        // 먼저 파일이 존재하는지 확인
        let sha;
        try {
          const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path
          });
          sha = data.sha;
        } catch (e) {
          // 파일이 없으면 sha는 undefined
        }
        
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path,
          message: `Add/Update ${fileName}`,
          content: Buffer.from(content).toString('base64'),
          sha: sha
        });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: '파일이 GitHub에 저장되었습니다.' })
        };
      } catch (error) {
        console.error('GitHub API 오류:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'GitHub 저장 중 오류가 발생했습니다.' })
        };
      }
    }
    
    // 토큰이 없으면 에러
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: 'GitHub 토큰이 필요합니다.',
        instructions: '설정 방법은 README를 참조하세요.'
      })
    };
    
  } catch (error) {
    console.error('오류:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '서버 오류가 발생했습니다.' })
    };
  }
};