<template>
  <section>
      <div class="left-panel">
        <span class="header mx-4 mt-5"><h1>{{ headerText }}</h1></span>
      </div>
      <div class="right-panel">
        <form class="form-style-7">
          <div class="row col-md-12 mt-3">
            <div class="col-md-6 ms-auto">
              <ul>
                <li> 
                  <label class="col">First Name</label>
                  <input type="text" name="fname" v-model="staffFields.fname" />
                  <span>Enter First Name</span>
                </li>
              </ul>
            </div>
            <div class="col-md-6 me-auto">
              <ul>
                <li> 
                  <label class="col">Last Name</label>
                  <input type="text" name="lname" v-model="staffFields.lname" />
                  <span>Enter First Name</span>
                </li>
              </ul>
            </div>
            <div class="col-md-6 ms-auto mt-4">
              <ul>
                <li> 
                  <label class="col">Email</label>
                  <input type="text" size="15" name="email" v-model="staffFields.email" />
                  <span>Email</span>
                </li>
              </ul>
            </div>
            <div class="col-md-6 me-auto mt-4">
              <ul>
                <li> 
                  <label class="col">Phone</label>
                  <input type="text" size="15" name="phone" v-model="staffFields.phone" />
                  <span>Phone</span>
                </li>
              </ul>
            </div>
            <div class="col-md-2 mt-4 mx-auto">
              <ul>
                <li> 
                  <label class="col">Get Email</label>
                  <input type="checkbox" name="get_email" v-model="staffFields.get_mail"/>
                  <span>Automatically Get Email</span>
                </li>
              </ul>
            </div>
            <div class="d-inline mt-4">
              <button type="button" class="btn btn-primary"
                @click="isEditing ? updateSalesperson() : createSalesperson()"
                :disabled="!allowSubmitForm">{{ headerText }}</button>
              <button type="button" class="btn btn-primary"
                @click="cancel()">Cancel</button>
              <button type="button" class="btn btn-primary"
                @click="checkoutput()"
                :disabled="!allowSubmitForm">Check Sanity</button>
              <button type="button" class="btn btn-primary"
                @click="checkForChanges()">Check Changes</button>
            </div>
          </div>
        </form>
      </div>
  </section>
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'StaffForm',
  props: [ 'edit_payload' ],
  data () {
    return {
      salesperson: null,
      origStaffFields: {
        fname: null,
        lname: null,
        phone: null,
        email: null,
        get_mail: false
      },
      isEditing: false,
      form: {},
      staffFields: {
        fname: null,
        lname: null,
        phone: null,
        email: null,
        get_mail: false
      }
    }
  },
  computed: {
    allowSubmitForm: function () {
      return Object.values(this.staffFields).some(this.hasValue)
    },
    headerText: function () {
      return this.isEditing ? 'Update Staff' : 'Create Staff'
    }
  },
  methods: {
    checkForChanges () {
      var changeLog = {}
      console.log('Check for changes')
      for (var key in this.staffFields) {
        if (this.origStaffFields[key] !== this.staffFields[key]) {
          changeLog[key] = this.staffFields[key]
        }
      }
      console.log(changeLog)
      return changeLog
    },
    cancel () {
      if (this.isEditing) {
        this.$router.push({ name: 'StaffProfile', params: {'payload': JSON.stringify(this.salesperson) } })
      } else {
        this.$router.push({name: 'StaffList'})
      }
    },
    checkoutput () {
      let data = {}

      for (var key in this.staffFields) {
        console.log(`key: ${key} Value: ${this.staffFields[key]}`)
        var inputValue = this.staffFields[key]
        if (inputValue) {
          data[key] = inputValue
        }
      }

      let payload = data
      console.log(payload)
    },
    async updateSalesperson () {
      let data = this.checkForChanges()
      let payload = {
        criteria: {'_id': this.salesperson._id},
        update: data}

      console.log('Updating salesperson')
      console.log(payload)
      var response = await AuthenticationService.updateSalesperson(payload)
      this.salesperson = response.data
      this.clearInputs()
      this.$router.push({ name: 'StaffProfile', params: {'payload': JSON.stringify(this.salesperson) } })
    },
    async createSalesperson () {
      let data = {}

      for (var key in this.staffFields) {
        data[key] = this.staffFields[key]
      }

      let payload = data
      this.clearInputs()

      await AuthenticationService.createSalesperson(payload)
      this.$router.push({ name: 'StaffList' })
    },
    hasValue (value) {
      return value != null &&
        value !== undefined &&
        value !== ''
    },
    loadInputs () {
      for (var key in this.staffFields) {
        console.log(key)
        this.staffFields[key] = this.salesperson[key]
        this.origStaffFields[key] = this.salesperson[key]
      }
    },
    clearInputs () {
      for (var key in this.staffFields.length) {
        this.staffFields[key] = null
      }
    }
  },
  mounted () {
    if (this.edit_payload) {
      console.log('Editing')
      this.isEditing = true
      this.salesperson = JSON.parse(this.$route.params.edit_payload)
      this.loadInputs()
    }
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
