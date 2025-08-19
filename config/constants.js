const { join } = require('path')

module.exports = {
    buildPath: join(__dirname, '../build/'),
    publicPath: '/static',
    hmrPort: 8099
}
