<template>
  <div class="container">
    <div class="row filter-div">
      <label>Name:<input type="text" v-model="f_name" @input="filterName()" /></label>
      <label>Quote Type:
        <select @change="filterQuoteType($event)">
          <option value="all"></option>
          <option value="new sail">New Sail</option>
          <option value="sail repair">Sail Repair</option>
          <option value="winter service">Winter Service</option>
          <option value="sail cover">Sail Cover</option>
        </select>
     </label>
      <label>Quote Status:
        <select @change="filterQuoteStatus($event)">
          <option value="all"></option>
          <option value="pending">Pending</option>
          <option value="deposit">Deposit</option>
          <option value="production">In Production</option>
          <option value="ready">Ready</option>
          <option value="pickup">Pickup</option>
          <option value="delivery">Delivery</option>
          <option value="paid">Paid</option>
        </select>
     </label>
     <label>Alphanumerical
       <input type="radio" name="sorter" value="alpha"
         @change="sortList()"
         v-model="sort_type" />
     </label>
     <label>Date
       <input type="radio" name="sorter" value="temporal"
         @change="sortList()"
         v-model="sort_type" />
     </label>
     <button @click="createMessage()">Write Message</button>
    </div>
    <div class="container">
      <span v-if="errorMsg" class="errorMsg">{{ errorMsg }}</span>
      <h1>Select Customer(s) to Message</h1>
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
              <th>Boat Name</th>
              <th>Boat Home</th>
          </tr>
          <tr v-for= "customer in customer_display"
              :key="customer._id">
              <td><input type="checkbox" name="selectees" :value="customer.email" 
                v-model="selectees" />
              </td>
              <td><router-link :to="{ name: 'CustomerProfile', params: { customer } }">{{ customer.fname }} {{ customer.lname }}</router-link></td>
              <td>{{ customer.email }}</td>
              <td>{{ customer.boat_name }}</td>
              <td>{{ customer.boat_home }}</td>
          </tr>
      </div>
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'customerSelect',
  props: ['payload'],
  data () {
    return {
      customers: [],
      customer_display: [],
      sort_type: 'alpha',
      selectees: [],
      errorMsg: null,
      f_name: null,
      f_registry: {
        nameFilter: {
          filter: [],
          status: false
        },
        activeFilter: {
          filter: [],
          status: false
        },
        typeFilter: {
          filter: [],
          status: false
        },
        statusFilter: {
          filter: [],
          status: false
        }
      }
    }
  },
  methods: {
    createMessage: function () {
      if (this.selectees.length > 0) {
        this.$router.push({ name: 'CreateMessage', params: { 'targets': this.selectees, 'isBulk': true } })
      } else {
        this.errorMsg = 'Please select recipients before trying to email your message!'
      }
    },
    getCustomers: async function () {
      let response = await AuthenticationService.customerList()
      this.customers = response.data
      this.customer_display = response.data
      this.sortList()
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
    },
    temporalSort: function (a, b) {
      var aQuotes = a.quotes
      var bQuotes = b.quotes
      console.log(`First set of quotes have a lenght of ${aQuotes.length}`)
      console.log(`Second set of quotes have a lenght of ${bQuotes.length}`)
      if (aQuotes === undefined || aQuotes.length === 0) {
        return 1
      }
      if (bQuotes === undefined || bQuotes.length === 0) {
        return -1
      }

      var ftn = (a, b) => {
        return (a.createdAt > b.createdAt) ? -1 : (a.createdAt < b.createdAt) ? 1 : 0
      }

      var laq = aQuotes.sort(ftn)[0]
      var lbq = bQuotes.sort(ftn)[0]

      return (laq.createdAt > lbq.createdAt) ? -1 : (laq.createdAt < lbq.createdAt) ? 1 : 0
    },
    alphanumericSort: function (a, b) {
      return (a.lname < b.lname) ? -1 : (a.name > b.name) ? 1 : 0
    },
    sortList () {
      var ftn
      if (this.sort_type === 'alpha') {
        ftn = this.alphanumericSort
      } else {
        ftn = this.temporalSort
      }
      this.customer_display.sort(ftn)
    },
    filterName: function () {
      this.f_registry.nameFilter.filter = this.customers.filter((value) => { return (`${value.fname} ${value.lname}`).toLowerCase().indexOf(this.f_name.toLowerCase()) !== -1 })
      if (this.f_name !== '') {
        this.f_registry.nameFilter.status = true
      } else {
        this.f_registry.nameFilter.status = false
      }

      this.applyFilters()
    },
    filterActive: function (evt) {
      if (evt.target.checked) {
        console.log("I've been checked")
        this.f_registry.activeFilter.filter = this.customers.filter((value) => { return value.quotes.reduce((acc, val) => { return acc || val.isActive }, false) })
        this.f_registry.activeFilter.status = true
      } else {
        console.log("I've been UNchecked")
        this.f_registry.activeFilter.status = false
      }
      this.applyFilters()
    },
    filterQuoteType: function (evt) {
      if (evt.target.value !== 'all') {
        this.f_registry.typeFilter.filter = this.customers.filter((cus) => { return cus.quotes.reduce((acc, val) => { return acc || val.quote_type.indexOf(evt.target.value) !== -1 }, false) })
        this.f_registry.typeFilter.status = true
      } else {
        this.f_registry.typeFilter.status = false
      }
      this.applyFilters()
    },
    filterQuoteStatus: function (evt) {
      if (evt.target.value !== 'all') {
        this.f_registry.statusFilter.filter = this.customers.filter((cust) => { return cust.quotes.reduce((acc, val) => { return acc || val.status.indexOf(evt.target.value) !== -1 }, false) })
        this.f_registry.statusFilter.status = true
      } else {
        this.f_registry.statusFilter.status = false
      }
      this.applyFilters()
    },
    applyFilters: function () {
      var filterObj = {}
      var haveEmptyFilter = false
      var hasActiveFilters = false

      for (var key in this.f_registry) {
        var filterLength = this.f_registry[key].filter.length
        if (this.f_registry[key].status && filterLength > 0) {
          console.log(`${key} filter has a length of ${filterLength}`)
          filterObj[key] = this.f_registry[key].filter
          hasActiveFilters = true
        } else if (this.f_registry[key].status && filterLength === 0) {
          console.log(`${key} filter has a length of ${filterLength}`)
          haveEmptyFilter = true
          hasActiveFilters = true
        }
      }

      if (hasActiveFilters) {
        if (haveEmptyFilter) {
          this.customer_display = []
        } else {
          var result = Object
            .values(filterObj)
            .reduce((a, b) => b.filter(Set.prototype.has, new Set(a)))

          this.customer_display = result
        }
      } else {
        this.customer_display = this.customers
      }
    }
  },
  mounted () {
    this.getCustomers()
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

.errorMsg {
  font-weight: bold;
  color: #FF0000;
  font-size: 12px;
}
</style>
