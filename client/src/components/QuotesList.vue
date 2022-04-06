<template>
  <div class="container-xl">
    <p>
        <button class="btn btn-primary m-5" data-bs-toggle="collapse" href="#requestFilter" role="button" aria-expanded="false" aria-controls="requestFilter">Request Filter</button>
        <button class="btn btn-primary m-5" type="button" data-bs-toggle="collapse" data-bs-target="#statusFilter" aria-expanded="false" aria-controls="statusFilter">Status Filter</button>
        <button class="btn btn-primary m-5" type="button" data-bs-toggle="collapse" data-bs-target="#deliveryFilter" aria-expanded="false" aria-controls="deliveryFilter">Delivery Filter</button>
    </p>
    <div class="row">
        <div class="col">
            <div class="collapse multi-collapse" id="requestFilter">
                <select class="form-select" multiple aria-label="multiple select example" @change="filterRequestType()" v-model="f_registry.requestFilter.request_list">
                    <option value="new sail">New Sail</option>
                    <option value="sail repair">Sail Repair</option>
                    <option value="winter service">Winter Service</option>
                    <option value="sail cover">Sail Cover</option>
                    <option value="other">Other</option>
                </select>
            </div>
        </div>
        <div class="col">
            <div class="collapse multi-collapse" id="statusFilter">
                <select class="form-select" multiple aria-label="multiple select example" @change="filterStatusType()" v-model="f_registry.statusFilter.status_list">
                    <option value="quote request">Quote Request</option>
                    <option value="pending">Pending</option>
                    <option value="production">In Production</option>
                    <option value="ready">Ready</option>
                    <option value="follow up">Follow Up</option>
                    <option value="delivered">Delivered</option>
                    <option value="no sale">No Sale</option>
                </select>
            </div>
        </div>
        <div class="col">
            <div class="collapse multi-collapse" id="deliveryFilter">
                <select class="form-select" multiple aria-label="multiple select example" @change="updateColumnView()" v-model="col_view">
                    <option value="PICK">Pick-up</option>
                    <option value="CLUB">Customer Club</option>
                    <option value="PORT">Boat Port</option>
                </select>
            </div>
        </div>
    </div>
    <!-- div class="row filter-div">
      <span>
        <div v-if="col_view[0] === 'PICK'">
          Pick Up Filter 
          <span>
            <v-select class="pickdropselect" :options="pickDropOptions" v-model="pickDropSelection" @input="filterPickDrop"/>
          </span>
        </div>
        <div v-if="col_view[0] === 'CLUB'">
          Customer Club Filter 
          <span>
            <v-select class="pickdropselect" :options="custClubOptions" v-model="custClubSelection" @input="filterCustClub"/>
          </span>
        </div>
        <div v-if="col_view[0] === 'PORT'">
          Boat Port Filter 
          <span>
            <v-select class="pickdropselect" :options="boatPortOptions" v-model="boatPortSelection" @input="filterBoatPort"/>
          </span>
        </div>
      </span>
      <span class="col_view_controller">
        <label>
          <input type="radio" name="c_control" value="PICK" 
            @change="updateColumnView()"
            v-model="col_view[0]" />
            Pick-Up 
        </label>
        <label>
          <input type="radio" name="c_control" value="CLUB"
            @change="updateColumnView()"
            v-model="col_view[0]" />
            Customer Club
        </label>
        <label>
          <input type="radio" name="c_control" value="PORT" 
            @change="updateColumnView()"
            v-model="col_view[0]" />
            Boat Port
        </label>
      </span>
    </div -->
    <div>
      <h1>Requests List</h1>
      <table>
        <tr>
          <th>Customer</th>
          <th>Request Type</th>
          <th>Phone</th>
          <th>Status</th>
          <th v-if="col_view[0] === 'PICK'">Pick Up</th>
          <th v-else-if="col_view[0] === 'CLUB'">Customer Club</th>
          <th v-else-if="col_view[0] === 'PORT'">Boat Port</th>
          <th>Created Date</th>
          <th></th>
        </tr>
        <tr v-for= "quote in quotes_display"
          :class="quote.status.replace(' ', '_')"
          :key="quote._id">
          <td>
            <router-link :to="{ name: 'CustomerProfile', params: { 'payload': quote.customer, 'caller': 'Quotes' } }">
              {{ quote.customer.fname }} {{ quote.customer.lname }}
            </router-link>
          </td>
          <td>{{ quote.quote_type.join(', ') }}</td>
          <td class='phone'>{{ quote.customer.phone }}</td>
          <td>{{ quote.status }}</td>
          <td v-if="col_view[0] === 'PICK'">{{ quote.pick_drop }}</td>
          <td v-else-if="col_view[0] === 'CLUB'">{{ quote.customer.club }}</td>
          <td v-else-if="col_view[0] === 'PORT'">{{ quote.boat_home }}</td>
          <td>{{ formatDate(quote.createdAt) }}</td>
          <td>
            <button @click="viewQuote(quote)">View</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'quoteList',
  data () {
    return {
      quotes: [],
      quotes_display: [],
      pickDropOptions: [],
      boatPortOptions: [],
      custClubOptions: [],
      status_view: 'active',
      pickDropSelection: null,
      custClubSelection: null,
      boatPortSelection: null,
      col_view: ['PICK'],
      f_registry: {
        activeFilter: {
          filter: [],
          status: false
        },
        requestFilter: {
          request_list: [],
          filter: [],
          status: false
        },
        pickDropFilter: {
          filter: [],
          status: false
        },
        boatPortFilter: {
          filter: [],
          status: false
        },
        custClubFilter: {
          filter: [],
          status: false
        },
        statusFilter: {
          status_list: ['quote request', 'pending', 'production', 'ready'],
          filter: [],
          status: false
        }
      }
    }
  },
  methods: {
    formatDate (dateString) {
      let result = ''
      if (dateString) {
        let dte = new Date(dateString)
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(dte)
        let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(dte)
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(dte)
        result = `${mo}-${da}-${ye}`
      }
      return result
    },
    async getQuotes () {
      let response = await AuthenticationService.quoteList()
      this.quotes = response.data
      this.quotes_display = response.data
      this.sortList()
      this.filterStatusType()
      this.populateDropDown()
    },
    viewQuote (quoteObj) {
      this.$router.replace({ name: 'QuoteDisplay', params: { 'payload': quoteObj, 'caller': 'Quotes' } })
    },
    temporalSort (a, b) {
      return (a.createdAt < b.createdAt) ? 1 : (a.createdAt > b.createdAt) ? -1 : 0
    },
    sortList () {
      const ftn = this.temporalSort
      this.quotes_display.sort(ftn)
    },
    populateDropDown () {
      for (var idx = 0; idx < this.quotes.length; idx++) {
        var quote = this.quotes[idx]
        if (this.f_registry.statusFilter.status_list.includes(quote.status) && !(this.pickDropOptions.includes(quote.pick_drop) || quote.pick_drop === '')) {
          this.pickDropOptions.push(quote.pick_drop)
        }
        if (this.f_registry.statusFilter.status_list.includes(quote.status) && !(this.custClubOptions.includes(quote.customer.club) || quote.customer.club === '')) {
          this.custClubOptions.push(quote.customer.club)
        }
        if (this.f_registry.statusFilter.status_list.includes(quote.status) && !(this.boatPortOptions.includes(quote.boat_home) || quote.boat_home === '')) {
          this.boatPortOptions.push(quote.boat_home)
        }
      }
      this.pickDropOptions.sort((a, b) => { return (a < b) ? -1 : (a < b) ? 1 : 0 })
      this.custClubOptions.sort((a, b) => { return (a < b) ? -1 : (a < b) ? 1 : 0 })
      this.boatPortOptions.sort((a, b) => { return (a < b) ? -1 : (a < b) ? 1 : 0 })
    },
    updateStatusView () {
      switch (this.status_view) {
        case 'all': this.f_registry.statusFilter.status_list = []
          break
        case 'active': this.f_registry.statusFilter.status_list = ['quote request', 'pending', 'production', 'ready']
          break
        case 'inactive': this.f_registry.statusFilter.status_list = ['follow up', 'delivered', 'no sale']
          break
      }
      this.filterQuoteStatus()
    },
    updateColumnView () {
      switch (this.col_view[0]) {
        case 'PICK': this.f_registry.custClubFilter.filter = []
          this.f_registry.boatPortFilter.filter = []
          this.f_registry.custClubFilter.status = false
          this.f_registry.boatPortFilter.status = false
          this.boatPortSelection = null
          this.custClubSelection = null
          break
        case 'CLUB': this.f_registry.pickDropFilter.filter = []
          this.f_registry.boatPortFilter.filter = []
          this.f_registry.pickDropFilter.status = false
          this.f_registry.boatPortFilter.status = false
          this.boatPortSelection = null
          this.pickDropSelection = null
          break
        case 'PORT': this.f_registry.custClubFilter.filter = []
          this.f_registry.pickDropFilter.filter = []
          this.f_registry.custClubFilter.status = false
          this.f_registry.pickDropFilter.status = false
          this.pickDropSelection = null
          this.custClubSelection = null
          break
      }
      this.applyFilters()
    },
    filterPickDrop () {
      if (this.pickDropSelection !== null) {
        this.f_registry.pickDropFilter.filter = this.quotes.filter((quote) => { return quote.pick_drop === this.pickDropSelection })
        this.f_registry.pickDropFilter.status = true
      } else {
        this.f_registry.pickDropFilter.status = false
      }
      this.applyFilters()
    },
    filterCustClub () {
      if (this.custClubSelection !== null) {
        this.f_registry.custClubFilter.filter = this.quotes.filter((quote) => { return quote.customer.club === this.custClubSelection })
        this.f_registry.custClubFilter.status = true
      } else {
        this.f_registry.custClubFilter.status = false
      }
      this.applyFilters()
    },
    filterBoatPort () {
      if (this.boatPortSelection !== null) {
        this.f_registry.boatPortFilter.filter = this.quotes.filter((quote) => { return quote.boat_home === this.boatPortSelection })
        this.f_registry.boatPortFilter.status = true
      } else {
        this.f_registry.boatPortFilter.status = false
      }
      this.applyFilters()
    },
    filterRequestType () {
      if (this.f_registry.requestFilter.request_list.length !== 0) {
        this.f_registry.requestFilter.filter = this.quotes.filter((quote) => { return quote.quote_type.reduce((acc, val) => { return acc || this.f_registry.requestFilter.request_list.includes(val) }, false) })
        this.f_registry.requestFilter.status = true
      } else {
        this.f_registry.requestFilter.status = false
      }
      this.applyFilters()
    },
    filterStatusType () {
      if (this.f_registry.statusFilter.status_list.length !== 0) {
        this.f_registry.statusFilter.filter = this.quotes.filter((quote) => { return this.f_registry.statusFilter.status_list.includes(quote.status) })
        this.f_registry.statusFilter.status = true
      } else {
        this.f_registry.statusFilter.status_list = []
        this.f_registry.statusFilter.status = false
      }
      this.applyFilters()
    },
    applyFilters () {
      var filterObj = {}
      var haveEmptyFilter = false
      var hasActiveFilters = false

      for (var key in this.f_registry) {
        var filterLength = this.f_registry[key].filter.length
        if (this.f_registry[key].status && filterLength > 0) {
          filterObj[key] = this.f_registry[key].filter
          hasActiveFilters = true
        } else if (this.f_registry[key].status && filterLength === 0) {
          haveEmptyFilter = true
          hasActiveFilters = true
        }
      }

      if (hasActiveFilters) {
        if (haveEmptyFilter) {
          this.quotes_display = []
        } else {
          var result = Object
            .values(filterObj)
            .reduce((a, b) => b.filter(Set.prototype.has, new Set(a)))

          this.quotes_display = result
        }
      } else {
        this.quotes_display = this.quotes
      }
    }
  },
  mounted () {
    this.getQuotes()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
html, body{
    margin:0;
    padding:0;
    min-width: 1140px; /* this is the important part*/
}

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

table {
  width: 100%;
}

a {
  color: #35495E;
}

td, th {
  padding: 8px;
}

label {
  margin-left: 5px;
  margin-right: 3px;
}
/*
#.row span {
#  margin: 0 8px;
#}
*/
.phone {
  width: 12%;
}

.quote_request {
  background-color: #FFFF99;
}

.pending {
  background-color: #00FFFF;
}

.production {
  background-color: #98FB98;
}

.ready {
  background-color: #CCCCCC;
}

.delivered {
  background-color: #C58BE7;
}

.no_sale {
  background-color: #FF8000;
}

.status {
  margin-top: 3px;
  margin-right: 35px;
  padding: 2px;
}

.stat_controller {
  margin-top: 3px;
  margin-left: 30px;
  padding: 2px;
}

.col_view_controller {
  margin-top: 30px;
  margin-left: 45px;
  padding: 2px;
}

.quote_types {
  margin-bottom: 3px;
  padding: 2px;
}

.pickdropselect {
  width: 25em;
}
</style>
