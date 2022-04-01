class constants {
  static getConstant() {
    const envVariables = {
      // url: 'http://20.195.8.140:1510',
      // url: 'http://192.168.1.178:125',
      // url: 'http://192.168.1.178:140'
      // url: 'http://192.168.1.123:125/api/v1/'
      // url: 'http://localhost:125/api/v1/' //  HARIS 
      url: 'https://bigai-apps.azurewebsites.net/api/v1/'
      // url:'https://ai-apps.azurewebsites.net/api/v1/',
      // url: 'https://bigai-apps.azurewebsites.net/api/v1/'cls
      // url: 'https://cd98-45-249-8-205.ngrok.io/api/v1/'
      // url: 'https://e065-103-244-179-84.ngrok.io/api/v1/'
    };

    return envVariables;
  }
}

export default (constants);