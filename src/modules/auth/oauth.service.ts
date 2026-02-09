import axios from 'axios';

export const getFacebookLoginUrl = () => {
    const FB_APP_ID = process.env.FB_APP_ID;
    // Ensure this matches exactly what is in your Meta App Settings -> Use Cases -> Facebook Login -> Settings
    const REDIRECT_URI = 'http://localhost:3000/index.html'; 

    const rootUrl = 'https://www.facebook.com/v21.0/dialog/oauth';

    const options = {
        client_id: FB_APP_ID!,
        redirect_uri: REDIRECT_URI,
        state: process.env.FB_STATE || 'standard_state_string', 
        // Note: Removed spaces from join for maximum compatibility
        scope: [
            'public_profile',
            'email',
            'pages_show_list',
            'pages_read_engagement',
            'pages_manage_posts'
        ].join(','),
        response_type: 'code',
        auth_type: 'rerequest' // Added: Prompt user again if they declined permissions previously
    };

    const qs = new URLSearchParams(options).toString();
    return `${rootUrl}?${qs}`;
};

export const getFacebookTokenFromCode = async (code: string) => {
    const rootUrl = 'https://graph.facebook.com/v21.0/oauth/access_token';
    
    const options = {
        client_id: process.env.FB_APP_ID, 
        client_secret: process.env.FB_APP_SECRET,
        redirect_uri: 'http://localhost:3000/index.html',
        code : code,
    };

    try {
        const { data } = await axios.get(rootUrl, { params: options });
        return data.access_token; // This is your User Access Token
    } catch (error: any) {
        console.error("FB Token Exchange Error:", error.response.data);
        throw new Error('Failed to exchange code for token');
    }
};



export const getPermanentPageToken = async (shortLivedToken: string) => {
  // A. Exchange for Long-Lived User Token (60 days)
  const { data: longLived } = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: process.env.FB_APP_ID,
      client_secret: process.env.FB_APP_SECRET,
      fb_exchange_token: shortLivedToken,
    },
  });

  // B. Get Page Access Token (Permanent)
  const { data: accounts } = await axios.get('https://graph.facebook.com/v21.0/me/accounts', {
    params: { access_token: longLived.access_token },
  });

  // Assuming you want the first page the user manages
  return accounts.data[0]; 
};