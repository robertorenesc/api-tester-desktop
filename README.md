# API Tester Desktop

## 1. Introduction

API Tester Desktop is a lightweight, cross-platform desktop application designed for testing and debugging APIs. It provides a user-friendly interface for sending HTTP requests, viewing responses, and managing environment variables for different API endpoints.

## 2. Main Functionality

- **HTTP Request Management**: Support for all common HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- **Request Configuration**: Easy configuration of URL parameters, headers, and request body
- **Response Visualization**: Clear display of response status, headers, body, and cookies
- **Environment Management**: Create and manage environments with variables that can be used in requests
- **Variable Substitution**: Use environment variables in URLs, headers, and request bodies using `{{variableName}}` syntax
- **Request History**: Automatically track request history for quick reference
- **Save Requests**: Save frequently used requests for later use
- **JSON Support**: Built-in JSON editor and viewer for request and response bodies
- **Persistent Storage**: All data (environments, saved requests, history) is stored in JSON files in the user's home directory

## 3. Tools Used

- **Electron**: Cross-platform desktop application framework
- **React**: Frontend UI library
- **Vite**: Build tool and development server
- **Axios**: HTTP client for making API requests
- **Monaco Editor**: Code editor component (via @monaco-editor/react)
- **Electron Store**: Persistent storage for saving environments, requests, and history in the user's home directory

## 4. Commands to Run and Build

### Development

```bash
# Install dependencies
npm install

# Run in development mode (starts both React dev server and Electron)
npm run dev

# Run React development server only
npm run dev:react

# Run Electron with React dev server
npm run dev:electron
```

### Production

```bash
# Build React app and start Electron
npm start

# Build React app and create distributable packages
npm run build
```

## 5. Data Storage

API Tester Desktop stores all data in JSON files in a `.api_tester` folder in the user's home directory:

- `environments.json`: Stores all environment configurations and variables
- `requests.json`: Stores all saved API requests
- `history.json`: Stores the request history (limited to the last 50 requests)

This approach ensures that your data persists between application restarts and makes it easy to back up or transfer your configurations.

## 6. Author

API Tester Desktop was created by Roberto Salazar (robertorenesc@gmail.com)

---

## License

This project is open source and available under the MIT License.
