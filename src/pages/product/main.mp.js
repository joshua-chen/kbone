import Vue from 'vue';
import Router from 'vue-router';
import { sync } from 'vuex-router-sync';
import App from '../../App.vue';
import store from '../../store';
import ProductDetail from './Detail.vue';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [{
        path: '/product/(detail|index)?',
        name: 'ProductDetail',
        component: ProductDetail,
    }, {
        path: '/product/detail.html',
        name: 'ProductDetail-Html',
        component: ProductDetail,
    }, {
        path: '/test/product/(detail|index)',
        name: 'ProductDetail-Test',
        component: ProductDetail,
    }],
});

export default function createApp() {
    const container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);

    Vue.config.productionTip = false;

    sync(store, router);

    return new Vue({
        el: '#app',
        router,
        store,
        render: h => h(App)
    });
}
