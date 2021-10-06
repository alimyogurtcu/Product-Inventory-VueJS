<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark"
    style="background-color: #563f7a"
    :class="isAuth"
  >
    <router-link to="/profile" tag="a" :class="isAuth" class="navbar-brand">
      <a class="nav-link">Profile</a>
    </router-link>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <router-link
          to="/product-list"
          tag="li"
          class="nav-item"
          :class="isAuth"
          active-class="active"
        >
          <a class="nav-link">Products List</a>
        </router-link>
        <router-link
          to="/product-transactions"
          tag="li"
          class="nav-item"
          :class="isAuth"
          active-class="active"
        >
          <a class="nav-link">Product Transactions</a>
        </router-link>
        <router-link
          to="/product-sale-deletion"
          tag="li"
          class="nav-item"
          :class="isAuth"
          active-class="active"
        >
          <a class="nav-link">Product Sale-Deletion</a>
        </router-link>
      </ul>
      <ul class="navbar-nav my-2 my-lg-0">
        <li class="nav-item time">
          {{ computedTime | time }}
        </li>
      </ul>
      <ul class="navbar-nav my-2 my-lg-0">
        <li class="nav-item">
          <a @click.prevent="logout" class="nav-link" href="#">Log Out</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      time: "",
    };
  },
  methods: {
    logout() {
      this.$toastr.i("Goodbye");
      this.$store.dispatch("logout");
    },
  },
  computed: {
    // Görülebilir/Görülemez
    isAuth() {
      return {
        invisible: !this.$store.getters.isAuthenticated,
      };
    },
    // Computed ile otomatik çıkış yapılmasına kalan süreyi göstermek için
    computedTime: function () {
      return this.time;
    },
  },
  mounted: function () {
    // Otomatik çıkış yapılmasına kalan sürenin hesaplanması
    setInterval(() => {
      let expirationDate = localStorage.getItem("expirationDate");
      let getTime = new Date().getTime();
      let timerSecond = expirationDate - getTime;
      this.time = timerSecond;
    }, 1000);
  },
};
</script>

<style scoped>
.time {
  color: wheat;
}
</style>