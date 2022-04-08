<template>
  <div class="container">
    <h1>{{ msg }}</h1>
    <div v-if="hasToken">
        <span :sp="salesperson">Welcome {{ salesperson.fname }} </span>
     </div>
    <div v-else>
    <form>
        <label for="credentials" class="form-label">Enter Password
            <input name="credentials"
                 id="credentials"
                 type="password"
                 placeholder="Enter password"
                 v-model.trim="credential" />
        </label>
        <button type="button" class="btn btn-primary"
            @click="login()">Login</button>
    </form>
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'homeComponent',
  data () {
    return {
      hasToken: false,
      credential: '',
      msg: 'Sailmakers',
      salesperson: null
    }
  },
  computed: {
    ...mapGetters("auth", {
      getLoginApiStatus: "getLoginApiStatus"
    })
  },
  methods: {
    ...mapActions('auth', {
      userLogin: "userLogin"
    }),

    async getSalespersonByName (name) {
      console.log(`Getting ${name}`)
      let response = await AuthenticationService.salespersonByName(name)
      console.log(response.data)
      this.salesperson = response.data[0]
      localStorage.sp = JSON.stringify(this.salesperson)
    },

    async login () {
      let payload = {
        username: 'captainDave',
        password: this.credential
      }

      console.log(payload)
      await this.userLogin(payload)
      if (this.getLoginApiStatus) {
        this.$router.push("/customers")
      }
      else {
        this.$router.push("/")
      }
    }
  },
  created () {
    console.log('Get a salesperson')
    this.getSalespersonByName('David Martin')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home {
    background-color: rgba(0, 176, 234, 0.5);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
