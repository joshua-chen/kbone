/**
 * 配置参考：https://wechat-miniprogram.github.io/kbone/docs/config/
 */

module.exports = {
    origin: 'https://test.miniprogram.com',
    entry: '/',
    router: {
        home: [
            '/(home|index)?',
            '/index.html',
            '/test/(home|index)',
        ],
        my: [
            '/my/',
            '/my/index',
            '/my.html',
            '/test/my/index',
        ],
    },

    redirect: {
        notFound: 'home',
        accessDenied: 'home',
    },
    runtime: {
        wxComponent: 'default', //default | noprefix; 
        //default：默认值，表示可使用 wx-component 标签或类似 wx-view 这样使用前缀的用法来使用内置组件
        //noprefix：支持 default 用法的前提下，也支持无前缀的用法，比如直接使用 view 标签表示 view 内置组件
        cookieStore: 'default',
        /*  default：默认值，存储在小程序的 storage 中，所有页面共享
            storage：存储在小程序的 storage 中，页面间不共享
            memory：存储在内存中，页面间不共享
            globalstorage：同 default
            globalmemory：存储在内存中，所有页面共享
        */
    },
    generate: {
        appEntry: 'miniprogram-app',
        //app: 'miniprogram-app',
        //projectConfig: path.join(__dirname, '../dist/mp'), // 注意，这是目录路径，不是文件路径
        autoBuildNpm: 'npm',
        globalVars: [
            ['TEST_VAR_STRING', '\'miniprogram\''],
            ['TEST_VAR_NUMBER', '123'],
            ['TEST_VAR_BOOL', 'true'],
            ['TEST_VAR_FUNCTION', 'function() {return \'I am function\'}'],
            ['TEST_VAR_OTHERS', 'window.document'],
            ['CustomEvent'],
        ],
        subpackages: {
            'package-product': ['product'],
        },
        preloadRule: { //预加载
            // 进入 list 页面时，会预下载名为 package2 的分包
            //list: {
            //    network: 'all',
            //    packages: ['package2'],
            // },
        },
        tabBar: {
            color: '#000000',
            selectedColor: '#07c160',
            backgroundColor: '#ffffff',
            list: [{
                    pageName: 'home',
                    text: '主页',
                    // iconPath: path.resolve(__dirname, '../src/img/home.png'),
                    //selectedIconPath: path.resolve(__dirname, '../src/img/home-sel.png'),
                },
                {
                    pageName: 'category',
                    text: '分类',
                    //iconPath: path.resolve(__dirname, '../src/img/profile.png'),
                    //selectedIconPath: path.resolve(__dirname, '../src/img/profile-sel.png'),
                },
                {
                    pageName: 'cart',
                    text: '购物车',
                    //iconPath: path.resolve(__dirname, '../src/img/profile.png'),
                    //selectedIconPath: path.resolve(__dirname, '../src/img/profile-sel.png'),
                },
                {
                    pageName: 'my',
                    text: '我的',
                    //iconPath: path.resolve(__dirname, '../src/img/profile.png'),
                    //selectedIconPath: path.resolve(__dirname, '../src/img/profile-sel.png'),
                }
            ],
            // 使用自定义 tabBar
            //custom: path.join(__dirname, '../src/custom-tab-bar'),
        },

    },
    app: {
       
        backgroundTextStyle: 'dark',
        navigationBarTextStyle: 'white',
        navigationBarTitleText: 'kbone',       

    },
    appExtraConfig: {
        sitemapLocation: 'sitemap.json',
        debug: true,
        resizable: true,
        useExtendedLib: {
            kbone: true,
            weui: true,
            moment: true,
        },
    },
    global: {
        share: true,
        windowScroll: false,
        backgroundColor: '#F7F7F7',
    },
    pages: {},
    optimization: {
        domSubTreeLevel: 10,

        elementMultiplexing: true,
        textMultiplexing: true,
        commentMultiplexing: true,
        domExtendMultiplexing: true,

        styleValueReduce: 5000,
        attrValueReduce: 5000,
    },
    projectConfig: {
        projectname: 'kbone-shop',
        appid: 'wxb72da050b122eb21',
    },
}