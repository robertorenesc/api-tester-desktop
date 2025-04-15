import axios from 'axios';

export const makeRequest = async (config) => {
  const { method, url, headers, body, params } = config;
  
  // Convert headers array to object
  const headersObj = {};
  headers.forEach(header => {
    if (header.enabled && header.key) {
      headersObj[header.key] = header.value;
    }
  });
  
  // Configure request
  const requestConfig = {
    method: method.toLowerCase(),
    url: url,
    headers: headersObj,
    timeout: 30000, // 30 seconds timeout
  };
  
  // Add body for appropriate methods
  if (['post', 'put', 'patch'].includes(method.toLowerCase()) && body) {
    try {
      // Try to parse as JSON if it's a string
      if (typeof body === 'string') {
        try {
          requestConfig.data = JSON.parse(body);
        } catch (e) {
          // If not valid JSON, use as-is
          requestConfig.data = body;
        }
      } else {
        requestConfig.data = body;
      }
    } catch (error) {
      console.error('Error parsing body:', error);
      requestConfig.data = body;
    }
  }
  
  // Add query params (we're handling this in the URL construction in RequestPanel,
  // but we could also handle it here if preferred)
  
  try {
    const response = await axios(requestConfig);
    
    // Extract cookies from headers
    const cookies = {};
    const cookieHeader = response.headers['set-cookie'];
    if (cookieHeader) {
      if (Array.isArray(cookieHeader)) {
        cookieHeader.forEach(cookie => {
          const [cookiePart] = cookie.split(';');
          const [cookieName, cookieValue] = cookiePart.split('=');
          cookies[cookieName] = cookieValue;
        });
      } else if (typeof cookieHeader === 'string') {
        const [cookiePart] = cookieHeader.split(';');
        const [cookieName, cookieValue] = cookiePart.split('=');
        cookies[cookieName] = cookieValue;
      }
    }
    
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
      cookies: cookies
    };
  } catch (error) {
    throw error;
  }
};