<template>
  <div class="container">
    <div class="container">
      <span v-if="errorMsg" class="errorMsg">{{ errorMsg }}</span>
      <h1>Salesperson List</h1>
      <div>
          <tr>
              <th>
                <label>
                  <input type="checkbox" name="select_all" 
                    @input="selectAll()" />Select All
                </label> 
              </th>
              <th>Name</th>
              <th>Email</th>
          </tr>
          <tr v-for= "salesperson in salespeople"
              :key="salesperson._id">
              <td><input type="checkbox" name="selectees" :value="salesperson.email" 
                v-model="selectees" /></td>
              <td><router-link :to="{ name: 'StaffProfile', params: { salesperson } }">{{ salesperson.fname }} {{ salesperson.lname }}</router-link></td>
              <td>{{ salesperson.email }}</td>
          </tr>
      </div>
    </div>
    <div class="row filter-div">
     <button @click="sendMail()">Send Mail</button>
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'customerSelect',
  props: ['transaction', 'attachment'],
  data () {
    return {
      salespeople: [],
      selectees: [],
      filename: null,
      quote: null,
      errorMsg: null
    }
  },
  methods: {
    sendMail: function () {
      if (this.selectees.length > 0) {
        this.$router.push({ name: 'CreateMessage', params: { 'attachment': this.filename, 'targets': this.selectees } })
        // var payload = {'attachment': this.attachment, 'recipients': this.selectees}
        // let response = await AuthenticationService.emailQuote(payload)
        // if (response.status === 200) {
        //  this.$router.replace({ name: 'QuoteDisplay', params: { 'payload': this.quote } })
        // }
      } else {
        this.errorMsg = 'Please select recipients before trying to email your message!'
      }
    },
    getSalespeople: async function () {
      let response = await AuthenticationService.getSalespeople()
      this.salespeople = response.data
    },
    selectAll: function () {
      var inputs = document.getElementsByTagName('input')
      var isSelectAll = document.getElementsByName('select_all')[0].checked

      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() === 'checkbox' && inputs[i].name !== 'select_all') {
          inputs[i].checked = isSelectAll
          if (isSelectAll) {
            if (!this.selectees.includes(inputs[i].value) && inputs[i].value !== '') {
              this.selectees.push(inputs[i].value)
            }
          } else {
            var idx = this.selectees.indexOf(inputs[i].value)
            this.selectees.splice(idx, 1)
          }
        }
      }
    }
  },
  mounted () {
    this.getSalespeople()
    if (this.attachment) {
      this.filename = this.attachment
    }
    if (this.transaction) {
      this.quote = this.transaction
    }
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
    margin: 10 8px;
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

.errorMsg {
  font-weight: bold;
  color: #FF0000;
  font-size: 12px;
}
</style>
