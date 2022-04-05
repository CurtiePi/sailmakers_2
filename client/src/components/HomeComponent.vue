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
  methods: {
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
      let response = await AuthenticationService.login(payload)
      console.log(response)
    }
  },
  created () {
    console.log('Get a salesperson')
    this.getSalespersonByName('David Martin')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
</style>
