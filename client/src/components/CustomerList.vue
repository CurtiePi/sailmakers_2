<template>
  <div class="container-xl">
    <h1>Customer List</h1>
      <div class="row">
        <ul class="fancy m-5">
          <li class="fancy">
            <label for="nameFilter">Name Filter</label>
            <input type="text" v-model="f_name" @input="filterName()" />
            <span>Filter on a name</span>
          </li>
        </ul>
        <button class="btn btn-primary m-5" data-bs-toggle="collapse" href="#requestFilter" role="button" aria-expanded="false" aria-controls="requestFilter" :style="{width: '150px'}">Request Filter</button>
        <button class="btn btn-primary m-5" type="button" data-bs-toggle="collapse" data-bs-target="#statusFilter" aria-expanded="false" aria-controls="statusFilter" :style="{width: '150px'}" >Status Filter</button>
    </div>
    <div class="row mb-5">
      <div class="collapse multi-collapse" id="requestFilter" :style="{width: '250px'}">
        <select class="form-select" multiple aria-label="multiple select example" @change="filterRequestType($event)">
          <option value="new sail">New Sail</option>
          <option value="sail repair">Sail Repair</option>
          <option value="winter service">Winter Service</option>
          <option value="sail cover">Sail Cover</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="collapse multi-collapse" id="statusFilter" :style="{width: '250px'}">
        <select class="form-select" multiple aria-label="multiple select example" @change="filterStatusType($event)">
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
  <table class="responsive-table">
    <!-- caption>Top 10 Grossing Animated Films of All Time</caption -->
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Phone</th>
        <th scope="col">Club</th>
        <th scope="col">Boat Name</th>
        <th scope="col">Boat Home</th>
        <th scope="col"></th>
      </tr>
    </thead>
    <!-- tfoot>
      <tr>
        <td colspan="7">Sources: <a href="http://en.wikipedia.org/wiki/List_of_highest-grossing_animated_films" rel="external">Wikipedia</a> &amp; <a href="http://www.boxofficemojo.com/genres/chart/?id=animation.htm" rel="external">Box Office Mojo</a>. Data is current as of March 31, 2021.</td>
      </tr>
    </tfoot -->
    <tbody>
      <tr v-for= "customer in customer_display"
             :key="customer._id">
        <th scope="row">
          <router-link :to="{ name: 'CustomerProfile', params: { 'payload': customer, 'caller': 'Customers' } }">
            {{ customer.fname }}  {{ customer.lname }}
          </router-link>
        </th>
        <td data-title="Email"><router-link :to="{ name: 'CreateMessage', params: { 'targets': [customer.email], 'caller': 'Customers' } }">{{ customer.email }}</router-link></td>
        <td data-title="Phone">{{ customer.phone }}</td>
        <td data-title="Club">{{ customer.club }}</td>
        <td data-title="Boat Name">{{ customer.boat_name }}</td>
        <td data-title="Boat Home">{{ customer.boat_home }}</td>
        <td data-title="View Quotes">
          <button v-if="customer.quotes.length > 0"
            @click="viewQuotes(customer)">
              View Requests({{ customer.quotes.length }})
          </button>
        </td>
      </tr>
    </tbody>
  </table>
    <!-- div class="row filter-div">
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
          <option value="quote request">Quote Request</option>
          <option value="pending">Pending</option>
          <option value="production">In Production</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
          <option value="no sale">No Sale</option>
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
    </div>
    <div class="container">
      <h1>Customer List</h1>
      <div>
          <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Club</th>
              <th>Boat Name</th>
              <th>Boat Home</th>
              <th></th>
          </tr>
          <tr v-for= "customer in customer_display"
              :key="customer._id">
              <td>
                <router-link :to="{ name: 'CustomerProfile', params: { 'payload': customer, 'caller': 'Customers' } }">
                  {{ customer.fname }}  {{ customer.lname }}
                </router-link>
              </td>
              <td><router-link :to="{ name: 'CreateMessage', params: { 'targets': [customer.email], 'caller': 'Customers' } }">{{ customer.email }}</router-link></td>
              <td>{{ customer.phone }}</td>
              <td>{{ customer.club }}</td>
              <td>{{ customer.boat_name }}</td>
              <td>{{ customer.boat_home }}</td>
              <td>
                <button v-if="customer.quotes.length > 0"
                  @click="viewQuotes(customer)">
                  View Requests({{ customer.quotes.length }})
                </button>
              </td>
          </tr>
      </div>
    </div -->
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'customerList',
  data () {
    return {
      customers: [],
      customer_display: [],
      sort_type: 'alpha',
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
    getCustomers: async function () {
      let response = await AuthenticationService.customerList()
      this.customers = response.data
      this.customer_display = response.data
      this.sortList()
    },
    viewQuotes: function (customer) {
      if (customer.quotes.length === 1) {
        this.$router.replace({ name: 'QuoteDisplay', params: { 'payload': customer.quotes[0], caller: 'Customers' } })
      } else {
        this.$router.replace({ name: 'CustomerQuotes', params: { 'payload': customer } })
      }
    },
    temporalSort: function (a, b) {
      var aQuotes = a.quotes
      var bQuotes = b.quotes
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
      // this.applyFilters()
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
    filterRequestType: function (evt) {
      if (evt.target.value !== 'all') {
        this.f_registry.typeFilter.filter = this.customers.filter((cus) => { return cus.quotes.reduce((acc, val) => { return acc || val.quote_type.indexOf(evt.target.value) !== -1 }, false) })
        this.f_registry.typeFilter.status = true
      } else {
        this.f_registry.typeFilter.status = false
      }
      this.applyFilters()
    },
    filterStatusType: function (evt) {
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
          filterObj[key] = this.f_registry[key].filter
          hasActiveFilters = true
        } else if (this.f_registry[key].status && filterLength === 0) {
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
<style lang="scss" scoped>
/**
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
*/
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

ul.fancy {
  list-style: none;
  width: 20%;
  padding: 0;
  margin: 0;
}

li.fancy {
  position:relative;
  display: block;
  padding: 9px;
  border:1px solid #DDDDDD;
  margin-bottom: 30px;
  border-radius: 3px;
}

li.fancy:last-child{
	margin-bottom: 0px;
	text-align: center;
}

li.fancy > label{
	display: block;
	float: left;
	margin-top: -30px;
	background: #FFFFFF;
	height: 19px;
	padding: 2px 5px 2px 5px;
	color: #0E6EFB;
	font-size: 14px;
	overflow: hidden;
	font-family: Arial, Helvetica, sans-serif;
}

li.fancy > span{
	background: #0EFEFB;
	display: block;
	padding: 3px;
	margin: 0 -9px -9px -9px;
	text-align: center;
	color: #0000FF;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 11px;
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
      
      &:nth-of-type(even) {
        @media (min-width: $bp-bart) {
          background-color: rgba(0,0,0,.12);
        }
      }
    }
    
    th[scope="row"] {
      background-color: rgba(170,195,197,1);
      color: white;
      
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
