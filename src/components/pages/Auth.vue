<template>
  <div class="container">
    <!-- ** LOADING ** -->
    <!-- <div class="loading" :style="isLoading">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div> -->
    <div class="row mt-5">
      <div
        class="col-md-4 offset-4 card card-primary p-3 border"
        :class="{ 'border-primary': isUser, 'border-success': !isUser }"
      >
        <h3
          :class="{ 'text-primary': isUser, 'text-success': !isUser }"
          class="text-center mb-3 mt-3"
        >
          Product Inventory
        </h3>
        <hr />
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label>E-Mail</label>
            <input
              v-model="email"
              @blur="$v.email.$touch()"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': $v.email.$error }"
              placeholder="Please enter your e-mail"
            />
            <small v-if="!$v.email.required" class="form-text text-danger"
              >This field is required</small
            >
            <small v-if="!$v.email.email" class="form-text text-danger"
              >Please enter a valid email</small
            >
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              v-model="password"
              @blur="$v.password.$touch()"
              type="password"
              class="form-control"
              :class="{ 'is-invalid': $v.password.$error }"
              placeholder="Please enter your password"
            />
            <small v-if="!$v.password.required" class="form-text text-danger"
              >This field is required</small
            >
            <small v-if="!$v.password.minLength" class="form-text text-danger"
              >Minimum {{ $v.password.$params.minLength.min }} characters</small
            >
          </div>
          <div class="form-group" v-if="!isUser">
            <label>Re-Password</label>
            <input
              v-model="repassword"
              @blur="$v.repassword.$touch()"
              type="password"
              class="form-control"
              :class="{ 'is-invalid': $v.repassword.$error }"
              placeholder="Please enter your password"
            />
            <small v-if="!$v.repassword.required" class="form-text text-danger"
              >This field is required</small
            >
            <small v-if="!$v.repassword.minLength" class="form-text text-danger"
              >Minimum
              {{ $v.repassword.$params.minLength.min }} characters</small
            >
            <small v-if="!$v.repassword.sameAs" class="form-text text-danger"
              >Passwords are not the same</small
            >
          </div>
          <div class="button-container d-flex flex-column align-items-center">
            <button
              type="submit"
              :class="{ 'btn-primary': isUser, 'btn-success': !isUser }"
              class="btn btn-block mb-2"
              :disabled="
                isUser
                  ? $v.email.$error || $v.password.$error
                  : $v.email.$error ||
                    $v.password.$error ||
                    $v.repassword.$error
              "
            >
              {{ isUser ? "Sign In" : "Sign Up" }}
            </button>
            <a
              href="#"
              @click.prevent="isUser = !isUser"
              class="text-secondary"
            >
              <!-- Giriş yap ile kayıt ol arası geçiş -->
              {{ isUser ? "I'm not a user" : "I'm already user" }}
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      email: null,
      password: null,
      repassword: null,
      buttonClicked: false,
      button: "",
      user: {
        email: null,
        password: null,
        repassword: null,
      },
      isUser: false,
    };
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(6),
    },
    repassword: {
      required,
      minLength: minLength(6),
      sameAs: sameAs("password"),
    },
  },
  methods: {
    onSubmit() {
      this.user.email = this.email;
      this.user.password = this.password;
      this.$store
        .dispatch("login", { ...this.user, isUser: this.isUser })
        .then((response) => {
          let expiresIn = (function ask() {
            let seconds = prompt(
              "Please enter the expiration time (in seconds): "
            );
            return isNaN(seconds) || +seconds < 1 ? ask() : seconds;
          })();
          this.$store.dispatch("setTimeoutTimer", expiresIn);
          this.$router.push("/product-list");
          this.$toastr.s("Welcome");
        })
        .catch((e) => {
          let error = e.body.error.message.toLowerCase().split("_").join(" ");
          let errorMsg = error.charAt(0).toUpperCase() + error.slice(1);

          if (this.isUser) {
            this.$toastr.e(errorMsg, "Sign-In Error");
          } else if (!this.isUser) {
            this.$toastr.e(errorMsg, "Sign-Up Error");
          }
        });
    },
  },
  computed: {
    //     isLoading() {
    //   if (this.buttonClicked) {
    //     return {
    //       display: "block",
    //     };
    //   } else {
    //     return {
    //       display: "none",
    //     };
    //   }
    // },
  },
};
</script>
