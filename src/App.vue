<template>
  <div>
    <app-header></app-header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Header from "./components/shared/Header.vue";
import Footer from "./components/shared/Footer.vue";
import ProductTransactions from "./components/pages/products/ProductTransactions.vue";
import ProductSaleDeletion from "./components/pages/products/ProductSaleDeletion .vue";
import ProductList from "./components/pages/products/ProductList.vue";

export default {
  components: {
    appHeader: Header,
    appFooter: Footer,
    appProductTransactions: ProductTransactions,
    appProductSaleDeletion: ProductSaleDeletion,
    appProductList: ProductList,
  },
  beforeCreate() {
    this.$store.dispatch("initLogin");
    this.$store.dispatch("getBalance");
    this.$store.dispatch("initApp");
  },
};
</script>

<style>
body {
  background-color: #a7a0bb5c;
}

.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.5s ease-out;
}

.fade-leave-active {
  transition: opacity 0.5s ease-out;
  opacity: 0;
}
</style>