<template>
  <div class="container">
    <!-- ** LOADING ** -->
    <div class="loading" :style="isLoading">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-md-6 offset-3">
        <div class="card">
          <div v-if="!enableUpdate">
            <strong>Email</strong>
            <p class="title">{{ email }}</p>
            <strong
              >Password
              <input
                type="checkbox"
                v-model="checkPassword"
                style="margin: 6px; position: absolute"
            /></strong>
            <p v-if="checkPassword">{{ password }}</p>
            <br />
            <p>
              <button class="btn btn-info m-2" @click="enableUpdateCard">
                Update</button
              ><button class="btn btn-danger m-2" @click="deleteUser">
                Delete User
              </button>
            </p>
          </div>
          <div v-if="enableUpdate">
            <strong>New Email</strong>
            <br />
            <input type="emal" v-model="update.email" />
            <br />
            <strong>New Password </strong>
            <br />
            <input :type="typeNewPassword" v-model="update.password" />
            <input
              type="checkbox"
              v-model="checkUpdatePassword"
              style="margin: 10px; position: absolute"
            />
            <br />
            <br />
            <p>
              <button class="btn btn-success m-2" @click="updateUser">
                Update
              </button>
              <button class="btn btn-info m-2" @click="enableUpdateCard">
                Back
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      buttonClicked: false,
      enableUpdate: false,
      checkPassword: false,
      checkUpdatePassword: false,
      update: {
        password: "",
        email: "",
      },
      email: localStorage.getItem("email"),
      password: localStorage.getItem("password"),
    };
  },
  methods: {
    enableUpdateCard() {
      if (this.enableUpdate == false) return (this.enableUpdate = true);
      else this.enableUpdate = false;
    },
    updateUser() {
      this.buttonClicked = true;
      if (this.update.password.length > 0 && this.update.email.length > 0) {
        if (confirm("Are you sure you want to update user?")) {
          this.$store.dispatch("userUpdate", this.update);
          this.email = this.update.email;
          this.password = this.update.password;

          setTimeout(() => {
            this.buttonClicked = false;
          }, 5000);
          this.$toastr.w("User updated");
          this.update.password = "";
          this.update.email = "";
          this.checkPassword = false;
          this.checkUpdatePassword = false;
        } else {
          this.update.email = "";
          this.update.password = "";
        }
        return (this.enableUpdate = false);
      } else {
        // doNothing
      }
    },
    deleteUser() {
      if (
        confirm(
          "It will be deleted on all your products. Are you sure you want to delete user?"
        )
      ) {
        this.buttonClicked = true;
        this.$store.dispatch("deleteAll");
        this.$store.dispatch("userDelete");
        this.$store.dispatch("logout");
        setTimeout(() => {
          this.buttonClicked = false;
        }, 5000);
        this.$toastr.w("We will miss you", "User deleted");
      } else {
        this.update.email = "";
        this.update.password = "";
      }
      return (this.enableUpdate = false);
    },
  },
  computed: {
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
    // Şifre güncellemede input içini görünür/gizli yapma
    typeNewPassword() {
      if (this.checkUpdatePassword) return "text";
      else return "password";
    },
  },
};
</script>
<style scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 300px;
  margin: auto;
  text-align: center;
}

.title {
  color: grey;
  font-size: 18px;
}
</style>
