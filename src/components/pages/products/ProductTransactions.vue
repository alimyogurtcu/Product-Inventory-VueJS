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
          <h3>Products Transactions</h3>
          <hr />
          <div class="form-group">
            <select
              class="form-control"
              v-model="selectedProduct"
              @change="productSelected"
            >
              <option value="newProduct">New Product</option>
              <option v-for="product in sortedProduct" :value="product.key">
                {{ product.title }}
              </option>
            </select>
            <hr />
          </div>
          <div v-if="selected === true">
            <label>Product Title</label>
            <input
              v-model="product.title"
              @blur="$v.product.title.$touch()"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.product.title.$error }"
              placeholder="Enter product title"
            />
            <br />
            <div class="form-group">
              <label>Product Quantity</label>
              <input
                v-model="product.count"
                @blur="$v.product.count.$touch()"
                :min="0"
                type="number"
                class="form-control"
                :class="{ 'is-invalid': $v.product.count.$error }"
                placeholder="Enter product quantity"
              />
            </div>
            <div class="form-group">
              <label>Product Pcs Price</label>
              <input
                v-model="product.price"
                @blur="$v.product.price.$touch()"
                :min="0"
                type="number"
                class="form-control"
                :class="{ 'is-invalid': $v.product.price.$error }"
                placeholder="Enter product pcs price"
              />
            </div>
            <div class="form-group">
              <label>Product Description</label>
              <textarea
                v-model="product.description"
                @blur="$v.product.description.$touch()"
                cols="30"
                rows="5"
                placeholder="Enter product description"
                class="form-control"
                :class="{ 'is-invalid': $v.product.description.$error }"
              ></textarea>
            </div>
            <hr />
            <button
              class="btn btn-primary"
              :disabled="saveEnabled"
              @click="saveProduct"
            >
              Save
            </button>
          </div>
          <div v-if="selected === false">
            <label>Product Title</label>
            <input
              v-model="tempTitle"
              @blur="$v.tempTitle.$touch()"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.tempTitle.$error }"
              placeholder="Enter updated title"
            />
            <br />
            <div class="form-group">
              <label>Product Quantity</label>
              <input
                v-model="tempUpdateProduct.count"
                @blur="$v.tempUpdateProduct.count.$touch()"
                :min="0"
                type="number"
                class="form-control"
                :class="{ 'is-invalid': $v.tempUpdateProduct.count.$error }"
                placeholder="Enter updated quantity"
              />
            </div>
            <div class="form-group">
              <label>Product Pcs Price</label>
              <input
                v-model="tempUpdateProduct.price"
                @blur="$v.tempUpdateProduct.price.$touch()"
                :min="0"
                type="number"
                class="form-control"
                :class="{ 'is-invalid': $v.tempUpdateProduct.price.$error }"
                placeholder="Enter updated pcs price"
              />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea
                v-model="tempUpdateProduct.description"
                @blur="$v.tempUpdateProduct.description.$touch()"
                cols="30"
                rows="5"
                placeholder="Enter updated description"
                class="form-control"
                :class="{
                  'is-invalid': $v.tempUpdateProduct.description.$error,
                }"
              ></textarea>
            </div>
            <hr />
            <button
              class="btn btn-primary"
              :disabled="
                $v.tempTitle.$error ||
                $v.tempUpdateProduct.count.$error ||
                $v.tempUpdateProduct.price.$error ||
                $v.tempUpdateProduct.description.$error
              "
              @click="updateProduct"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import {
  required,
  numeric,
} from "vuelidate/lib/validators";

export default {
  data() {
    return {
      selectedProduct: "newProduct",
      selected: true,
      tempTitle: null,
      tempCount: null,
      tempPrice: null,
      tempDescription: null,
      tempTotalValue: null,
      temp: {
        title: "",
        count: "",
        price: "",
        description: "",
        totalValue: "",
      },
      product: {
        title: "",
        count: "",
        price: "",
        description: "",
        totalValue: "",
      },
      tempUpdateProduct: {
        title: "",
        count: "",
        price: "",
        description: "",
        totalValue: "",
      },
      buttonClicked: false,
    };
  },
  validations: {
    product: {
      title: {
        required,
      },
      price: {
        required,
        numeric,
      },
      count: {
        required,
        numeric,
      },
      description: {
        required,
      },
    },
    tempTitle: {
      required,
    },
    tempUpdateProduct: {
      title: {
        required,
      },
      price: {
        required,
        numeric,
      },
      count: {
        required,
        numeric,
      },
      description: {
        required,
      },
    },
  },
  methods: {
    // Seçilen ürün
    productSelected() {
      // eğer newProduct value'su yani option[0] seçili ise
      if (this.selectedProduct == "newProduct") {
        this.product.title = "";
        this.product.count = "";
        this.product.price = "";
        this.product.description = "";
        this.product.totalValue = "";
        this.selected = true;
      } else {
        // değilse getters aracılığıyla ürün bilgilerini alma
        this.selected = false;
        this.tempUpdateProduct = this.$store.getters.getProduct(
          this.selectedProduct
        )[0];
        this.tempTitle = this.$store.getters.getProduct(
          this.selectedProduct
        )[0].title;
        this.tempCount = this.$store.getters.getProduct(
          this.selectedProduct
        )[0].count;
        this.tempPrice = this.$store.getters.getProduct(
          this.selectedProduct
        )[0].price;
        this.tempDescription = this.$store.getters.getProduct(
          this.selectedProduct
        )[0].description;
        this.tempTotalValue = this.$store.getters.getProduct(
          this.selectedProduct
        )[0].totalValue;
      }
    },
    // Ürün bilgilerini kaydetme
    saveProduct() {
      let check = true;
      this.buttonClicked = true;
      this.sortedProduct.forEach((element) => {
        if (this.product.title == element.title) {
          alert(element.title + " already added!");
          this.buttonClicked = false;
          check = false;
          return false;
        }
      });
      if (check == true) {
        this.product.totalValue = this.product.price * this.product.count;
        this.$toastr.s(this.product.title, "Product added");
        this.$store.dispatch("saveProduct", this.product);
      }
    },
    // Ürün bilgilerini güncelleme
    updateProduct() {
      this.buttonClicked = true;
      let check = true;
      this.sortedProduct.forEach((element) => {
        if (this.tempTitle == element.title) {
          let alert = confirm(
            element.title + " this title already added! Are you sure update?"
          );
          if (alert) {
            this.tempUpdateProduct.totalValue =
              this.tempUpdateProduct.price * this.tempUpdateProduct.count;
            this.tempUpdateProduct.title = this.tempTitle;
            this.$toastr.s(this.tempUpdateProduct.title, "Product updated");
            this.$store.dispatch("updateProduct", this.tempUpdateProduct);
            check = false;
            return false;
          } else if (!alert) {
            check = false;
            this.buttonClicked = false;
            return false;
          }
        }
      });
      if (check == true) {
        this.buttonClicked = true;
        this.tempUpdateProduct.totalValue =
          this.tempUpdateProduct.price * this.tempUpdateProduct.count;
        this.tempUpdateProduct.title = this.tempTitle;
        this.$toastr.s(this.tempUpdateProduct.title, "Product updated");
        this.$store.dispatch("updateProduct", this.tempUpdateProduct);
      }
    },
  },
  computed: {
    ...mapGetters(["getProducts"]),
    sortedProduct() {
      function compare(a, b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      }
      return this.getProducts.sort(compare);
    },
    // Save butonunun gerekli şartlar sağlandığı takdirde aktifleşmesi için // vuelidate alternetifi
    saveEnabled() {
      if (
        this.product.title.length > 0 &&
        this.product.price.length > 0 &&
        this.product.count.length > 0 &&
        this.product.description.length > 0 &&
        this.product.count > 0 &&
        this.product.price > 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    // Update butonunun gerekli şartlar sağlandığı takdirde aktifleşmesi için // vuelidate alternatifi
    // updateEnabled() {
    //   if (
    //     this.tempUpdateProduct.title.length > 0 &&
    //     this.tempUpdateProduct.price.length > 0 &&
    //     this.tempUpdateProduct.count.length > 0 &&
    //     this.tempUpdateProduct.description &&
    //     this.tempUpdateProduct.count > 0 &&
    //     this.tempUpdateProduct.price > 0
    //   ) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // },
    // ** LOADING **
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
  },
  // Yönlendirme öncesi kaydedilmemiş veri varsa uyarı vermek için
  beforeRouteLeave(to, from, next) {
    if (
      ((this.product.title.length > 0 ||
        this.product.price.length > 0 ||
        this.product.count.length > 0 ||
        this.product.description.length > 0) &&
        !this.buttonClicked) ||
      ((this.tempUpdateProduct.title.length > 0 ||
        this.tempUpdateProduct.price.length > 0 ||
        this.tempUpdateProduct.count.length > 0 ||
        this.tempUpdateProduct.description.length > 0) &&
        !this.buttonClicked)
    ) {
      if (confirm("There are unsaved changes. Do you still want to go out?")) {
        console.log(this.tempUpdateProduct);
        console.log(this.temp);
        this.tempUpdateProduct.count = this.tempCount;
        this.tempUpdateProduct.price = this.tempPrice;
        this.tempUpdateProduct.description = this.tempDescription;
        this.tempUpdateProduct.totalValue = this.tempTotalValue;

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