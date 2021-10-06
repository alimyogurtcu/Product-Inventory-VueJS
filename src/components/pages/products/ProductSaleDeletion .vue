<template>
  <div class="container">
    <!-- ** LOADING ** -->
    <div class="loading" :style="isLoading">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>

    <div class="row">
      <div class="col-6 offset-3 pt-3 card mt-5 shadow">
        <div class="card-body">
          <h3>Product Sale-Deletion</h3>
          <hr />
          <div class="form-group">
            <label>Product Title</label>
            <select
              class="form-control"
              v-model="selectedProduct"
              @change="productSelected"
            >
              <option selected disabled>Products</option>
              <option
                v-for="product in sortedProduct"
                :value="product.key"
                :disabled="product.count == 0"
              >
                {{ product.title }}
              </option>
            </select>
          </div>
          <transition name="fade" mode="out-in">
            <div class="card mb-2 border border-danger" v-if="product != null">
              <div class="card-body">
                <div class="row">
                  <div class="col-12 text-center">
                    <div class="mb-3">
                      <span class="badge badge-info"
                        >Stock : {{ product.count }}</span
                      >
                      <span class="badge badge-primary"
                        >Pcs Price : {{ product.price | currency }}</span
                      >
                    </div>
                    <p class="border border-warning p-2 text-secondary">
                      {{ product.description }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="form-group m-2">
                <label>Quantity</label>
                <input
                  v-model="product_count"
                  @blur="$v.product_count.$touch()"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': $v.product_count.$error }"
                  placeholder="Quantity to be selling"
                  :min="0"
                  :max="product.count"
                />
              </div>
              <div class="form-group m-2">
                <label>Price</label>
                <input
                  v-model="product_price"
                  @blur="$v.product_price.$touch()"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': $v.product_price.$error }"
                  placeholder="The price of the product to be selling"
                  :min="0"
                />
              </div>
            </div>
          </transition>
          <hr />
          <button class="btn btn-primary" @click="save" :disabled="saveEnabled">
            Save
          </button>
          <button class="btn btn-danger" @click="del" :disabled="delEnabled">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { required, numeric } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      selectedProduct: null,
      product: null,
      product_count: null,
      product_price: null,
      buttonClicked: false,
    };
  },
  validations: {
    product_count: {
      required,
      numeric,
    },
    product_price: {
      required,
      numeric,
    },
  },
  computed: {
    ...mapGetters(["getProducts"]),
    // Save butonunun gerekli şartlar sağlandığı takdirde aktifleşmesi için
    saveEnabled() {
      if (
        this.selectedProduct !== null &&
        parseInt(this.product_count) > 0 &&
        parseInt(this.product_count) <= parseInt(this.product.count) &&
        parseInt(this.product_price) > 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    // Delete butonunun gerekli şartlar sağlandığı takdirde aktifleşmesi için
    delEnabled() {
      if (this.selectedProduct !== null) {
        return false;
      } else {
        return true;
      }
    },
    // Loading devreye girmesi için
    isLoading() {
      if (this.buttonClicked) {
        return {
          display: "block",
        };
      } else {
        return {
          display: "none",
        };
      }
    },
    // Ürünleri alfabetik sıralamak için
    sortedProduct() {
      function compare(a, b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      }

      return this.getProducts.sort(compare);
    },
  },
  methods: {
    productSelected() {
      this.product = this.$store.getters.getProduct(this.selectedProduct)[0];
      if (this.product_price == null) {
        this.product_price = this.product.price;
      }
    },
    // Ürün kaydetme
    save() {
      this.buttonClicked = true;
      let product = {
        key: this.selectedProduct,
        count: this.product_count,
        price: this.product_price,
      };
      this.$store.dispatch("sellProduct", product);
      this.$toastr.s("Products are saled");
    },
    // Ürün silme
    del() {
      if (confirm("Seçtiğiniz ürünü silmek istediğinize emin misiniz?")) {
        this.buttonClicked = true;
        let product = {
          key: this.selectedProduct,
        };
        this.$store.dispatch("deleteProduct", product);
        this.$toastr.s("Product is deleted");
      }
    },
  },
  // Yönlendirme öncesi kaydeddilmemiş veri varsa uyarı vermek için
  beforeRouteLeave(to, from, next) {
    if (
      (this.selectedProduct !== null || this.product_count > 0) &&
      !this.buttonClicked
    ) {
      if (confirm("There are unsaved changes. Do you still want to go out?")) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
};
</script>

<style scoped>
.border-danger {
  border-style: dashed !important;
}
/* Component aralarında geçişler için loading */
.loading {
  background-color: rgba(0, 0, 0, .6);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  top: calc(100% / 2);
  left: calc(100% / 2);
}

.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes lds-ripple {
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }

  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
}
</style>