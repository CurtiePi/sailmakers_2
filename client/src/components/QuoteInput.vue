<template>
    <section>
      <div class="left-panel">
      </div>
      <div class="right-panel">
        <form class="form-style-7">
          <div class="customer-static-div">
            <h4 :style="{margin: '0px'}">{{ custFields.customer }}</h4>
              <br/>
              <p><i class='fa fa-home'></i>{{ custFields.address }}</p>
              <p><i class='fa fa-phone'></i>{{ custFields.phone }}</p>
              <p><i class='fa fa-envelope'></i>{{ custFields.email }}</p>
              <p><i class='fa fa-anchor'></i>{{ custFields.club }}</p>
          </div>
          <div class="types-list-div">
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
          <div class="status-list-div">   
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
          <div class="date-picker-div">
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
          <div class="customer-dynamic-div">
            <div class="center">
              <ul>
                <li>
                  <label for="customer_notes">Customer Notes</label>
                  <textarea name="customer_notes" v-model="custFields.cnotes" />
                  <span>Enter customer notes</span>
                </li>
              </ul>
            </div>
          <div class="left">
            <ul>
              <li>
                <label for="boat_name">Boat Name</label>
                <input type="text" name="boat_name" v-model="quoteFields.boat_name" />
                <span>Enter boat name</span>
              </li>
              <li>
                <label for="boat_home">Boat Port</label>
                <input type="text" name="boat_home" v-model="quoteFields.boat_home" />
                <span>Enter boat home</span>
              </li>
            </ul>
          </div>
          <div class="right">
            <ul>
              <li>
                <label for="boat_model">Boat Model</label>
                <input type="text" name="boat_model" v-model="quoteFields.boat_model" />
                <span>Enter boat model</span>
              </li>
              <li>
                <label for="pick_drop">Pick Up/Drop Off</label>
                <input type="text" name="pick_drop" v-model="quoteFields.pick_drop" />
                <span>Enter pick up location</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="sail-request-div">
          <ul>
            <li>
              <label for="sail_request">Sail Request</label>
              <textarea name="sail_request" v-model="quoteFields.sail_request" />
              <span>Enter sail information</span>
            </li>
          </ul>
        </div>
        <div class="sail-type-div">
          <ul>
            <li>
              <label for="sailing_type">Sail Type</label>
              <textarea name="sailing_type" v-model="quoteFields.sailiing_type" />
              <span>Enter sailing type information</span>
            </li>
          </ul>
        </div>
        <div class="extras-div">
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
        <div class="finances-div">
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
        <div class="additional-notes-div">
          <ul>
            <li>
              <label for="additional_notes">Additional Notes</label>
              <textarea name="additional_notes" v-model="quoteFields.notes" />
              <span>Enter additional notes</span>
            </li>
          </ul>
        </div>
      </form>
      <div class="button-div">
        <button type="button" class="btn btn-primary"
          @click="isEditing ? updateQuote() : createQuote()"
          :disabled="!allowSubmitForm">{{ headerText }}
        </button>
        <button type="button" class="btn btn-primary"
          @click="cancel()">
          Cancel
        </button>
        <button type="button" class="btn btn-primary"
          @click="checkoutput()">
          Check New Quote
        </button>
        <button type="button" class="btn btn-primary"
          @click="checkForChanges()">
          Change check
        </button>
        <label v-if="isEditing" style="margin-left: 50px">Get File With Price:<input type="file" ref="fileInput" class="btn btn-primary"
          @change="getPrice()" /></label>
             </div>
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
    async getPrice () {
      var name = this.$refs.fileInput

      const formData = new FormData()
      formData.append('file', name.files[0])
      try {
        var response = await AuthenticationService.getPrice(formData)
        this.quoteFields.quote_price = response.data.quote_price
      } catch (err) {
        console.log(err)
      }
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
        this.$router.push({name: 'QuoteDisplay', params: {'payload': this.quote}})
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
        this.$router.push({ name: 'QuoteDisplay', params: {'payload': this.quote} })
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
          this.quoteFields[key] = this.quote[key]
          this.origQuoteFields[key] = this.quote[key]
        }
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
    clearInputs () {
      for (var key in this.quoteFields.length) {
        this.quoteFields[key] = (key === 'quote_type') ? [] : ''
      }
    },
    loadData () {
      this.$nextTick(function () {
        this.prepareInputs()
      })
    }
  },
  mounted () {
    if (this.create_payload) {
      console.log(this.create_payload)
      this.customer = this.create_payload
    } else if (this.edit_payload) {
      this.quote = this.edit_payload
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

.form-style-7{
	max-width:600px;
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

.left-div {
  float: left;
  width: 25%;
  height: 100%;
  background: url('~@/assets/images/sailboat_three.jpg') top left/cover no-repeat;
}

.right-div {
  float: right;
  width: 80%;
  height: 100%;
}

.form-div {
  position :relative;
  top: 10%;
}

.customer-static-div {
  position: relative;
  text-align: left;
  line-height: .9em;
  border: 1px gray solid;
  border-radius: 10px;
  -webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  height: 190px;
  width: 400px;
  padding: 5px;
  font-size: 1.2em;
  background-color: beige;
}

.customer-dynamic-div {
  position: absolute;
  width: 35%;
  top: 40%;
  line-height: .5em;
}

.customer-dynamic-div > div.left {
  float: left;
  width: 45%;
  margin-right: 5%;
}

.customer-dynamic-div > div.right {
  float: right;
  width: 45%;
}

.customer-dynamic-div > div.center {
  float: left;
  width: 100%;
  margin-bottom: 25px;
}

.status-input {
  display: block;
  text-align: left;
  line-height: .5em;
}

.status-input > input {
  margin: 0% 2%;
}

.types-list-div {
  position: absolute;
  top: 5%;
  left: 50%;
  width: 150px;
  margin-right: 1%;
}

.status-list-div {
  position: absolute;
  top: 5%;
  left: 70%;
  width: 150px;
  margin-left: 1%;
}

.date-picker-div {
  position: absolute;
  top: 35%;
  left: 45%;
  margin-left: 1%;
}

.sail-request-div {
    position: absolute;
    width: 45%;
    left: 45%;
    top: 50%;;
}

.sail-type-div {
    position: absolute;
    width: 45%;
    left: 45%;
    top: 65%;
}

.extras-div {
  position: absolute;
  width: 65%;
  top: 80%;
}

.finances-div {
  position: absolute;
  width: 20%;
  top: 80%;
  left: 70%
}

.additional-notes-div {
    position: absolute;
    width: 39%;
    top: 95%;
}

.button-div {
    position: absolute;
    bottom: -20%;;
    margin-left: 15%;
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
