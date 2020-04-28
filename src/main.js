// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import Vuex from 'vuex'
import DefaultLayout from '~/layouts/Default.vue'
import '~/tailwind.css'
import Buefy from 'buefy'

import 'buefy/dist/buefy.css'
import Vue from 'vue'
import Vuesax from 'vuesax'

import 'vuesax/dist/vuesax.css' //Vuesax styles
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashRestoreAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTrashRestoreAlt)

// import VAnimateCss from 'v-animate-css/dist/v-animate-css';

export default function (Vue, { router, head, isClient, appOptions  }) {
  // Set default layout as a global component

  const authroutes = ['/'];

  router.beforeEach((to, from, next) => {
    if (authroutes.includes(to.path)) {
      var token = process.isClient ? localStorage.getItem("token") : false
        if ( token == null || token == false ) {
            next({
                path: '/login',
            })
        } else {
            next()
        }
    } else {
        next()
    }
  })

  Vue.use(Vuex)
  appOptions.store = new Vuex.Store({
    state: {
      user: []
    },
    mutations: {
    }
  })

  head.link.push({
    rel: 'stylesheet',
    href: 'https://use.fontawesome.com/releases/v5.2.0/css/all.css'
})

 
  Vue.use(Buefy, {
    defaultIconPack: 'fas' // Font Awesome Solid
  })
  Vue.use(Vuesax)
  Vue.component('Layout', DefaultLayout)
  Vue.component('font-awesome-icon', FontAwesomeIcon)
  // Vue.use(VAnimateCss);
}
