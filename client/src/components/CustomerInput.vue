<template>
  <div class="container">
    <h1>{{ headerText }}</h1>
    <br />
      <form>
        <div class="flex-grid-halfs">
          <label class="col">First Name
            <input type="text" name="fname" v-model.trim="custFields.fname" />
          </label>
          <label class="col">Last Name
            <input type="text" name="lname" v-model.trim="custFields.lname" />
          </label>
        </div>
        <div class="flex-grid">
          <label class="col">Address
            <input type="text" size="60" name="address" v-model="custFields.address" />
          </label>
        </div>
        <div class="flex-grid-halfs">
          <label class="col">Email
            <input type="text" size="15" name="email" v-model.trim="custFields.email" />
          </label>
          <label class="col">Phone
            <input type="text" size="15" name="phone" v-model="custFields.phone" />
          </label>
        </div>
        <div class="flex-grid-halfs">
          <div class="col">
            <label>Customer Club
              <select name="club" @change="checkForOther($event)" v-model="custFields.club">
                <option v-for="option in selectOptions" :key="option.id">
                  {{ option.name }}
                </option>
                <option value='other'>Other</option>
              </select>
            </label>
            <label v-if="needOtherClub">Specify Club 
              <input type="text" size="20" v-model="otherClubValue" />
            </label>
            </div>
            <div class="col">
              <label>Boat Port
                <select name="port" @change="checkForOther($event)" v-model="custFields.boat_home">
                  <option v-for="option in selectOptions" :key="option.id">
                    {{ option.name }}
                  </option>
                  <option value='other'>Other</option>
                </select>
              </label>
              <label v-if="needOtherPort">Specify Port
                <input type="text" size="20" v-model="otherPortValue" />
              </label>
            </div>
          </div>
        <div class="flex-grid-halfs">
          <label class="col">Boat Model:
            <input type="text" name="boat_model" v-model="custFields.boat_model"/>
          </label>
          <label class="col">Boat Name:
            <input type="text" name="boat_name" v-model="custFields.boat_name" />
          </label>
        </div>
        <div class="flex-grid">
          <label>Customer Notes:</label>
          <textarea cols="60" rows="5" name="notes" v-model="custFields.cnotes" />
        </div>
      </form>
      <button type="button" class="btn btn-primary"
        @click="isEditing ? updateCustomer() : createCustomer()"
        :disabled="!allowSubmitForm">{{ headerText }}</button>
      <button type="button" class="btn btn-primary"
        @click="cancel()">Cancel</button>
      <!-- button type="button" class="btn btn-primary"
        @click="checkoutput()"
        :disabled="!allowSubmitForm">Check Sanity</button>
      <button type="button" class="btn btn-primary"
        @click="checkForChanges()">Check Changes</button -->
  </div>
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'customerForm',
  props: [ 'atomic', 'edit_payload' ],
  data () {
    return {
      selectOptions: null,
      isEditing: false,
      form: {},
      singleOp: false,
      needOtherClub: false,
      otherClubValue: null,
      needOtherPort: false,
      otherPortValue: null,
      origCustFields: {},
      custFields: {
        fname: null,
        lname: null,
        address: null,
        phone: null,
        email: null,
        club: null,
        boat_home: null,
        boat_model: null,
        boat_name: null,
        cnotes: null
      }
    }
  },
  computed: {
    allowSubmitForm: function () {
      return Object.values(this.custFields).some(this.hasValue)
    },
    headerText: function () {
      return this.isEditing ? 'Update Customer' : 'Create Customer'
    }
  },
  methods: {
    checkForChanges () {
      var changeLog = {}
      for (var key in this.custFields) {
        if (key === 'club') {
          if (this.needOtherClub && this.otherClubValue !== this.origCustFields[key]) {
            changeLog[key] = (this.otherClubValue) ? this.otherClubValue.trim() : 'Unspecified'
          } else if (!this.needOtherClub && this.custFields[key] !== this.origCustFields[key]) {
            changeLog[key] = this.custFields[key].trim()
          }
        } else if (key === 'boat_home') {
          if (this.needOtherPort && this.otherPortValue !== this.origCustFields[key]) {
            changeLog[key] = (this.otherPortValue) ? this.otherPortValue.trim() : 'Unspecified'
          } else if (!this.needOtherPort && this.custFields[key] !== this.origCustFields[key]) {
            changeLog[key] = this.custFields[key].trim()
          }
        } else {
          if (this.origCustFields[key] !== this.custFields[key]) {
            changeLog[key] = (this.custFields[key].constructor === String) ? this.custFields[key].trim() : this.custFields[key]
          }
        }
      }
      // console.log(changeLog)
      return changeLog
    },
    cancel () {
      if (this.isEditing) {
        this.$router.push({name: 'CustomerProfile', params: {'payload': this.customer}})
      } else {
        this.$router.push({name: 'Customers'})
      }
    },
    checkoutput () {
      let data = {}

      for (var key in this.custFields) {
        var inputValue = this.custFields[key]
        if (inputValue) {
          if (inputValue === 'other') {
            data[key] = (key === 'club') ? this.otherClubValue : this.otherPortValue
          } else {
            data[key] = inputValue
          }
        }
      }

      let payload = data
      console.log(payload)
    },
    checkForOther (event) {
      if (event.target.value === 'other') {
        if (event.target.name === 'club') {
          this.needOtherClub = true
        } else if (event.target.name === 'port') {
          this.needOtherPort = true
        }
      } else {
        if (event.target.name === 'club') {
          this.needOtherClub = false
          this.otherClubValue = ''
          this.custFields.club = event.target.value
        } else if (event.target.name === 'port') {
          this.needOtherPort = false
          this.otherPortValue = ''
          this.custFields.boat_home = event.target.value
        }
      }
    },
    async updateCustomer () {
      let data = this.checkForChanges()

      if (Object.keys(data).length) {
        let payload = {
          criteria: {'_id': this.customer._id},
          update: data}

        var response = await AuthenticationService.customerUpdate(payload)
        this.customer = response.data
        this.clearInputs()
        this.$router.push({ name: 'CustomerProfile', params: {'payload': this.customer} })
      } else {
        var message = 'No values have been changed!\nChange a value before updating or Cancel'
        let options = {
          okText: 'Understood',
          animation: 'fade'
        }

        this.$dialog
          .alert(message, options)
          .then(function () {
            console.log('Cancelling!')
          })
      }
    },
    async createCustomer () {
      let data = {}

      for (var key in this.custFields) {
        var value = this.custFields[key]
        if (key === 'club' && this.needOtherClub) {
          data[key] = (this.otherClubValue) ? this.otherClubValue.trim() : 'Unspecified'
        } else if (key === 'boat_home' && this.needOtherPort) {
          data[key] = (this.otherPortValue) ? this.otherPortValue.trim() : 'Unspecified'
        } else if (value) {
          data[key] = (value.constructor === String) ? value.trim() : value
        }
      }

      let payload = data
      this.clearInputs()

      var response = await AuthenticationService.customerCreate(payload)
      var customer = response.data
      if (this.singleOp) {
        this.$router.push({ name: 'Customers' })
      } else {
        this.$router.push({ name: 'QuoteCreate', params: {'create_payload': customer} })
      }
    },
    hasValue (value) {
      return value != null &&
        value !== undefined &&
        value !== ''
    },
    async loadInputs () {
      let response = await AuthenticationService.portList()
      var ports = response.data
      this.selectOptions = ports
      for (var x = 0; x < this.selectOptions.length; x++) {
        this.selectOptions[x].id = x;
      }

      if (this.isEditing) {
        for (var key in this.custFields) {
          if (['club', 'boat_home'].includes(key)) {
            var scan = (par) => par.name === this.customer[key]

            if (!ports.some(scan)) {
              this.custFields[key] = 'other'
              this.origCustFields[key] = this.customer[key]
              if (key === 'club') {
                this.otherClubValue = this.customer[key]
                this.needOtherClub = true
              } else if (key === 'boat_home') {
                this.otherPortValue = this.customer[key]
                this.needOtherPort = true
              }
              continue
            }
          }
          this.custFields[key] = this.customer[key]
          this.origCustFields[key] = this.customer[key]
        }
      }
    },
    clearInputs () {
      for (var key in this.custFields) {
        this.custFields[key] = null
        if (this.otherClubValue) {
          this.otherClubValue = ''
        }
      }
    }
  },
  mounted () {
    if (this.atomic) {
      this.singleOp = this.atomic
    }
    if (this.edit_payload) {
      this.isEditing = true
      this.customer = this.edit_payload
    }
    this.loadInputs()
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
  margin-bottom: 10px;
}

.flex-grid .col {
  flex: 1;
  margin-bottom: 10px;
}

.flex-grid-halfs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.flex-grid-halfs .col {
  .width: 45%;
  margin-bottom: 10px;
}

.flex-grid-thirds {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.flex-grid-thirds .col {
  .width: 33%;
  margin-bottom: 10px;
}

.flex-grid-quarters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.flex-grid-quarters .col {
  .width: 25%;
  margin-bottom: 10px;
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
</style>
