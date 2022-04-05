<template>
  <div class="container">
    <h1>Edit Quote</h1>
    <br />
    <div class="row">
      <form>
        <div class="column" v-for="(input, index) in inputFields" 
          :key="index">
          <div v-if="!['submit', 'textarea', 'checkbox', 'select'].includes(input.type)">
            <label>{{ input.label }}</label>
            <input
              class="input is-large"
              :type="input.type"
              :name="input.name.toLowerCase()"
              v-model="input.value" />
          </div>
          <div v-else-if="input.type == 'textarea'">
            <label>{{ input.label }}</label>
            <textarea
              class="textarea"
              :cols="input.cols"
              :rows="input.rows"
              :type="input.type"
              :name="input.name.toLowerCase()"
              v-model="input.value" />
          </div>
          <div v-else-if="input.type == 'select'">
            <label>{{ input.label }}</label>
            <select
              class="multiselect-ui form-control" multiple="multiple"
              :name="input.name.toLowerCase()"
              :id="input.name.toLowerCase()"
              @change="checkForOther($event)"
              v-model="input.value">
              <option value="" disabled selected>Choose {{ input.label }}</option>
              <option v-for="option in input.options">
                {{ option.name }}
              </option>
            </select>
          </div>
          <div class="row" v-else-if="input.type == 'checkbox'">
            <p>{{ input.label }}</p>
            <div class="check" v-for="(option, index) in input.options" :key="index">
              <input type="checkbox" :value="option.name" @change="setType($event)" :id="key">
              <label>{{ option.name }}</label>
            </div>
          </div>
        </div>
      </form>
    </div>
    <button type="button" class="btn btn-primary"
      @click="createQuote()"
      :disabled="!allowSubmitForm">Create Customer</button>
    <button type="button" class="btn btn-primary"
      @click="checkoutput()"
      :disabled="!allowSubmitForm">Check Sanity</button>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import quoteInputs from '@/assets/quoteInputs'

export default {
  name: 'createQuote',
  props: ['payload'],
  data () {
    return {
      inputFields: [],
      customer: null,
      form: {},
      quote_type: []
    }
  },
  computed: {
    allowSubmitForm: function () {
      return this.inputFields.some(this.hasValue)
    }
  },
  methods: {
    checkoutput () {
      let data = {}

      console.log(this.inputFields)

      for (var idx = 0; idx < this.inputFields.length; idx++) {
        var inputField = this.inputFields[idx]
        if (this.hasValue(inputField) && inputField.name !== 'customer') {
          if (inputField.value === 'other') {
            data[inputField.name] = this.otherValue
          } else {
            data[inputField.name] = inputField.value
          }
        }
      }

      data['quote_type'] = this.quote_type
      data['customer_id'] = this.customer._id
      let salesperson = JSON.parse(localStorage.sp)
      data['salesperson_id'] = salesperson._id

      let payload = data
      console.log(payload)
    },
    async createQuote () {
      let data = {}

      console.log(this.inputFields)

      for (var idx = 0; idx < this.inputFields.length; idx++) {
        var inputField = this.inputFields[idx]
        if (this.hasValue(inputField) && inputField.name !== 'customer') {
          data[inputField.name] = inputField.value
        }
      }
      data['quote_type'] = this.quote_type
      data['customer_id'] = this.customer._id
      let salesperson = JSON.parse(localStorage.sp)
      data['salesperson_id'] = salesperson._id

      let payload = data

      await AuthenticationService.quoteCreate(payload)
      this.clearInputs()
      this.$router.push({ name: 'QuotesList' })
    },
    hasValue (inputField) {
      return inputField.value != null &&
        inputField.value !== undefined &&
        inputField.value !== ''
    },
    setType (event) {
      if (event.target.checked) {
        this.quote_type.push(event.target.value)
      } else {
        this.quote_type = this.quote_type.filter((ele) => { return ele !== event.target.value })
      }
    },
    prepareInputs () {
      for (var idx in this.inputFields) {
        switch (this.inputFields[idx].name) {
          case 'customer':
            this.inputFields[idx].value = `${this.customer.fname} ${this.customer.lname}`
            break
          case 'phone':
            this.inputFields[idx].value = this.customer.phone
            break
          case 'address':
            this.inputFields[idx].value = this.customer.address
            break
          case 'email':
            this.inputFields[idx].value = this.customer.email
            break
          case 'boat_type':
            this.inputFields[idx].value = this.customer.boat_model
            break
          case 'boat_name':
            this.inputFields[idx].value = this.customer.boat_name
            break
          case 'home_port':
            this.inputFields[idx].value = this.customer.boat_home
            break
          default:
        }
      }
    },
    clearInputs () {
      for (var idx = 0; idx < this.inputFields.length; idx++) {
        var inputField = this.inputFields[idx]
        inputField.value = ''
      }
    }
  },
  mounted () {
    this.inputFields = quoteInputs.inputFields
    if (this.payload) {
      this.customer = this.payload.data
      this.prepareInputs()
    }
  }
}
</script>

<style scoped>
.column {
  float: left;
  width: 50%;
  padding: 10px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

.input_holder {
  position: relative;
}

input[type=text] {
    background: transparent;
    border: none;
    border-bottom: 1px solid #000000;
}

.check {
  margin: 0px 10px;
}

.textarea {
  vertical-align: middle;
}
</style>
