<template>
  <div class="container">
    <div v-if="isFetching" class="col-md-12">
      <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
      <p>Loading . . .</p>
    </div>
    <div v-else class="card">
      <h2>{{ customer_data.fname }} {{ customer_data.lname }}</h2>
      <br />
      <p><i class="fa fa-home"></i>{{ customer_data.address }}</p>
      <p><i class="fa fa-phone"></i>{{ customer_data.phone }}</p>
      <p><i class="fa fa-envelope"></i>
        <router-link :to="{ name: 'CreateMessage', params: { 'targets': [customer_data.email], 'caller': ['CustomerProfile', callerName], 'cbdata': JSON.stringify(customer_data) } }">
            {{ customer_data.email }}
        </router-link>
      </p>
      <hr />
      <div class="row col-md 12">
        <div class="col-md-6">
          <p><i class="fa fa-anchor"></i>{{ customer_data.club }}</p>
          <p><i class="fa fa-house-tsunami"></i>{{ customer_data.boat_home }}</p>
          <p><i class="fa fa-id-card"></i>{{ customer_data.boat_name }}</p>
          <p><i class="fa fa-sailboat"></i>{{ customer_data.boat_model }}</p>
        </div>
        <div class="col-md-4">
          <i class="fa fa-clipboard"></i>
          <br/>
          <span class="cust-notes">{{ customer_data.cnotes }}</span>
        </div>
      </div>
      <hr />
      <div class="row buttons">
        <button class="edit_btn" @click="timeToEdit()">Edit</button>
        <button class="create_btn" @click="createQuote()">Create Request</button>
        <button class="request_btn" @click="seeQuotes()">Requests</button>
        <button class="delete_btn" @click="deleteCustomer()">Delete</button>
        <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
        <button @click="goBack()">Back</button>
      </div>
    </div>     
  </div>     
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'

export default {
  name: 'customerProfile',
  components: { ConfirmDialogue },
  props: ['payload', 'caller'],
  data () {
    return {
      customer_data: null,
      isEditing: false,
      callerName: 'Customers',
      isFetching: true 
    }
  },
  methods: {
    timeToEdit () {
      let edit_data = JSON.stringify(this.customer_data)
      this.$router.replace({ name: 'CustomerEdit', params: { 'payload': edit_data } })
    },
    async update_customer () {
      let data = {}

      for (var idx = 0; idx < this.inputFields.length; idx++) {
        var inputField = this.inputFields[idx]
        if (this.hasValue(inputField)) {
          data[inputField.name] = inputField.value
        }
      }
      let payload = {
        criteria: {'_id': this.customer_data._id},
        update: data}

      document.getElementsByClassName('editor')[0].style.display = 'none'
      let response = await AuthenticationService.customerUpdate(payload)
      this.customer_data = response.data
    },
    hasValue (inputField) {
      return inputField.value != null &&
        inputField.value !== undefined &&
        inputField.value !== ''
    },
    createQuote () {
      let payload = JSON.stringify(this.customer_data)
      this.$router.replace({ name: 'QuoteCreate', params: {'create_payload': payload} })
    },
    seeQuotes () {
      let payload_data = JSON.stringify(this.customer_data)
      this.$router.replace({ name: 'CustomerQuotes', params: { 'payload': payload_data } })
    },
    async deleteCustomer () {
      let name = `${this.customer_data.fname} ${this.customer_data.lname}`

      let options = {
        title: `Delete Customer ${name}`,
        okButton: 'I\'m Sure! Delete!',
        cancelButton: 'Cancel',
        message: `Deleting customer ${name} will also delete their ${this.customer_data.quotes.length} request(s)!<p><strong>This action cannot be undone! Are you sure?</strong></p>`,
        verification: 'delete'
      }

      const ok = await this.$refs.confirmDialogue.show(options)

      if (ok) {
        let payload = {
          'customer': this.customer_data
        }
        let response = await AuthenticationService.customerDelete(payload)

        if (response.status === 200) {
          this.goBack()
        } else {
          console.log(`Response: ${response.message}`)
        }
      } else {
        console.log('You have chosen not to delete this customer!!')
      }
    },
    goBack () {
      if (['Quotes', 'Customers', 'StaffList'].includes(this.callerName)) {
        this.$router.replace({name: this.callerName})
      } else {
        let payload = JSON.stringify(this.customer)
        this.$router.replace({ name: this.callerName[0], params: { 'payload': JSON.stringify(payload), 'caller': this.callerName.splice(1) } })
      }
    }
  },
  mounted () {
    if (this.payload) {
      this.customer_data = JSON.parse(this.$route.params.payload)
    }
    if (this.caller) {
      this.callerName = this.caller
    }
    this.isFetching = false
  }
}
</script>
<style scoped>

@media (min-width: 36em) {
  .card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    max-width: 300px;
    width: 80%;
    margin: auto;
    text-align: center;
    flex-direction: column;
    background-color: #F5F5DC;
    text-align: left;
    line-height: .9em;
    border: 1px gray solid;
    border-radius: 10px;
    -webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
    box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    padding: 5px;
    font-size: 0.5em;
  }

  .sector {
    width: 100%;
    margin: 0 auto;
    flex-direction: column;
    padding: 3px;
  }

}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 80%;
  margin: auto;
  margin-top: 10%;
  background-color: #F5F5DC;
  text-align: left;
  line-height: .9em;
  border: 1px gray solid;
  border-radius: 10px;
  -webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  max-width: 900px;
  padding: 5px;
  font-size: 1.5em;
}

.cust-notes {
    white-space: pre-wrap;
    margin-top: 5 px;
    font-size: 1.2em;
}

i {
 margin-right: 5px;
}


hr.solid {
  border-top: 3px solid #bbb;
  width: 80%;
  margin: auto;
}

button {
  margin: 5px 5px;
  border-radius: 25px;
  font-weight: bold;
  width: fit-content;
}

.buttons {
    margin: auto;
}

.edit_btn {
  background: #ffff00;
}

.create_btn {
  background: #36b0ea;
}

.request_btn {
  background: #b936ea;
}

.delete_btn {
  background: #ff0000;
}

button:hover, a:hover {
  opacity: 0.7;
}

</style>
