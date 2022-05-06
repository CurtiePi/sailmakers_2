<template>
  <div class="container">
    <div v-if="isFetching" class="col-md-12">
      <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
      <p>Loading . . .</p>
    </div>
    <div v-else class="col-md-12">
      <h1>Quotes for {{ customer.fname }} {{ customer.lname }}</h1>
      <table class="responsive-table">
        <thead>
          <tr>
            <th scope="col">Quote Date</th>
            <th scope="col">Quote Type(s)</th>
            <th scope="col">Sail Request</th>
            <th scope="col">Status</th>
            <th scope="col">Due Date</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for= "quote in quotes"
            :key="quote._id">
            <th scope="row">
              <router-link :to="{ name: 'QuoteDisplay', params: { 'payload': JSON.stringify(quote), 'caller': ['CustomerQuotes'] } }">{{ formatDate(quote.createdAt) }}</router-link>
            </th>
            <td data-title="Type(s)">{{ formatType(quote.quote_type) }}</td>
            <td data-title="Request">{{ quote.sail_request }}</td>
            <td data-title="Status">{{ quote.status }}</td>
            <td data-title="Due Date">{{ formatDate(quote.due_date) }}</td>
            <td data-title="Price">{{ quote.quote_price.toFixed(2) }}</td>
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
  props: ['payload'],
  data () {
    return {
      quotes: [],
      customer: null,
      isFetching: true
    }
  },
  methods: {
    formatType: function (quoteTypes) {
      return quoteTypes.join(', ')
    },
    formatDate: function (dateString) {
      let result = ''
      if (dateString) {
        const d = new Date(dateString)
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
        const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
        result = `${da}-${mo}-${ye}`
      }
      return result
    },
    temporalSort: function (a, b) {
      return (a.createdAt > b.createdAt) ? -1 : (a.createdAt < b.createdAt) ? 1 : 0
    },
    getCustomerQuotes: async function (customerId) {
      let response = await AuthenticationService.getCustomerQuotes(customerId)
      this.quotes = response.data
      this.quotes.sort(this.temporalSort)
    }
  },
  mounted () {
    if (this.payload) {
      this.customer = JSON.parse(this.$route.params.payload)
      this.getCustomerQuotes(this.customer._id)
    }
    this.isFetching = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
