<template>
  <div class="container p-3" style="margin-top:70px;">
    <h1 class="subtitle is-1 text-center">@toDo</h1>
    <div class="columns">
      <div class="column is-three-fifths is-offset-one-fifth">
        <div class="columns is-gapless">
          <div class="column is-four-fifths">
            <b-field class="pt-2">
              <b-input placeholder="Todo..." type="input" v-model="todoname"></b-input>
            </b-field>
          </div>
          <div class="column">
            <div class="pt-2">
              <button @click="addTodo()" class="button is-primary is-light is-fullwidth">Add</button>
            </div>
          </div>
        </div>

        <b-tabs v-model="activeTab">
          <b-tab-item label="All">
            <div v-for="(todo, index) in todos" :key="index">
              <div
                class="p-2 border mt-2 flex hover:shadow-lg items-center flex justify-between"
                v-show="todos[index].data.trashed == false"
              >
                <div>
                  <vs-checkbox
                    v-model="todos[index].data.completed"
                    @click="check(todos[index].ref.value.id, todos[index].data.completed == false ? true : false)"
                  >
                    <span
                      :class="todos[index].data.completed == true ? 'line-through' : '' "
                    >{{todos[index].data.name}}</span>
                  </vs-checkbox>
                </div>
                <div>
                  <i
                    class="fas fa-trash-alt cursor-pointer"
                    @click="trash(todos[index].ref.value.id, todos[index].data.trashed == false ? true : false, index)"
                  ></i>
                </div>
              </div>
            </div>
          </b-tab-item>

          <b-tab-item label="Completed">
            <div v-for="(todo, index) in todos" :key="index">
              <div
                class="p-2 border mt-2 flex hover:shadow-lg items-center flex justify-between"
                v-show="todos[index].data.completed == true && todos[index].data.trashed == false"
              >
                <div>
                  <vs-checkbox
                    v-model="todos[index].data.completed"
                    @click="check(todos[index].ref.value.id, todos[index].data.completed == false ? true : false)"
                  >
                    <span
                      :class="todos[index].data.completed == true ? 'line-through' : '' "
                    >{{todos[index].data.name}}</span>
                  </vs-checkbox>
                </div>
                <div>
                  <i
                    class="fas fa-trash-alt cursor-pointer"
                    @click="trash(todos[index].ref.value.id, todos[index].data.trashed == false ? true : false, index)"
                  ></i>
                </div>
              </div>
            </div>
          </b-tab-item>
          <b-tab-item label="Trashed">
            <div v-for="(todo, index) in todos" :key="index">
              <div
                class="p-2 border mt-2 flex hover:shadow-lg items-center flex justify-between"
                v-show="todos[index].data.trashed == true"
              >
                <div>
                  <span
                    :class="todos[index].data.completed == true ? 'line-through' : '' "
                  >{{todos[index].data.name}}</span>
                </div>
                <div>
                  <font-awesome-icon
                    class="cursor-pointer"
                    icon="trash-restore-alt"
                    @click="trash(todos[index].ref.value.id, todos[index].data.trashed == false ? true : false, index)"
                  />
                </div>
              </div>
            </div>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </div>
</template>
<script>
const faunadbt = require("faunadb");
const client = new faunadbt.Client({
  secret: process.env.VUE_APP_FAUNA_SECRET
});
const q = faunadbt.query;
var moment = require("moment");
export default {
  name: "Todo",
  data() {
    return {
      todoname: "",
      moment: moment,
      todo_data: [],
      activeTab: 0
    };
  },
  created() {
    this.gettodos();
  },
  computed: {
    todos() {
      return this.todo_data;
    },
    user_id() {
      return String(this.$store.state.user.id);
    }
  },
  methods: {
    gettodos() {
      var token = process.isClient ? localStorage.getItem("token") : false;
      if (token == null || token == false)
        this.$router.push({ path: "/login" });
      client.query(q.Get(q.Match(q.Index("user_token"), token))).then(res => {
        let data = res.data;
        this.$store.commit("setUser", data);
        this.$store.commit("setUserId", res.ref.value.id);
        client
          .query(
            q.Paginate(
              q.Match(q.Index("all_todo"), String(this.$store.state.id))
            )
          )
          .then(res => {
            var x = res.data;
            const data = x.map(ref => {
              return q.Get(ref);
            });
            client.query(data).then(res => {
              this.todo_data = res;
            });
          });
      });
    },
    addTodo() {
      if (this.todoname == null || this.todoname == "") {
        this.$buefy.snackbar.open({
          message: "ToDo name should not be empty!",
          type: "is-warning",
          position: "is-top",
          indefinite: false
        });
      } else {
        client
          .query(
            q.Create(q.Collection("todo"), {
              data: {
                // somet: this.todoName,
                name: this.todoname,
                completed: false,
                trashed: false,
                user_id: this.$store.state.id,
                date: "sdsdsdsd"
              }
            })
          )
          .then(res => {
            this.todoname = "";
            this.todo_data.push(res);
          });
      }
    },
    check(id, completed) {
      client
        .query(
          q.Update(q.Ref(q.Collection("todo"), id), {
            data: {
              completed: completed
            }
          })
        )
        .then(res => {});
    },
    trash(id, deleted, index) {
      this.todo_data[index].data.trashed = deleted;
      client
        .query(
          q.Update(q.Ref(q.Collection("todo"), id), {
            data: {
              trashed: deleted
            }
          })
        )
        .then(res => {});
    }
  }
};
</script>