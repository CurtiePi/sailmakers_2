<template>
  <section>
    <div class="left-panel">
      <span class="header mx-4 mt-5"><h1>{{ headerText }}</h1></span>
    </div>
    <div class="right-panel">
      <form class="form-style-7">
        <div class="row col-md-12">
          <div class="col-md-5 offset-md-1">
            <ul>
              <li> 
                <label for="name">First Name</label>
                <input type="text" name="fname" maxlength="100"
                  v-model.trim="custFields.fname" />
                <span>Enter first name here</span>
              </li>
            </ul>
          </div>
          <div class="col-md-5 offset-md-1">
            <ul>
              <li> 
                <label for="name">Last Name</label>
                <input type="text" name="lname" maxlength="100"
                   v-model.trim="custFields.lname" />
                <span>Enter last name here</span>
              </li>
            </ul>
          </div>
          <div class="col-md-10 offset-md-1 mt-2">
            <ul>
              <li> 
                <label for="address">Address</label>
                <input type="text" name="address" style={width:100%;} maxlength="100"
                   v-model="custFields.address" />
                <span>Enter an address</span>
              </li>
            </ul>
          </div>
          <div class="col-md-5 offset-md-1 mt-2">
            <ul>
              <li> 
                <label for="phone">Phone</label>
                <input type="text" name="phone" maxlength="100"
                   v-model="custFields.phone" />
                <span>Enter a phone number</span>
              </li>
            </ul>
          </div>
          <div class="col-md-5 offset-md-1 mt-2">
            <ul>
              <li> 
                <label for="email">Email</label>
                <input type="email" name="email" maxlength="100"
                   v-model.trim="custFields.email" />
                <span>Enter a valid email address</span>
              </li>
            </ul>
          </div>
          <div class="col-md-5 offset-md-1 mt-2">
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
            </ul>
          </div>
          <div class="col-md-5 offset-md-1 mt-2">
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
            </ul>
          </div>
          <div class="col-md-5 offset-md-1 mt-2">
            <ul>
              <li> 
                <label for="boat_name">Boat Name</label>
                <input type="text" name="boat_name" maxlength="100"
                   v-model="custFields.boat_name" />
                <span>Enter a boat name</span>
              </li>
            </ul>
          </div>
          <div class="col-md-5 offset-md-1 mt-2">
            <ul>
              <li> 
                <label for="boat_model">Boat Model</label>
                <input type="text" name="boat_model" maxlength="100"
                   v-model="custFields.boat_model"/>
                <span>Enter a boat model</span>
              </li>
            </ul>
          </div>
          <div class="col-md-10 offset-md-1 mt-2">
            <ul>
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
          <div class="d-inline mt-2">
            <button type="button" class="btn btn-primary"
              @click="isEditing ? updateCustomer() : createCustomer()"
              :disabled="!allowSubmitForm">{{ headerText }}</button>
            <button type="button" class="btn btn-primary"
              @click="cancel()">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'customerForm',
  props: [ 'atomic', 'payload' ],
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
      return this.isEditing ? 'Edit Customer' : 'Add Customer'
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
        this.$router.replace({name: 'CustomerProfile', params: {'payload': JSON.stringify(this.customer)}})
      } else {
        this.$router.replace({name: 'Customers'})
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
        this.$router.replace({ name: 'CustomerProfile', params: {'payload': JSON.stringify(this.customer)} })
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
        this.$router.replace({ name: 'Customers' })
      } else {
        this.$router.replace({ name: 'QuoteCreate', params: {'create_payload': JSON.stringify(customer)} })
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
    if (this.payload) {
      console.log("Mounting the Customer Input!")
      this.isEditing = true
      this.customer = JSON.parse(this.$route.params.payload)
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
	max-width:800px;
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


.left-panel{
  position: fixed;
  float: left;
  height: 100vh;
  overflow:hidden;
  background: linear-gradient(to right, transparent 50%, #fff 50%), url('~@/assets/images/sailboat_one.jpg') no-repeat center;
 background-size: cover;
 width: 60%;
}

.right-panel {
  position: absolute;
  left: 25%;
  height: 100vh;
  max-width:100vw;
  width:75%;
  overflow-x: hidden;
}

.header {
  float: left;  
}
</style>
