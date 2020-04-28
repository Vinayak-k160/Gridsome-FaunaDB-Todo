<template>
  <div>
      <Navbar></Navbar>
      <Todo></Todo>
  </div>
</template>

<script>
import Todo from '@/components/Todo.vue'
import Navbar from '@/components/Navbar.vue'
const faunadb = require('faunadb')
const client = new faunadb.Client({secret: process.env.VUE_APP_FAUNA_SECRET})
const q = faunadb.query
export default {
  name: 'Home',
  components: {
    Todo,
    Navbar
  },
  created() {
    if(localStorage.getItem('token') == null || localStorage.getItem === undefined)
    {
      this.$router.push({path: '\login'})
    }
    else{
      client.query(q.Get(q.Match(q.Index('user_token'), localStorage.getItem('token'))))
      .then(res=> {
        let data = res.data
        data.id = res.ref.value.id
        this.$store.state.user = data
      })
      .catch(err=>{
        console.log(err.message)
        localStorage.removeItem('token')
        this.$router.push({path: '\login'})
      })
    }
  },
}
</script>
