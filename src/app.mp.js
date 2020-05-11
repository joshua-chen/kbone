/* eslint-disable eol-last */
/* eslint-disable no-unused-vars */
import './app.mp.css';

App({
    onLaunch(options) {},
    onShow(options) {
        console.log('App.onShow', options);
        // 获取当前页面实例
        const pages = getCurrentPages() || [];
        const currentPage = pages[pages.length - 1];
        console.log('App.currentPage', currentPage);
        // 获取当前页面的 window 对象和 document 对象
        if (currentPage) {
            console.log('App', currentPage.window);
            console.log('App', currentPage.document);
        }
    },
    onHide() {},
    onError(err) {},
    onPageNotFound(options) {},

    globalData: {
        launchOptions: {},
        caches: {},
    }
});