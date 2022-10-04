<template>
  <div class="container">
    <div v-if="isFetching" className="col-12">
      <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
      <p>Loading . . .</p>
    </div>
    <div v-else class="card">
      <div class="flex-grid">
        <span class="col hilite">Profile for {{ salesperson.fname }} {{ salesperson.lname }}</span>
      </div>
      <hr />
      <div class="flex-grid-halfs">
        <span class="col">Email: 
          <router-link :to="{ name: 'CreateMessage', params: { 'targets': [salesperson.email], 'caller': ['StaffProfile', callerName], 'cbdata': salesperson} }">
            {{ salesperson.email }}
          </router-link>
        </span>
        <span class="col">Phone: {{ salesperson.phone }}</span>
      </div>
      <hr />
      <div class="flex-grid">
        <span class="col">Receive Quote Email: {{ (salesperson.get_mail) ? 'Yes' : 'No' }}</span>
      </div>
      <p>
        <button v-if="salesperson.isActive" @click="editSalesperson()">Edit</button>
        <button v-if="salesperson.isActive" @click="deleteSalesperson()">Delete</button>
        <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
        <button @click="goBack()">Back</button>
      </p>
    </div>     
  </div>
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'

export default {
  name: 'staffProfile',
  components: { ConfirmDialogue },
  props: ['payload', 'caller'],
  data () {
    return {
      salesperson: null,
      callerName: 'StaffList',
      isFetching: true
    }
  },
  methods: {
    editSalesperson () {
      this.$router.push({ name: 'StaffEdit', params: { 'edit_payload': JSON.stringify(this.salesperson) } })
    },
    async deleteSalesperson () {

      let name = `${this.salesperson.fname} ${this.salesperson.lname}`

      let options = {
        title: `Delete ${name}`,
        okButton: 'I\'m Sure! Delete!',
        cancelButton: 'Cancel',
        message: `Deleting ${name} is an action that<strong> cannot be undone!&nbsp;Are you sure?</strong>`,
        verification: 'delete'
      }


      const ok = await this.$refs.confirmDialogue.show(options)
      if (ok) {
        var payload = {
         'criteria': {
            '_id': this.salesperson._id
         },
         'update': {
            'isActive': false,
            'get_mail': false
         }
        }
        let response = await AuthenticationService.deleteSalesperson(payload)
        this.goBack()

        if (response.status === 200) {
          this.goBack()
        } else {
          console.log(`Response: ${response.message}`)
        }
      } else {
        console.log('You have chosen not to delete this salesperson!!')
      }

    },
    goBack () {
      if (['Quotes', 'Customers', 'StaffList'].includes(this.callerName)) {
        this.$router.replace({name: this.callerName})
      } else {
        this.$router.replace({ name: this.callerName, params: { 'payload': JSON.stringify(this.salesperson) } })
      }
    }
  },
  mounted () {
    if (this.payload) {
      this.salesperson = JSON.parse(this.$route.params.payload)
      console.log(this.salesperson)
      this.isFetching = false
    }
    if (this.caller) {
      this.callerName = this.caller
    }
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
}

button:hover, a:hover {
  opacity: 0.7;
}

</style>
