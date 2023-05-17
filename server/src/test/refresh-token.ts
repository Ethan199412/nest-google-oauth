function refreshAccessToken(refreshToken) {
    const clientId = 'YOUR_CLIENT_ID';
    const clientSecret = 'YOUR_CLIENT_SECRET';
    const redirectUri = 'YOUR_REDIRECT_URI';
    const refreshTokenUrl = 'https://www.googleapis.com/oauth2/v4/token';
  
    const data = {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    };
  
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&')
    };
  
    return fetch(refreshTokenUrl, options)
      .then(response => response.json())
      .then(data => data.access_token)
      .catch(error => console.error(error));
  }
  
  // Usage:
  refreshAccessToken('YOUR_REFRESH_TOKEN')
    .then(access_token => console.log(access_token));
  