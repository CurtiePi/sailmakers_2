<template>
  <div class="container">
    <div class="container">
      <h1>Salesperson List</h1>
      <div>
          <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Get Mail</th>
          </tr>
          <tr v-for= "salesperson in salespeople"
              :key="salesperson._id">
              <td><router-link :to="{ name: 'StaffProfile', params: { 'payload': salesperson, 'caller': 'StaffList' } }">{{ salesperson.fname }} {{ salesperson.lname }}</router-link></td>
              <td><router-link :to="{ name: 'CreateMessage', params: { 'targets': [salesperson.email], 'caller': 'StaffList' } }">{{ salesperson.email }}</router-link></td>
              <td>{{ salesperson.phone }}</td>
              <td>{{ (salesperson.get_mail) ? 'Y' : 'N' }}</td>
          </tr>
      </div>
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'StaffList',
  data () {
    return {
      salespeople: []
    }
  },
  methods: {
    getSalespeople: async function () {
      let response = await AuthenticationService.getSalespeople()
      this.salespeople = response.data
      console.log(this.salespeople)
      this.sortList()
    },
    alphanumericSort: function (a, b) {
      return (a.lname < b.lname) ? -1 : (a.name > b.name) ? 1 : 0
    },
    sortList () {
      var ftn = this.alphanumericSort
      this.salespeople.sort(ftn)
    }
  },
  mounted () {
    this.getSalespeople()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

.filter-div > * {
    margin: 0 8px;
    vertical-align: middle;
}

td, th {
  padding: 5px;
}

tr:nth-child(even) {
    background-color: #eeeeee;
}

tr:nth-child(odd) {
    background-color: #cccccc;
}
</style>
