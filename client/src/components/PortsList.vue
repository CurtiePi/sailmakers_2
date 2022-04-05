<template>
  <div class="container">
    <div>
      <p>PUT FILTER HERE</p>
    </div>
    <div class="container">
      <h1>Ports List</h1>
      <div>
          <tr>
              <th>Name</th>
              <th>Abbreviation</th>
          </tr>
          <tr v-for= "port in ports"
              :key="port._id">
              <td>{{ port.name }}</td>
              <td>{{ port.abbrev }}</td>
          </tr>
      </div>
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'portsList',
  data () {
    return {
      ports: []
    }
  },
  methods: {
    getPorts: async function () {
      let response = await AuthenticationService.portList()
      this.ports = response.data
    }
  },
  mounted () {
    this.getPorts()
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
