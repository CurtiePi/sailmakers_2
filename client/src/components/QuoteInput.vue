<template>
    <section>
      <div class="left-panel">
        <span class="header mx-4 mt-5"><h1>{{ headerText }}</h1></span>
      </div>
      <div class="right-panel">
        <form class="form-style-7">
          <div class="row col-md-12">
            <div class="col-md-6 customer-info-div">
              <h4 :style="{margin: '0px'}">{{ custFields.customer }}</h4>
                <br/>
                <p><i class='fa fa-home'></i>{{ custFields.address }}</p>
                <p><i class='fa fa-phone'></i>{{ custFields.phone }}</p>
                <p><i class='fa fa-envelope'></i>{{ custFields.email }}</p>
                <p><i class='fa fa-anchor'></i>{{ custFields.club }}</p>
            </div>
            <div class="row col-md-3 ms-2">
              <ul>
                <li>
                  <label>Quote Type</label>
                  <p class="status-input">
                    <input type="checkbox" name="new_sail" value="new sail"  v-model="quoteFields.quote_type" />New Sail
                  </p>
                  <p class="status-input">
                    <input type="checkbox" name="sail_repair" value="sail repair" v-model="quoteFields.quote_type" />Sail Repair
                  </p>
                  <p class="status-input">
                    <input type="checkbox" name="winter_service" value="winter service" v-model="quoteFields.quote_type" />Winter Service
                  </p>
                  <p class="status-input">
                    <input type="checkbox" name="sail_cover" value="sail cover" v-model="quoteFields.quote_type" />Sail Cover
                  </p>
                  <p class="status-input">
                    <input type="checkbox" name="other" value="other" v-model="quoteFields.quote_type" />Other
                  </p>
                  <span>Select Quote Type(s)</span>
                </li>
              </ul>
            </div>
            <div class="row col-md-3 ms-2">
              <ul>
                <li>
                  <label>Status</label>
                  <p class="status-input">
                    <input type="radio" name="status" value="quote request" v-model="quoteFields.status" />Quote Request
                  </p>
                  <p class="status-input">
                    <input type="radio" name="status" value="pending" v-model="quoteFields.status" />Pending
                  </p>
                  <p class="status-input">
                    <input type="radio" name="status" value="production" v-model="quoteFields.status" />Production
                  </p>
                  <p class="status-input">
                    <input type="radio" name="status" value="ready" v-model="quoteFields.status" />Ready
                  </p>
                  <p class="status-input">
                    <input type="radio" name="status" value="follow up" v-model="quoteFields.status" />Follow Up
                  </p>
                  <p class="status-input">
                    <input type="radio" name="status" value="delivered" v-model="quoteFields.status" />Delivered
                  </p>
                  <p class="status-input">
                    <input type="radio" name="status" value="no sale" v-model="quoteFields.status" />No Sale
                  </p>
                  <span>Select Request Status</span>
                </li>
              </ul>
            </div>
            <div class="col-md-8 mt-4">
              <div class="col-md-12 mb-5">
                <ul>
                  <li>
                    <label for="customer_notes">Customer Notes</label>
                    <textarea name="customer_notes"
                      @keyup="adjustTextarea($event)"
                      ref="cust_notes_area"
                      v-model="custFields.cnotes" />
                    <span>Enter customer notes</span>
                  </li>
                </ul>
              </div>
              <div class="row col-md-12 mb-5">
                <div class="col-md-5">
                  <ul>
                    <li>
                      <label for="boat_name">Boat Name</label>
                      <input type="text" name="boat_name" v-model="quoteFields.boat_name" />
                      <span>Enter boat name</span>
                    </li>
                  </ul>
                </div>
                <div class="col-md-5">
                  <ul>
                    <li>
                      <label for="boat_home">Boat Port</label>
                      <input type="text" name="boat_home" v-model="quoteFields.boat_home" />
                      <span>Enter boat home</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="row col-md-12 mb-3">
                <div class="col-md-5">
                  <ul>
                    <li>
                      <label for="boat_model">Boat Model</label>
                      <input type="text" name="boat_model" v-model="quoteFields.boat_model" />
                      <span>Enter boat model</span>
                    </li>
                  </ul>
                </div>
                <div class="col-md-5">
                  <ul>
                    <li>
                      <label for="pick_drop">Pick Up/Drop Off</label>
                      <input type="text" name="pick_drop" v-model="quoteFields.pick_drop" />
                      <span>Enter pick up location</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-4 mt-4">
              <div class="col mb-auto">
                <ul>
                  <li>
                    <label>Due Date:</label>
                    <datepicker name="due-date"
                       @selected="dateSelected()"
                       v-model="quoteFields.due_date"
                       :disabled-dates="setDisabledDates">
                    </datepicker>
                  </li>
                </ul>
              </div>
              <div class="col mt-5 pt-4">
                <ul class="horizontal">
                  <li>
                    <label for="quote_price">Price</label>
                    <input type="number" step="0.5" name="quote_price" v-model="quoteFields.quote_price" />
                    <span>Enter the price</span>
                  </li>
                  <li>
                    <label for="amount_paid">Amnt Paid</label>
                    <input type="number" step="0.5" name="amount_paid" v-model="quoteFields.amount_paid" />
                    <span>Enter amount paid</span>
                  </li>
                </ul>
              </div>
            </div>
          <div class="col-md-12 mt-3">
            <span class="small-print label-clr" @click="toggleExtrasDiv()" :style="{'margin-bottom': 90 + '%'}">{{ toggleText }} Extras</span>
            <div v-if="showExtras" class="row mt-4">
              <ul class="horizontal">
                <li>
                  <label for="battens">Battens</label>
                  <input type="text" name="battens" v-model="quoteFields.battens" />
                  <span>Enter a number</span>
                </li>
                <li>
                  <label for="reefing_pts">Reefing Points</label>
                  <input type="number" name="reefing_pts" v-model="quoteFields.reefing_pts" />
                  <span>Enter a number</span>
                </li>
                <li>
                  <label for="furl_sys">Furling System</label>
                  <input type="text" name="furl_sys" v-model="quoteFields.furl_sys" />
                  <span>Enter a system</span>
                </li>
                <li>
                  <label for="num_logo">Numbers/Logo</label>
                  <input type="text" name="num_logo" v-model="quoteFields.num_logo" />
                  <span>Enter a number</span>
                </li>
                <li>
                  <label for="uv_color">UV Color</label>
                  <input type="text" name="uv_color" v-model="quoteFields.uv_color" />
                  <span>Enter a color</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-md-10 offset-md-1 mt-3 mb-5">
            <nav>
              <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-request-tab" data-bs-toggle="tab" data-bs-target="#nav-sail-request" type="button" role="tab" aria-controls="nav-sail-request" aria-selected="true">Sail Request</button>
                <button class="nav-link" id="nav-type-tab" data-bs-toggle="tab" data-bs-target="#nav-sailing-type" type="button" role="tab" aria-controls="nav-sailing-type" aria-selected="false">Sailing Type</button>
                <button class="nav-link" id="nav-notes-tab" data-bs-toggle="tab" data-bs-target="#nav-additional-notes" type="button" role="tab" aria-controls="nav-additional-notes" aria-selected="false">Additional Notes</button>
              </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
              <div class="tab-pane fade show active" id="nav-sail-request" role="tabpanel" aria-labelledby="nav-request-tab">
                <ul>
                  <li>
                    <textarea name="sail_request"
                      @keyup="adjustTextarea($event)"
                      ref="request_area"
                      v-model="quoteFields.sail_request" />
                    <span>Enter sail information</span>
                  </li>
                </ul>
              </div>
              <div class="tab-pane fade" id="nav-sailing-type" role="tabpanel" aria-labelledby="nav-type-tab">
                <ul>
                  <li>
                    <textarea name="sailing_type" 
                      @keyup="adjustTextarea($event)"
                      ref="type_area"
                      v-model="quoteFields.sailing_type" />
                    <span>Enter sailing type information</span>
                  </li>
                </ul>
              </div>
              <div class="tab-pane fade" id="nav-additional-notes" role="tabpanel" aria-labelledby="nav-notes-tab">
                <ul>
                  <li>
                    <textarea name="additional_notes"
                      @keyup="adjustTextarea($event)"
                      ref="notes_area"
                      v-model="quoteFields.notes" />
                    <span>Enter additional notes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="d-inline">
            <button type="button" class="btn btn-primary"
              @click="isEditing ? updateQuote() : createQuote()"
              :disabled="!allowSubmitForm">{{ headerText }}
            </button>
            <button type="button" class="btn btn-primary"
              @click="cancel()">
              Cancel
            </button>
            <!-- button type="button" class="btn btn-primary"
              @click="checkoutput()">
              Check New Quote
            </button>
            <button type="button" class="btn btn-primary"
              @click="checkForChanges()">
              Change check
            </button -->
          </div>
          </div>
        </form>
      </div>
    </section>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import Datepicker from 'vue3-datepicker'

export default {
  name: 'createQuote',
  props: ['create_payload', 'edit_payload'],
  components: {
    Datepicker
  },
  data () {
    return {
      origQuoteFields: {},
      customer: null,
      quote_type: [],
      isEditing: false,
      quote: null,
      original_customer_notes: null,
      toggleText: 'Hide',
      showExtras: true,
      custFields: {
        customer: null,
        address: null,
        phone: null,
        email: null,
        club: null,
        cnotes: null
      },
      quoteFields: {
        sail_request: null,
        boat_model: null,
        boat_name: null,
        boat_home: null,
        battens: null,
        reefing_pts: null,
        num_logo: null,
        furl_sys: null,
        uv_color: null,
        pick_drop: null,
        sailing_type: null,
        notes: null,
        status: null,
        amount_paid: null,
        quote_price: null,
        quote_type: [],
        due_date: new Date()
      },
      isFetching: true
    }
  },
  computed: {
    allowSubmitForm: function () {
      return Object.values(this.quoteFields).some(this.hasValue)
    },
    headerText: function () {
      return this.isEditing ? 'Update Request' : 'Create Request'
    },
    setDisabledDates: function () {
      let d = new Date()
      d.setDate(d.getDate() - 1)
      return {to: d}
    }
  },
  methods: {
    adjustTextarea (event) {
      let target = event.target
      target.style.height = "20px"
      target.style.height = (target.scrollHeight) + "px"
    }, 
    toggleExtrasDiv () {
      this.showExtras = !this.showExtras
      this.toggleText = (this.showExtras) ? 'Hide' : 'Show'
    },
    dateSelected () {
      this.$nextTick(() => console.log(`Quote Fields after nextTick ${this.quoteFields.due_date}`))
    },
    checkForChanges () {
      var formData = {}
      for (var key in this.quoteFields) {
        if (this.quoteFields[key] !== this.origQuoteFields[key]) {
          var value = (this.quoteFields[key].constructor === String) ? this.quoteFields[key].trim() : this.quoteFields[key]
          formData[key] = (['amount_paid', 'quote_price'].includes(key)) ? parseFloat(value) : value
        }
      }

      return formData
    },
    cancel () {
      if (this.isEditing) {
        let payload = JSON.stringify(this.quote)
        this.$router.push({name: 'QuoteDisplay', params: { 'payload': payload }})
      } else {
        this.$router.push({name: 'Customers'})
      }
    },
    checkoutput () {
      let data = {}

      for (var key in this.quoteFields) {
        if (this.hasValue(this.quoteFields[key])) {
          data[key] = (this.quoteFields[key].constructor === String) ? this.quoteFields[key].trim() : this.quoteFields[key]
        }
      }

      const boatFields = ['boat_name', 'boat_home', 'boat_model']
      for (key in this.custFields) {
        if (this.hasValue(this.custFields[key]) && boatFields.includes(key)) {
          data[key] = this.custFields[key].trim()
        }
      }

      data['customer_id'] = this.customer._id
      let salesperson = JSON.parse(localStorage.sp)
      data['salesperson_id'] = salesperson._id

      let payload = {'quoteObj': data}
      if (this.original_customer_notes !== this.custFields.cnotes) {
        payload['customerObj'] = { 'criteria': { '_id': this.customer._id }, 'data': { 'cnotes': this.custFields.cnotes.trim() } }
      }

      console.log(payload)
      return payload
    },
    async updateQuote () {
      let data = this.checkForChanges()

      if (Object.keys(data).length) {
        let payload = {
          criteria: {'_id': this.quote._id},
          update: data}

        var response = await AuthenticationService.quoteUpdate(payload)
        this.quote = response.data
        this.clearInputs()
        
        let quote_payload = JSON.stringify(this.quote)
        this.$router.push({ name: 'QuoteDisplay', params: { 'payload': quote_payload } })
      } else {
        var message = 'No values have been changed!\nChange a value before updating or Cancel'
        let options = {
          okText: 'Understood',
          animation: 'fade'
        }

        this.$dialog
          .alert(message, options)
          .then(function () {
            console.log('Closed!')
          })
      }
    },
    async createQuote () {
      let payload = {}

      payload = this.checkoutput()

      await AuthenticationService.quoteCreate(payload)
      this.clearInputs()
      this.$router.push({ name: 'Quotes' })
    },
    hasValue (value) {
      return value != null &&
        value !== undefined &&
        value !== ''
    },
    prepareInputs () {
      for (var ckey in this.custFields) {
        if (ckey === 'customer') {
          this.custFields[ckey] = `${this.customer.fname} ${this.customer.lname}`
        } else {
          this.custFields[ckey] = this.customer[ckey]
        }
      }

      if (this.isEditing) {
        for (var key in this.quoteFields) {
          let value = this.quote[key]
          if (key == 'due_date') {
            console.log(`Due Date value is: ${value}`)
            value = new Date(value)
          }
          this.quoteFields[key] = value
          this.origQuoteFields[key] = value
        }
        this.initializeTextAreaView()
      } else {
        const boatFields = ['boat_name', 'boat_home', 'boat_model']
        for (var idx = 0; idx < boatFields.length; idx++) {
          var field = boatFields[idx]
          this.quoteFields[field] = this.customer[field]
        }
        this.quoteFields['pick_drop'] = this.customer.boat_home
        this.original_customer_notes = this.customer.cnotes
      }
    },
    async initializeTextAreaView () {
      await this.$nextTick()
      
      Object.keys(this.$refs).forEach ( key => {
        this.$refs[key].style.height = (this.$refs[key].scrollHeight) + "px"
      })
    },
    clearInputs () {
      for (var key in this.quoteFields.length) {
        this.quoteFields[key] = (key === 'quote_type') ? [] : ''
      }
    },
  },
  mounted () {
    if (this.create_payload) {
      this.customer = JSON.parse(this.$route.params.create_payload)
    } else if (this.edit_payload) {
      this.quote = JSON.parse(this.$route.params.edit_payload)
      console.log("Editing the quote")
      console.log(this.quote)
      this.customer = this.quote.customer
      this.isEditing = true
    }
    this.prepareInputs()
    this.isFetching = false
  }
}
</script>

<style scoped>
button {
  margin: 5px 10px;
}

.header {
  float: left;  
}

.small-print {
  font-size: 10px; 
}

.label-clr {
  color: #0E6EFB;
}

.form-style-7{
	max-width:999px;
	width:100%;
	margin:5px;
	background:#fff;
	border-radius:2px;
	padding:20px;
	font-family: Georgia, "Times New Roman", Times, serif;
}
.form-style-7 h1{
	display: block;
	text-align: center;
	padding: 0;
	margin: 0px 0px 20px 0px;
	color: #5C5C5C;
	font-size:x-large;
}

.form-style-7 ul{
	list-style:none;
	padding:0;
	margin:0;	
}

.form-style-7 ul.horizontal{
    display: flex;
	list-style:none;
	padding:0;
	margin:0;
    height: inherited;
}

.form-style-7 ul.horizontal > li {
    margin-right: 2%;
    margin-bottom: 0px;
}

.form-style-7 li {
    position:relative;
	display: block;
	padding: 9px;
	border:1px solid #DDDDDD;
	margin-bottom: 30px;
	border-radius: 3px;
}

.form-style-7 li:last-child{
	margin-bottom: 0px;
	text-align: center;
}

.form-style-7 li > label{
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

.form-style-7 input[type="text"],
.form-style-7 input[type="date"],
.form-style-7 input[type="datetime"],
.form-style-7 input[type="email"],
.form-style-7 input[type="number"],
.form-style-7 input[type="search"],
.form-style-7 input[type="time"],
.form-style-7 input[type="url"],
.form-style-7 input[type="password"],
.form-style-7 textarea,
.form-style-7 select 
{
	box-sizing: border-box;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	width: 100%;
	display: block;
	outline: none;
	border: none;
	height: 25px;
	line-height: 25px;
	font-size: 16px;
	padding: 0;
	font-family: Georgia, "Times New Roman", Times, serif;
}

.form-style-7 input[type="text"]:focus,
.form-style-7 input[type="date"]:focus,
.form-style-7 input[type="datetime"]:focus,
.form-style-7 input[type="email"]:focus,
.form-style-7 input[type="number"]:focus,
.form-style-7 input[type="search"]:focus,
.form-style-7 input[type="time"]:focus,
.form-style-7 input[type="url"]:focus,
.form-style-7 input[type="password"]:focus,
.form-style-7 textarea:focus,
.form-style-7 select:focus 
{
}

.form-style-7 li > span{
	background: #0EFEFB;
	display: block;
	padding: 3px;
	margin: 0 -9px -9px -9px;
	text-align: center;
	color: #0000FF;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 11px;
}

.form-style-7 textarea{
	resize:none;
}

.form-style-7 input[type="submit"],
.form-style-7 input[type="button"]{
	background: #2471FF;
	border: none;
	padding: 10px 20px 10px 20px;
	border-bottom: 3px solid #5994FF;
	border-radius: 3px;
	color: #D2E2FF;
}

.form-style-7 input[type="submit"]:hover,
.form-style-7 input[type="button"]:hover{
	background: #6B9FFF;
	color:#fff;
}

.customer-info-div {
  text-align: left;
  line-height: .9em;
  border: 1px gray solid;
  border-radius: 10px;
  -webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  height: fit-content;
  width: 50%;
  padding: 5px;
  font-size: 1.2em;
  background-color: beige;
}

.status-input {
  display: block;
  text-align: left;
  line-height: .5em;
}

.status-input > input {
  margin: 0% 2%;
}

.left-panel{
  position: fixed;
  float: left;
  height: 100vh;
  overflow:hidden;
  background: linear-gradient(to right, transparent 50%, #fff 50%), url('~@/assets/images/sailboat_three.jpg') no-repeat center;
 background-size: cover;
 width: 50%;
}

.right-panel {
  position: absolute;
  left: 25%;
  height: 100vh;
  max-width:100vw;
  width:75%;
  overflow-x: hidden;
}
</style>
