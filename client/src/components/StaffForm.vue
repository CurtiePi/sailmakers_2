<template>
  <div class="container">
    <h1>{{ headerText }}</h1>
    <br />
      <form>
        <div class="flex-grid-halfs">
          <label class="col">First Name
            <input type="text" name="fname" v-model="staffFields.fname" />
          </label>
          <label class="col">Last Name
            <input type="text" name="lname" v-model="staffFields.lname" />
          </label>
        </div>
        <div class="flex-grid-halfs">
          <label class="col">Email
            <input type="text" size="15" name="email" v-model="staffFields.email" />
          </label>
          <label class="col">Phone
            <input type="text" size="15" name="phone" v-model="staffFields.phone" />
          </label>
        </div>
        <div class="flex-grid">
          <label class="col">Get Email:
            <input type="checkbox" name="get_email" v-model="staffFields.get_mail"/>
          </label>
        </div>
      </form>
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
      return this.isEditing ? 'Update Salesperson' : 'Create Salesperson'
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
        this.$router.push({name: 'StaffProfile', params: {'payload': this.salesperson}})
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
      this.$router.push({ name: 'StaffProfile', params: {'payload': this.salesperson} })
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
      this.salesperson = this.edit_payload
      this.loadInputs()
    }
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
