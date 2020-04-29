<template>
  <div class="w-full flex flex-wrap">
    <!-- Login Section -->
    <div class="w-full md:w-1/2 flex flex-col">
      <div class="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24">
        <a href="#" class="bg-black text-white font-bold text-xl p-4">@toDo</a>
      </div>

      <div
        class="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32"
      >
        <p class="text-center text-3xl">Welcome.</p>
        <form class="flex flex-col pt-3 md:pt-8" onsubmit="event.preventDefault();">
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
              v-model="user.password"
              type="password"
              id="password"
              placeholder="Password"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <input
            @click="login()"
            type="submit"
            value="Log In"
            class="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8"
          />
        </form>
        <div class="text-center pt-12 pb-12">
          <p>
            Don't have an account?
            <g-link to="/register" class="underline font-semibold">Register here</g-link>
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
        email: "",
        password: ""
      },
      token: ""
    };
  },
  methods: {
    login() {
      client
        .query(
          q.Login(q.Match(q.Index("user_by_email"), this.user.email), {
            password: this.user.password
          })
        )
        .then(res => {
          this.token = res.secret;
          if (this.token != null) {
            localStorage.setItem("token", this.token);
            client
              .query(
                q.Update(q.Ref(q.Collection("users"), res.instance.value.id), {
                  data: {
                    token: this.token
                  }
                })
              )
              .then(res => {
                let data = res.data;
                this.$store.commit("setUser", data);
                this.$store.commit("setUserId", res.ref.value.id);
                this.$router.push({ path: "/" });
              });
          }
        });
    }
  }
};
</script>