// utils/config.js
const env = {
  dev: {
    apiBaseUrl: 'http://192.168.2.2:5004'
  },
  prod: {
    apiBaseUrl: 'http://43.139.235.149:5004'
  }
};

// 当前环境，开发时设为dev，生产时设为prod
const currentEnv = 'prod';

export default {
  apiBaseUrl: env[currentEnv].apiBaseUrl
};