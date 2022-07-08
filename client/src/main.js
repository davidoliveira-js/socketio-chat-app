import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '../node_modules/bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import '@/assets/css/main.css';

import * as io from 'socket.io-client';
import VueSocketIo from 'vue-socket.io';

import VueCookies from 'vue-cookies';

Vue.use(VueCookies);

Vue.use(
  new VueSocketIo({
    debug: true,
    connection: io('https://socketio-chat-js.herokuapp.com', {
      query: 'CustomId=null',
    }),
  })
);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
