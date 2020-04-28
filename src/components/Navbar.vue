<template>
     <div class="mb-8 pb-6 p-2 flex justify-between items-center">
        <div>
          <strong class="">{{ user.email }}</strong>
        </div>
        <div>
          <a class=" button is-primary" @click="logout()">
                        <strong>Logout</strong>
                    </a>

        </div>
      </div>
</template>
<script>
const faunadb = require('faunadb')
const client = new faunadb.Client({secret: process.env.VUE_APP_FAUNA_SECRET})
const q = faunadb.query
export default {
    name: 'Navbar',
    computed: {
        user(){
            return this.$store.state.user
        }
    },
    methods: {
        logout(){
            client.query(q.Logout(true))
            .then(res=>{
                client.query(
                    q.Update(
                        q.Ref(q.Collection('users'),  this.$store.state.user.id),
                        {
                            data: {
                                token: null
                            }
                        }
                    )
                )
                .then(res =>{
                localStorage.removeItem('token')
                this.$router.push({path: '/login'})
                })
            })
        }
    },
}
</script>