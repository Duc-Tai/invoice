const middleware = {}

middleware['authenticated-home'] = require('..\\middleware\\authenticated-home.js')
middleware['authenticated-home'] = middleware['authenticated-home'].default || middleware['authenticated-home']

middleware['authenticated'] = require('..\\middleware\\authenticated.js')
middleware['authenticated'] = middleware['authenticated'].default || middleware['authenticated']

middleware['notAuthenticated'] = require('..\\middleware\\notAuthenticated.js')
middleware['notAuthenticated'] = middleware['notAuthenticated'].default || middleware['notAuthenticated']

export default middleware
