<template>
  <div class="w-full flex flex-wrap">
    <!-- Register Section -->
    <div class="w-full md:w-1/2 flex flex-col">
      <div class="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-12">
        <a href="#" class="bg-black text-white font-bold text-xl p-4">@toDo</a>
      </div>

      <div
        class="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32"
      >
        <p class="text-center text-3xl">Join Us.</p>
        <form class="flex flex-col pt-3 md:pt-8" onsubmit="event.preventDefault();">
          <div class="flex flex-col pt-4">
            <label for="name" class="text-lg">Name</label>
            <input
              v-model="user.name"
              type="text"
              id="name"
              placeholder="John Smith"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div class="flex flex-col pt-4">
            <label for="email" class="text-lg">Email</label>
            <input
              v-model="user.email"
              type="email"
              id="email"
              placeholder="your@email.com"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div class="flex flex-col pt-4">
            <label for="password" class="text-lg">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="Password"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div class="flex flex-col pt-4 mb-4">
            <label for="confirm-password" class="text-lg">Confirm Password</label>
            <input
              v-model="confirm_password"
              type="password"
              id="confirm-password"
              placeholder="Password"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <vs-button
            dark
            square
            flat
            size="large"
            style="width: 100%; margin: 0px;"
            color="#000"
            :disabled="isLoading"
            :active="active == 0"
            @click="register()"
            ref="button"
          >
            <b>Register</b>
          </vs-button>
        </form>
        <div class="text-center pt-12 pb-12">
          <p>
            Already have an account?
            <g-link to="/login" class="underline font-semibold">Log in here</g-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Image Section -->
    <div class="w-1/2 shadow-2xl">
      <g-image
        class="object-cover w-full h-screen hidden md:block"
        src="../assets/img/photo-1555679427-1f6dfcce943b.jpg"
      />
    </div>
  </div>
</template>
<script>
const faunadb = require("faunadb");
const client = new faunadb.Client({ secret: process.env.VUE_APP_FAUNA_SECRET });
const q = faunadb.query;
export default {
  data() {
    return {
      user: {
        name: "",
        email: ""
      },
      password: "",
      confirm_password: "",
      isLoading: false,
      active: 0,
      loading: ""
    };
  },
  methods: {
    register() {
      this.startLoading();
      if( this.user.name == null || this.user.name == ''){
        this.closeLoding();
        this.$buefy.snackbar.open({
              message: "Name is required",
              type: "is-warning",
              position: "is-top",
              indefinite: false
            });
            return;
      }
      if( this.user.email == null || this.user.email == ''){
        this.closeLoding();
        this.$buefy.snackbar.open({
              message: "Email is required",
              type: "is-warning",
              position: "is-top",
              indefinite: false
            });
      return;
      }
      if( this.password == null || this.password == ''){
        this.closeLoding();
        this.$buefy.snackbar.open({
              message: "Password is required",
              type: "is-warning",
              position: "is-top",
              indefinite: false
            });
      return;
      }
      if( this.confirm_password == null || this.confirm_password == ''){
        this.closeLoding();
        this.$buefy.snackbar.open({
              message: "Confirm password is required",
              type: "is-warning",
              position: "is-top",
              indefinite: false
            });
      return;
      }
      if (this.password != this.confirm_password){
        this.closeLoding();
         this.$buefy.snackbar.open({
              message: "Passwords do not match",
              type: "is-warning",
              position: "is-top",
              indefinite: false
            });
        this.closeLoding();
      } 
      else{
        client
        .query(
          q.Create(q.Collection("users"), {
            credentials: { password: this.password },
            data: { name: this.user.name, email: this.user.email }
          })
        )
        .then(res => {
          this.closeLoding();
          this.$router.push({ path: "/login" });
        })
        .catch(err =>{
          this.closeLoding();
        })
      }
    },
    startLoading() {
      this.isLoading = true;
      this.loading = this.$vs.loading({
        target: this.$refs.button,
        scale: "0.6",
        background: "#000",
        opacity: 1,
        color: "#fff"
      });
    },
    closeLoding() {
      this.isLoading = false;
      this.loading.close();
    }
  },
};
</script>