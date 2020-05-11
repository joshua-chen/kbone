import Vue from 'vue';
import Router from 'vue-router';
import { sync } from 'vuex-router-sync';
import App from '../../App.vue';
import store from '../../store';
import Category from './Index.vue';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [{
        path: '/(category|index)?',
        name: 'Category',
        component: Category,
    }, {
        path: '/category/index.html',
        name: 'Category-Html',
        component: Category,
    }, {
        path: '/test/(category|index)',
        name: 'Category-Test',
        component: Category,
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
