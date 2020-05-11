import Vue from 'vue';
import Router from 'vue-router';
import { sync } from 'vuex-router-sync';
import App from '../../App.vue';
import store from '../../store';
import My from './Index.vue';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [{
        path: '/(my|index)?',
        name: 'My',
        component: My,
    }, {
        path: '/my.html',
        name: 'My-Html',
        component: My,
    }, {
        path: '/test/(my|index)',
        name: 'My-Test',
        component: My,
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
