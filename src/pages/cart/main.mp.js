import Vue from 'vue';
import Router from 'vue-router';
import { sync } from 'vuex-router-sync';
import App from '../../App.vue';
import store from '../../store';
import Cart from './Index.vue';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [{
        path: '/(cart|index)?',
        name: 'Cart',
        component: Cart,
    }, {
        path: '/cart/index.html',
        name: 'Cart-Html',
        component: Cart,
    }, {
        path: '/test/(cart|index)',
        name: 'Cart-Test',
        component: Cart,
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
