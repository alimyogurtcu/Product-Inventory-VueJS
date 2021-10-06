<template>
  <nav
    class="navbar fixed-bottom navbar-light"
    style="background-color: #e3f2fd"
    :class="isAuth"
  >
    <span class="navbar-text mr-auto">
      <strong>Alim Yogurtcu</strong> | <a href="https://github.com/alimyogurtcu/product-inventory-vuejs"><i class="fab fa-github"></i> GitHub</a> | <a href="https://www.kariyer.net/ozgecmis/alimyogurtcu"><i class="fab fa-kickstarter-k"></i> kariyer.net</a>
    </span>
    <span class="navbar-text navbar-nav my-2 my-lg-0 mx-2" :class="isAuth">
      <strong>Total Value of Inventory: </strong>
      <span class="badge badge-primary">{{
        getBalance.valueOfInventory | currency
      }}</span>
    </span>
    <span class="navbar-text navbar-nav my-2 my-lg-0 mx-2" :class="isAuth">
      <strong>Total Sales Amount: </strong>
      <span class="badge badge-primary">{{ getBalance.sales | currency }}</span>
    </span>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    // Vuex mapGetters ile bakiyelerin getirilmesi
    ...mapGetters(["getBalance"]),
    // v-bind class ile Görülebilir/Görülemez
    isAuth() {
      return {
        "d-none": !this.$store.getters.isAuthenticated,
      };
    },
  },
  methods: {
    // Çıkış yap
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>

<style scoped>
</style>