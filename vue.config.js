// vue.config.js
const path = require('path');
const { projectPath } = require('./src/config/project');
const projectConf = require('./src/config/project');
const bin = {
    base: require("./bin/base"),
    comm: require("./bin/comm"),
    dev: require("./bin/dev"),
    prod: require("./bin/prod"),
}
// 生成目录
function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = {
    ...bin.base,

    configureWebpack: config => {
        config.entry.app = [`${projectPath}/main.js`];
        if (process.env.NODE_ENV === 'production') {
            return {
                ...bin.comm(config),
                ...bin.prod(config),
            }
        } else {
            return {
                ...bin.comm(config),
                ...bin.dev(config),
            }
        }
    },
    chainWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config
                .plugin('html')
                .tap(args => {
                    args[0].template = `${projectPath}/public/index.html`
                    return args
                })
            config
                .plugin('env')
                .use(require.resolve('webpack/lib/EnvironmentPlugin'), [{
                    'PROJECT_INFO': JSON.stringify({
                        ...projectConf,
                    })
                }]);
        } else {
            config
                .plugin('env')
                .use(require.resolve('webpack/lib/EnvironmentPlugin'), [{
                    'PROJECT_INFO': JSON.stringify({
                        ...projectConf,
                    })
                }]);

        }

    },
}