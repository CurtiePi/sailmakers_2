<template>
  <div v-if="!isFetching" class="container">
    <h1>Quotes for {{ customer.fname }} {{ customer.lname }}</h1>
    <div>
        <tr>
            <th>Quote Date</th>
            <th>Quote Type(s)</th>
            <th>Sail Request</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Price</th>
        </tr>
        <tr v-for= "quote in quotes"
            :key="quote._id">
            <td><router-link :to="{ name: 'QuoteDisplay', params: { 'payload': quote, 'caller': ['CustomerQuotes'] } }">{{ formatDate(quote.createdAt) }}</router-link></td>
            <td>{{ formatType(quote.quote_type) }}</td>
            <td>{{ quote.sail_request }}</td>
            <td>{{ quote.status }}</td>
            <td>{{ formatDate(quote.due_date) }}</td>
            <td>{{ quote.quote_price.toFixed(2) }}</td>
        </tr>
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
      this.customer = this.payload
      this.getCustomerQuotes(this.customer._id)
      this.isFetching = false
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
    margin: 0 8px;
    vertical-align: middle;
}

td, th {
  padding: 15px;
}

tr:nth-child(even) {
    background-color: #eeeeee;
}

tr:nth-child(odd) {
    background-color: #cccccc;
}
</style>
