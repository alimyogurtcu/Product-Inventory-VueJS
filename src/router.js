import Vue from "vue";
import VueRouter from 'vue-router';
import ProductList from './components/pages/products/ProductList';
import ProductSaleDeletion from "./components/pages/products/ProductSaleDeletion .vue";
import ProductTransactions from './components/pages/products/ProductTransactions';
import Profile from './components/pages/Profile.vue';
import Auth from './components/pages/Auth.vue';

Vue.use(VueRouter);

const routes = [{
        path: "*",
        redirect: "/product-list"
    },
    {
        path: "/auth",
        component: Auth,
        beforeEnter(to, from, next) {
            var user = localStorage.getItem("token")
            if (user) {
                next("/product-list")
            } else {
                next();
            }
        }
    },
    {
        path: "/profile",
        component: Profile,
        beforeEnter(to, from, next) {
            var user = localStorage.getItem("token")
            if (user) {
                next()
            } else {
                next("/auth");
            }
        }
    },
    {
        path: "/product-list",
        component: ProductList,
        beforeEnter(to, from, next) {
            var user = localStorage.getItem("token")
            if (user) {
                next()
            } else {
                next("/auth");
            }
        }
    },
    {
        path: "/product-transactions",
        component: ProductTransactions,
        beforeEnter(to, from, next) {
            var user = localStorage.getItem("token")
            if (user) {
                next()
            } else {
                next("/auth");
            }
        }
    },
    {
        path: "/product-sale-deletion",
        component: ProductSaleDeletion,
        beforeEnter(to, from, next) {
            var user = localStorage.getItem("token")
            if (user) {
                next()
            } else {
                next("/auth");
            }
        }
    },
];

export const router = new VueRouter({
    mode: "hash",
    routes
});