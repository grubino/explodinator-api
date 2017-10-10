/**
 * Created by gregrubino on 4/14/17.
 */
const _Environments = {
  production:  {BASE_URL: '', API_KEY: ''},
  staging:     {BASE_URL: '', API_KEY: ''},
  development: {
    BASE_URL: 'https://explodinator.org/v1',
    S3_BASE: 'https://s3.amazonaws.com/explodinations',
    API_KEY: 's3cr3tp4ssw0rd'
  }
};

function getEnvironment() {
  // Insert logic here to get the current platform (e.g. staging, production, etc)
  let platform = 'development'; // TODO - get from environment“

  // ...now return the correct environment
  return _Environments[platform];
}

const Environment = getEnvironment();
module.exports = Environment;

