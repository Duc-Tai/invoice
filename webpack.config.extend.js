const path = require('path')
module.exports = config => {
    config.module.rules.push({
        test: /\.html$/,
        loaders: ['vue-html-loader']
    });
    config.resolve.alias["vue"] = "vue/dist/vue.esm.js";

    return config
}