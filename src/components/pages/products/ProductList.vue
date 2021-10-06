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
      <div class="col-12 mb-5 card mt-5 shadow">
        <div class="card-body">
          <h3>
            Product List
            <button class="btn btn-danger float-right" @click="deleteAll">
              Delete All Products
            </button>
            <button class="btn btn-info float-right mx-2" @click="resetSale">
              Reset Sales Balance
            </button>
          </h3>
          <br />
          <div class="search-wrapper panel-heading">
            <input
              class="form-control"
              type="text"
              v-model="search"
              placeholder="Search Title"
            />
          </div>
          <hr />
          <table
            class="table table-hover table-striped table-bordered"
            v-if="getProducts.length > 0"
          >
            <thead>
              <tr>
                <th class="align-middle text-center">ID</th>
                <th class="align-middle text-center">Title</th>
                <th class="align-middle text-center" style="width:40%">Description</th>
                <th class="align-middle text-center">Units</th>
                <th class="align-middle text-center">Pcs Price</th>
                <th class="align-middle text-center">Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in resultQuery" v-if="search.length > 0">
                <td class="align-middle text-center" style="width: 30px">
                  <span class="badge badge-info"> {{ item.key }} </span>
                </td>
                <td class="align-middle text-center" style="width: 300px">
                  {{ item.title }}
                </td>
                <td class="align-middle productListElementOverflow">
                  {{ item.description }}
                </td>
                <td
                  class="align-middle text-center"
                  style="width: 80px"
                  :class="getCountClasses(item.count)"
                >
                  {{ item.count }}
                </td>
                <td class="align-middle" style="width: 120px">
                  {{ item.price | currency }}
                </td>
                <td class="align-middle" style="width: 150px">
                  {{ item.totalValue | currency }}
                </td>
              </tr>

              <tr v-for="product in sortedProduct" v-if="search.length < 1">
                <td class="align-middle text-center" style="width: 30px">
                  <span class="badge badge-info"> {{ product.key }} </span>
                </td>
                <td class="align-middle text-center" style="width: 100px">
                  {{ product.title }}
                </td>
                <td class="align-middle productListElementOverflow">
                  {{ product.description }}
                </td>
                <td
                  class="align-middle text-center"
                  style="width: 80px"
                  :class="getCountClasses(product.count)"
                >
                  {{ product.count }}
                </td>
                <td class="align-middle" style="width: 120px">
                  {{ product.price | currency }}
                </td>
                <td class="align-middle" style="width: 150px">
                  {{ product.totalValue | currency }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="alert alert-warning" v-else-if="getProducts.length <= 0">
            <strong>We Haven't Found Any Products Here Yet</strong>
            <br />
            <small
              >You can use the
              <router-link to="/urun-islemleri" tag="a" exact>
                <a>Product Transactions</a>
              </router-link>
              menu to add a product.
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      search: "",
      products: "",
      buttonClicked: false,
    };
  },
  computed: {
    ...mapGetters(["getProducts"]),
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
    // arama sonuçlarını sıraya koymak için
    resultQuery() {
      if (this.search) {
        return this.getProducts.filter((item) => {
          return this.search
            .toLowerCase()
            .split(" ")
            .every((v) => item.title.toLowerCase().includes(v));
        });
      } else {
        return this.getProducts;
      }
    },
    // alfabetik sıralamak için
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
    getCountClasses(count) {
      return {
        "btn-danger text-white": count == 0 || count == null || count == "",
        "btn-success text-white": count > 0,
      };
    },
    // Tüm ürünler silinsin diye
    deleteAll() {
      let alert = confirm("All products are deleting. Are you sure?");
      if (alert) {
        this.buttonClicked = true;
        this.$store.dispatch("deleteAll");
        this.$store.dispatch("deleteApp");
        this.$toastr.s("All products deleted");
      }
    },
    // Footerdaki total sale', sıfırlamak için
    resetSale() {
      let alert = confirm("Sales result is reseting. Are you sure?");
      if (alert) {
        this.buttonClicked = true;
        this.$store.dispatch("resetSales");
        this.$toastr.s("Sales reseted");
      }
    },
  },
};
</script>

<style scoped>
/* Ürün listesinde her bir element için  */
.productListElementOverflow {
  display: block;
  table-layout: fixed;
  overflow-y: scroll;
  height: 80px;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

button:hover {
  opacity: 0.7;
}

/* TABLE */

table {
  display: block;
  table-layout: fixed;
  max-height: 500px;
  overflow-y: scroll;
  position: relative;
  border-collapse: collapse; 
}

thead {
  height: 50px;
}

th {
  background-color: white;
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
}
/* Component aralarında geçişler için loading */
.loading {
  background-color: rgba(0, 0, 0, 0.6);
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