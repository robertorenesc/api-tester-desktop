import axios from 'axios';

export const makeRequest = async (config) => {
  const { method, url, headers, body, params } = config;
  
  // Process URL to replace path parameters
  let processedUrl = url;
  
  // Find path parameters
  const pathParams = params.filter(param => 
    param.enabled && param.key && (param.paramType === 'path')
  );
  
  // Replace path parameters in the URL
  pathParams.forEach(param => {
    const placeholder = `{${param.key}}`;
    processedUrl = processedUrl.replace(placeholder, param.value || '');
  });
  
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
    url: processedUrl,
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
  
  // Add query params
  const queryParams = {};
  params.forEach(param => {
    if (param.enabled && param.key && (!param.paramType || param.paramType === 'query')) {
      queryParams[param.key] = param.value || '';
    }
  });
  
  if (Object.keys(queryParams).length > 0) {
    requestConfig.params = queryParams;
  }
  
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
