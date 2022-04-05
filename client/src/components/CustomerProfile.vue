<template>
  <div v-if="!isFetching" class="container">
    <div class="card">
      <div class="flex-grid">
        <span class="col hilite">Profile for {{ customer_data.fname }} {{ customer_data.lname }}</span>
      </div>
      <hr />
      <div class="flex-grid">
        <span class="col">Address: {{ customer_data.address }}</span>
      </div>
      <div class="flex-grid-halfs">
        <span class="col">
          Email:
          <router-link :to="{ name: 'CreateMessage', params: { 'targets': [customer_data.email], 'caller': ['CustomerProfile', callerName], 'cbdata': customer_data} }">
            {{ customer_data.email }}
          </router-link>
        </span>
        <span class="col">Phone: {{ customer_data.phone }}</span>
      </div>
      <hr />
      <div class="flex-grid">
        <span class="col">Club: {{ customer_data.club }}</span>
      </div>
      <div class="flex-grid">
        <span class="col">Home Port: {{ customer_data.boat_home }}</span>
      </div>
      <div class="flex-grid-halfs">
        <span class="col">Boat Name: {{ customer_data.boat_name }}</span>
        <span class="col">Boat Type: {{ customer_data.boat_model }}</span>
      </div>
      <hr />
      <div class="flex-grid">
        <span class="col" style="white-space: pre-wrap;">Customer Notes:<br/>  {{ customer_data.cnotes }}</span>
      </div>
      <hr />
      <p>
        <button class="edit_btn" @click="timeToEdit()">Edit</button>
        <button class="create_btn" @click="createQuote()">Create Request</button>
        <button class="request_btn" @click="seeQuotes()">Requests</button>
        <button class="delete_btn" @click="deleteCustomer()">Delete</button>
        <button @click="goBack()">Back</button>
      </p>
    </div>     
  </div>
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'customerProfile',
  props: ['payload', 'caller'],
  data () {
    return {
      customer_data: null,
      isEditing: false,
      callerName: 'Customers',
      isFetching: true
    }
  },
  computed: {
    allowSubmitForm: function () {
      return this.inputFields.some(this.hasValue)
    },
    multilineData: function (dataString) {
      console.log(dataString)
      var result = dataString
      if (dataString != null) {
        result = dataString.replace('\n', '<br/>')
      } else {
        result = ''
      }
      return result
    }
  },
  methods: {
    timeToEdit () {
      this.$router.replace({ name: 'CustomerEdit', params: { 'edit_payload': this.customer_data } })
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
      let payload = this.customer_data
      this.$router.replace({ name: 'QuoteCreate', params: {'create_payload': payload} })
    },
    seeQuotes () {
      this.$router.replace({ name: 'CustomerQuotes', params: { 'payload': this.customer_data } })
    },
    async deleteCustomer () {
      let message = {
        title: 'Delete Customer',
        body: `Deleting this customer will also delete their ${this.customer_data.quotes.length} request(s)!<p><strong>This action cannot be undone! Are you sure?</strong></p>`
      }

      let options = {
        html: true,
        okText: 'I\'m Sure! Delete!',
        cancelText: 'Cancel',
        animation: 'fade',
        type: 'hard',
        verification: 'delete'
      }

      let customer = this.customer_data
      let leavePage = this.goBack

      this.$dialog
        .confirm(message, options)
        .then(async function () {
          let payload = {
            'customer': customer
          }
          let response = await AuthenticationService.customerDelete(payload)

          if (response.status === 200) {
            leavePage()
          } else {
            console.log(response.message)
          }
        })
        .catch(function () {
          console.log('Clicked on cancel')
        })
    },
    goBack () {
      if (['Quotes', 'Customers', 'StaffList'].includes(this.callerName)) {
        this.$router.replace({name: this.callerName})
      } else {
        this.$router.replace({ name: this.callerName[0], params: { 'payload': this.customer, 'caller': this.callerName.splice(1) } })
      }
    }
  },
  mounted () {
    if (this.payload) {
      this.customer_data = this.payload
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
  max-width: 900px;
  width: 80%;
  margin: auto;
  background-color: #F5F5DC;
  font-size: 19px;
}

.flex-grid {
  display: flex;
}

.flex-grid .col {
  flex: 1;
}

.flex-grid-halfs {
  display: flex;
  justify-content: space-between;
}

.flex-grid-halfs .col {
  .width: 45%;
}

hr.solid {
  border-top: 3px solid #bbb;
  width: 80%;
  margin: auto;
}

.hilite {
  font-weight: bold;
  font-size: 40px; 
}

span {
  color: #000081;
  font-size: 30px; 
}

button {
  margin: 5px 5px;
  border-radius: 25px;
  font-weight: bold;
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
