import Vue from 'vue'
import App from './App.vue'
import {
  router
} from './router';
import {
  store
} from "./store/store"
import VueResource from 'vue-resource';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import Vuelidate from "vuelidate"
import VueToastr from "vue-toastr";

Vue.use(VueToastr, {
  // toastr kişiselleştirme
});

Vue.use(Vuelidate);

Vue.use(VueResource);

const firebaseConfig = {
  apiKey: "AIzaSyDGRAx8NvtQtYTjpTN6XIp75YA8r75vc1o",
  authDomain: "vue-login-and-product.firebaseapp.com",
  databaseURL: "https://vue-login-and-product-default-rtdb.firebaseio.com",
  projectId: "vue-login-and-product",
  storageBucket: "vue-login-and-product.appspot.com",
  messagingSenderId: "552793424795",
  appId: "1:552793424795:web:1d95f67c4db695f8f2973e"
};

firebase.initializeApp(firebaseConfig);

Vue.filter("currency", (value) => {
  if (Number.isNaN(value)) {
    value = 0
    return value + " TL"
  } else
    return parseFloat(value).toLocaleString(undefined, {
      minimumIntegerDigits: 1
    }) + " TL";
});

Vue.filter("time", (value) => {
  var minutes = Math.floor(value / 60000);
  var seconds = ((value % 60000) / 1000).toFixed(0);
  return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
});

new Vue({
  el: '#app',
  data: {
    search: ""
  },
  store,
  router,
  render: h => h(App)
})