<template>
<div class="page-wrapper bg-red p-t-180 p-b-100 font-robo">                      
        <div class="wrapper wrapper--w960">                                          
            <div class="card card-2">                                                
                <div class="card-heading">                                     
    <h1>{{ headerText }}</h1>
</div>
                <div class="card-body">
        <form class="form-style-7">
            <div class="row col-md-12">
                <div class="col-md-6">
            <ul>
                <li> 
                    <label for="name">First Name</label>
                    <input type="text" name="fname" maxlength="100"
                        v-model.trim="custFields.fname" />
                    <span>Enter first name here</span>
                </li>
                <li>
                    <label for="phone">Phone</label>
                    <input type="text" name="phone" maxlength="100"
                        v-model="custFields.phone" />
                    <span>Enter a phone number</span>
                </li>
                <li>
                    <label for="address">Address</label>
                    <input type="text" name="address" style={width:100%;} maxlength="100"
                        v-model="custFields.address" />
                    <span>Enter an address</span>
                </li>
            </ul>
                </div>
                <div class="col-md-6">
            <ul>
                <li>
                    <label for="name">Last Name</label>
                    <input type="text" name="lname" maxlength="100"
                        v-model.trim="custFields.lname" />
                    <span>Enter last name here</span>
                </li>
                <li>
                    <label for="email">Email</label>
                    <input type="email" name="email" maxlength="100"
                        v-model.trim="custFields.email" />
                    <span>Enter a valid email address</span>
                </li>
            </ul>
                </div>
                <div class="col-md-6">
            <ul>
                <li>
                    <label for="club">Club</label>
                    <select name="club" @change="checkForOther($event)" v-model="custFields.club">
                <option v-for="option in selectOptions" :key="option.id">
                  {{ option.name }}
                </option>
                <option value='other'>Other</option>
              </select>
                    <span>Select a club</span>
                </li>
                <li v-if="needOtherClub">
                    <label for="otherClub">Other Club</label>
                    <input type="text" size="20" v-model="otherClubValue" />
                    <span>Specify club name</span>
                </li>
                <li>
                    <label for="boat_name">Boat Name</label>
                    <input type="text" name="boat_name" maxlength="100"
                        v-model="custFields.boat_name" />
                    <span>Enter a boat name</span>
                </li>
                <li>
                    <label for="notes">Customer Notes</label>
                    <textarea cols="60" name="notes"
                         @keyup="adjustTextarea"
                         ref="bio"
                         v-model="custFields.cnotes" />
                    <span>Enter notes about the customer</span>
                </li>
            </ul>
                </div>
                <div class="col-md-6">
            <ul>
                <li>
                    <label for="port">Boat Port</label>
                <select name="port" @change="checkForOther($event)" v-model="custFields.boat_home">
                  <option v-for="option in selectOptions" :key="option.id">
                    {{ option.name }}
                  </option>
                  <option value='other'>Other</option>
                </select>
                    <span>Select a port</span>
                </li>
                <li v-if="needOtherPort">
                    <label for="otherClub">Other Port</label>
                    <input type="text" size="20" v-model="otherPortValue" />
                    <span>Specify port name</span>
                </li>
                <li>
                    <label for="boat_model">Boat Model</label>
                    <input type="text" name="boat_model" maxlength="100"
                        v-model="custFields.boat_model"/>
                    <span>Enter a boat model</span>
                </li>
            </ul>
                </div>
            </div>
        </form>
<button type="button" class="btn btn-primary"
        @click="isEditing ? updateCustomer() : createCustomer()"
        :disabled="!allowSubmitForm">{{ headerText }}</button>
      <button type="button" class="btn btn-primary"
        @click="cancel()">Cancel</button>
            </div>
        </div>
    </div>
    <br />
      <!-- form>
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
      <button type="button" class="btn btn-primary"
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
      return this.isEditing ? 'Edit Customer' : 'Add New Customer'
    }
  },
  methods: {
    adjustTextarea () {
      this.$refs.bio.style.height = "20px"
      this.$refs.bio.style.height = (this.$refs.bio.scrollHeight) + "px"
    }, 
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
.form-style-7 div {
	margin-top:5px;
	margin-bottom:35px;
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
/* ==========================================================================
   #CARD
   ========================================================================== */
.card {
  overflow: hidden;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  background: #fff;
}

.card-2 {
  -webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  width: 100%;
  display: table;
}

.card-2 .card-heading {
  background: url('~@/assets/images/sailboat_one.jpg') top left/cover no-repeat;
  width: 29.1%;
  display: table-cell;
}

.card-2 .card-body {
  display: table-cell;
  padding: 80px 90px;
  padding-bottom: 88px;
}

@media (max-width: 767px) {
  .card-2 {
    display: block;
  }
  .card-2 .card-heading {
    width: 100%;
    display: block;
    padding-top: 300px;
    background-position: left center;
  }
  .card-2 .card-body {
    display: block;
    padding: 60px 50px;
  }
}

</style>
