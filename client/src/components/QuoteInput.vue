<template>
  <div v-if="!isFetching" class="container">
    <h1>{{ headerText }}</h1>
    <br />
    <div>
      <form>
        <div class="flex-grid-halfs">
          <div class="col">
            <label>Customer Name:
              <span> {{ custFields.customer }}</span>
            </label>
            <br/>
            <label>Due Date:</label>
            <datepicker name="due-date"
              @selected="dateSelected()"
              v-model="quoteFields.due_date"
              :disabled-dates="setDisabledDates"></datepicker>
          </div>
          <div v-if="isEditing" class="col">
            <label class="col">Quote Price:
              <input type="number" step="0.05" name="quote_price" v-model="quoteFields.quote_price" />
            </label>
            <label class="col">Amount Paid:
              <input type="number" step="0.05" name="amount_paid" v-model="quoteFields.amount_paid" />
            </label>
          </div>
          <div v-else class="col">
            <label class="col">Customer Notes:
            <textarea cols="60" rows="5"  name="customer_notes" v-model="custFields.cnotes" />
          </label>
          </div>
        </div>
        <div class="flex-grid">
          <label class="col">Address:
            <span>{{ custFields.address }}</span>
          </label>
          <label class="col">Email:
            <span>{{ custFields.email }} </span>
          </label>
          <label class="col">Phone:
            <span>{{ custFields.phone }}</span>
          </label>
        </div>
        <div class="flex-grid-halfs">
          <label class="col">Customer Club:
            <span>{{ custFields.club }}</span>
          </label>
          <label class="col">Boat Port:
            <input type="text" name="boat_home" v-model="quoteFields.boat_home" />
          </label>
        </div>
        <div class="flex-grid-halfs">
          <label class="col">Boat Model:
            <input type="text" name="boat_model" v-model="quoteFields.boat_model" />
          </label>
          <label class="col">Boat Name:
            <input type="text" name="boat_name" v-model="quoteFields.boat_name" />
          </label>
        </div>
        <div class="flex-grid-halfs">
          <div class="col">
            <p>Quote Type:</p>
            <input class="status_input" type="checkbox" name="new_sail" value="new sail"  v-model="quoteFields.quote_type" />
              New Sail
            <input class="status_input" type="checkbox" name="sail_repair" value="sail repair" v-model="quoteFields.quote_type" />
              Sail Repair
            <input class="status_input" type="checkbox" name="winter_service" value="winter service" v-model="quoteFields.quote_type" />
              Winter Service
            <br/>
            <input class="status_input" type="checkbox" name="sail_cover" value="sail cover" v-model="quoteFields.quote_type" />
              Sail Cover
            <input class="status_input" type="checkbox" name="other" value="other" v-model="quoteFields.quote_type" />
              Other
          </div>
          <div v-if="isEditing" class="col">
            <p>Status:</p>
            <input class="status_input" type="radio" name="status" value="quote request" v-model="quoteFields.status" />
              Quote Request
            <input class="status_input" type="radio" name="status" value="pending" v-model="quoteFields.status" />
              Pending
            <input class="status_input" type="radio" name="status" value="production" v-model="quoteFields.status" />
              Production
            <br/>
            <input class="status_input" type="radio" name="status" value="ready" v-model="quoteFields.status" />
              Ready
            <input class="status_input" type="radio" name="status" value="follow up" v-model="quoteFields.status" />
              Follow Up
            <input class="status_input" type="radio" name="status" value="delivered" v-model="quoteFields.status" />
              Delivered
            <input class="status_input" type="radio" name="status" value="no sale" v-model="quoteFields.status" />
              No Sale
          </div>
        </div>
        <div class="flex-grid-halfs">
          <label class="col">Sail Request:
            <textarea cols="60" rows="5"  name="sail_request" v-model="quoteFields.sail_request" />
          </label>
          <label class="col">Pick Up/Drop Off:
            <input type="text" name="pick_drop" v-model="quoteFields.pick_drop" />
          </label>
        </div>
        <div class="flex-grid-quarters">
          <label class="col">Battens:
            <input type="text" name="battens" v-model="quoteFields.battens" />
          </label>
          <label class="col">Reefing Points:
            <input type="number" name="reefing_pts" v-model="quoteFields.reefing_pts" />
          </label>
          <label class="col">Furling System:
            <input type="text" name="furl_sys" v-model="quoteFields.furl_sys" />
          </label>
          <label class="col">Numbers/Logo:
            <input type="text" name="num_logo" v-model="quoteFields.num_logo" />
          </label>
          <label class="col">UV Color:
            <input type="text" name="uv_color" v-model="quoteFields.uv_color" />
          </label>
        </div>
        <div class="flex-grid-halfs">
          <div>
            <label class="col">Sailing Type:
              <textarea cols="60" rows="5" name="notes" v-model="quoteFields.sailing_type" />
            </label>
          </div>
          <div class="col">
            <label class="col">Additional Notes:
              <textarea cols="60" rows="5" name="notes" v-model="quoteFields.notes" />
            </label>
          </div>
        </div>
      </form>
    </div>
    <button type="button" class="btn btn-primary"
      @click="isEditing ? updateQuote() : createQuote()"
      :disabled="!allowSubmitForm">{{ headerText }}</button>
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
    </button>
    <label v-if="isEditing" style="margin-left: 50px">Get File With Price:<input type="file" ref="fileInput" class="btn btn-primary"
      @change="getPrice()" /></label -->
  </div>
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
.div {
  margin: 50px 28px;
}

label {
  margin-right: 5px;
}

.flex-grid {
  display: flex;
  margin-bottom: 15px;
}

.flex-grid .col {
  flex: 1;
  margin-bottom: 15px;
}

.flex-grid-halfs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.flex-grid-halfs .col {
  .width: 45%;
  margin-bottom: 15px;
}

.flex-grid-halfs .col-align {
  .width: 45%;
  margin-bottom: 15px;
  flex-direction: column;
}

.flex-grid-thirds {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.flex-grid-thirds .col {
  .width: 33%;
  margin-bottom: 15px;
}

.flex-grid-quarters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.flex-grid-quarters .col {
  .width: 25%;
  margin-bottom: 15px;
}

.input_holder {
  position: relative;
}

input[type=text] {
    background: transparent;
    border: none;
    border-bottom: 1px solid #000000;
}

input[type=number] {
    background: transparent;
    border: none;
    border-bottom: 1px solid #000000;
}

input[type=checkbox] {
  margin: 0px 10px;
}

.radio {
  margin: 0px 10px;
  display: inline-block;
}

.textarea {
  display: flex;
  flex-direction: column;
}

.status_input {
  margin-left: 15px;
}
</style>
