<template>
  <div class="container-xl">
   <h1>Requests List</h1>
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
      <table class="responsive-table">
        <thead>
          <tr>
            <th scope="col">Customer</th>
            <th scope="col">Request Type</th>
            <th scope="col">Phone</th>
            <th scope="col">Status</th>
            <th scope="col" v-if="col_view[0] === 'PICK'">Pick Up</th>
            <th scope="col" v-else-if="col_view[0] === 'CLUB'">Customer Club</th>
            <th scope="col" v-else-if="col_view[0] === 'PORT'">Boat Port</th>
            <th scope="col">Created Date</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for= "quote in quotes_display"
            :class="quote.status.replace(' ', '_')"
            :key="quote._id">
            <th scope="row">
              <router-link :to="{ name: 'CustomerProfile', params: { 'payload': JSON.stringify(quote.customer), 'caller': 'Quotes' } }">
                {{ quote.customer.fname }} {{ quote.customer.lname }}
              </router-link>
            </th>
            <td data-title="Request">{{ quote.quote_type.join(', ') }}</td>
            <td data-title="Phone">{{ quote.customer.phone }}</td>
            <td data-title="Status">{{ quote.status }}</td>
            <td data-title="Pick Up" v-if="col_view[0] === 'PICK'">{{ quote.pick_drop }}</td>
            <td data-title="Customer Club" v-else-if="col_view[0] === 'CLUB'">{{ quote.customer.club }}</td>
            <td data-title="Boat Port" v-else-if="col_view[0] === 'PORT'">{{ quote.boat_home }}</td>
            <td data-title="Created Date">{{ formatDate(quote.createdAt) }}</td>
            <td data-title="Request Details">
              <span @click="viewQuote(quote)">
                <i class="fa fa-eye"></i>
              </span>
            </td>
          </tr>
        </tbody>
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
      exampleModalShowing: false,
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
        },
      },
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
      this.loadQuoteData(response.data)
      //this.quotes = response.data
      //this.quotes_display = response.data
      //this.sortList()
      //this.filterStatusType()
      // this.populateDropDown()
    },
    loadQuoteData (data) {
      this.quotes = data
      this.quotes_display = data
      this.sortList()
      this.filterStatusType()
    },
    viewQuote (quoteObj) {
      this.$router.replace({ name: 'QuoteDisplay', params: { 'payload': JSON.stringify(quoteObj), 'caller': 'Quotes' } })
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
    if (this.$route.params.payload) {
      console.log('We have a payload')
      this.loadQuoteData(JSON.parse(this.$route.params.payload))
    } else {
      console.log('We have NO payload')
      this.getQuotes()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

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

.pickdropselect {
  width: 25em;
}


@import "bourbon";

/*  Breakpoints */
$bp-maggie: 15em; 
$bp-lisa: 30em;
$bp-bart: 48em;
$bp-marge: 62em;
$bp-homer: 75em;

/* Styles */
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  font-family: $font-stack-system;
  color: rgba(0,0,0,.87);
}

a {
  color: rgba(64,64,255,1);
  
  &:hover,
  &:focus {
    color: rgba(4,106,56,1); 
  }
}

.container {
  margin: 5% 3%;
  
  @media (min-width: $bp-bart) {
    margin: 2%; 
  }
  
  @media (min-width: $bp-homer) {
    margin: 2em auto;
    max-width: $bp-homer;
  }
}

.responsive-table {
  width: 100%;
  margin-bottom: 1.5em;
  border-spacing: 0;
  
  @media (min-width: $bp-bart) {
    font-size: .9em; 
  }
  
  @media (min-width: $bp-marge) {
    font-size: 1em; 
  }
  
  thead {
    /* Accessibly hide <thead> on narrow viewports */
    position: absolute;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    padding: 0;
    border: 0;
    height: 1px; 
    width: 1px; 
    overflow: hidden;
    
    @media (min-width: $bp-bart) {
      /* Unhide <thead> on wide viewports */
      position: relative;
      clip: auto;
      height: auto;
      width: auto;
      overflow: auto;
    }
    
    th {
      background-color: rgba(170,195,197,1);
      border: 1px solid rgba(134,188,37,1);
      font-weight: normal;
      text-align: center;
      color: brown;
      
      &:first-of-type {
        text-align: left; 
      }
    }
  }
  
  /* Set these items to display: block for narrow viewports */
  tbody,
  tr,
  th,
  td {
    display: block;
    padding: 0;
    text-align: left;
    white-space: normal;
  }
  
  tr {   
    @media (min-width: $bp-bart) {
      /* Undo display: block */ 
      display: table-row; 
    }
  }
  
  th,
  td {
    padding: .5em;
    vertical-align: middle;
    
    @media (min-width: $bp-lisa) {
      padding: .75em .5em; 
    }
    
    @media (min-width: $bp-bart) {
      /* Undo display: block */
      display: table-cell;
      padding: .5em;
    }
    
    @media (min-width: $bp-marge) {
      padding: .75em .5em; 
    }
    
    @media (min-width: $bp-homer) {
      padding: .75em; 
    }
  }
  
  caption {
    margin-bottom: 1em;
    font-size: 1em;
    font-weight: bold;
    text-align: center;
    
    @media (min-width: $bp-bart) {
      font-size: 1.5em;
    }
  }
  
  tfoot {
    font-size: .8em;
    font-style: italic;
    
    @media (min-width: $bp-marge) {
      font-size: .9em;
    }
  }
  
  tbody {
    @media (min-width: $bp-bart) {
      /* Undo display: block  */
      display: table-row-group; 
    }
    
    tr {
      margin-bottom: 1em;
      
      @media (min-width: $bp-bart) {
        /* Undo display: block  */
        display: table-row;
        border-width: 1px;
      }
      
      &:last-of-type {
        margin-bottom: 0; 
      }
/*      
      &:nth-of-type(even) {
        @media (min-width: $bp-bart) {
          background-color: rgba(0,0,0,.12);
        }
      }
*/
    }
    
    th[scope="row"] {
      background-color: rgba(170,195,197,1);
      color: yellow;
      
      @media (min-width: $bp-lisa) {
        border-left: 1px solid rgba(134,188,37,1);
        border-bottom: 1px solid rgba(134,188,37,1);
      }
      
      @media (min-width: $bp-bart) {
        background-color: transparent;
        color: rgba(0,0,0.87);
        text-align: left;
      }
    }
    
    td {
      text-align: right;
      
      @media (min-width: $bp-bart) {
        border-left: 1px solid rgba(134,188,37,1);
        border-bottom: 1px solid rgba(134,188,37,1);
        text-align: center; 
      }

      &:last-of-type {
        @media (min-width: $bp-bart) {
          border-right: 1px solid rgba(134,188,37,1);
        } 
      }
    }
    
    td[data-type=currency] {
      text-align: right; 
    }
    
    td[data-title]:before {
      content: attr(data-title);
      float: left;
      font-size: .8em;
      color: rgba(0,0,0,.54);
      
      @media (min-width: $bp-lisa) {
        font-size: .9em; 
      }
      
      @media (min-width: $bp-bart) {
        /* Don’t show data-title labels */
        content: none; 
      }
    } 
  }
}
</style>
