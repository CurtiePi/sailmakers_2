<template>
  <div class="container">
    <div v-if="isFetching" class="col-md-12">
      <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
      <p>Loading . . .</p>
    </div>
    <div v-else class="card">
      <div class="col-md-12">
        <div class="col-md-10 header-div label-clr">
          <span>{{ capitalizeFirst(quote.quote_type.join(', ')) }} Request for </span> 
          <span>{{ customer.fname }} {{ customer.lname }}</span>
          <span @click="toggleCustomerInfo()" :style="{'font-size': '8px'}">{{ toggleText }}</span>
        </div>
        <div v-if="!customerHidden" class="col-md-10 offset-md-3 customer-info-div">
          <p class="med-print"><i class="fa fa-home"></i>{{ customer.address }}</p>
          <p class="med-print"><i class="fa fa-phone"></i>{{ customer.phone }}</p>
          <p class="med-print"><i class="fa fa-envelope"></i>
            <router-link :to="{ name: 'CreateMessage', params: { 'targets': [customer.email], 'caller': ['CustomerProfile', callerName], 'cbdata': JSON.stringify(customer) } }">
              {{ customer.email }}
            </router-link>
          </p>
          <p class="med-print"><span class="label-clr">Club:</span> {{ customer.club }}</p>
        </div>
      </div>
      <div class="row align-items-start">
        <div class="col offset-md-1">
          <p class="small-print"><span class="label-clr">Status:</span> {{ capitalizeFirst(quote.status) }}</p>
        </div>
        <div class="col">
          <p class="small-print"><span class="label-clr">Created:</span> {{ formatDate(quote.createdAt) }}</p>
        </div>
        <div class="col">
          <p class="small-print"><span class="label-clr">Due:</span> {{ formatDate(quote.due_date) }}</p>
        </div>
      </div>
      <br />
      <div class="row col-md-12 offset-md-1">
          <p class="large-print"><span class="label-clr">Boat Home:</span> {{ quote.boat_home }}</p>
          <p class="large-print"><span class="label-clr">Boat Model:</span> {{ quote.boat_model }}</p>
          <p class="large-print"><span class="label-clr">Pick Up/Drop Off:</span> {{ quote.pick_drop }}</p>
      </div>
      <div class="row col-md-12">
        <div class="col-md-10 offset-md-1">
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <button class="nav-link active" id="nav-request-tab" data-bs-toggle="tab" data-bs-target="#nav-sail-request" type="button" role="tab" aria-controls="nav-sail-request" aria-selected="true">Sail Request</button>
              <button class="nav-link" id="nav-type-tab" data-bs-toggle="tab" data-bs-target="#nav-sailing-type" type="button" role="tab" aria-controls="nav-sailing-type" aria-selected="false">Sailing Type</button>
              <button class="nav-link" id="nav-notes-tab" data-bs-toggle="tab" data-bs-target="#nav-additional-notes" type="button" role="tab" aria-controls="nav-additional-notes" aria-selected="false">Additional Notes</button>
            </div>
           </nav>
           <div class="tab-content" id="nav-tabContent">
             <div class="tab-pane fade show active" id="nav-sail-request" role="tabpanel" aria-labelledby="nav-request-tab">
               <span class="col med-print" style="white-space: pre-wrap;">
                 {{ quote.sail_request }}
               </span>
             </div>
             <div class="tab-pane fade" id="nav-sailing-type" role="tabpanel" aria-labelledby="nav-type-tab">
               <span class="col med-print" style="white-space: pre-wrap;">
                 {{ quote.sailing_type }}
               </span>
             </div>
             <div class="tab-pane fade" id="nav-additional-notes" role="tabpanel" aria-labelledby="nav-notes-tab">
               <span class="col med-print" style="white-space: pre-wrap;">
                {{ quote.notes }}
               </span>
             </div>
           </div>
        </div>
      </div>
      <div v-if="showExtras" class="row col-md-12 extras-div">
        <div class="col-md-2 offset-md-1" :style="{'text-align': 'center'}">
              <h4>Battens</h4>
              <p>{{ quote.battens }}</p>
        </div>
        <div class="col-md-2" :style="{'text-align': 'center'}">
              <h4>Reefing</h4>
              <p>{{ quote.reefing_pts }}</p>
        </div>
        <div class="col-md-2" :style="{'text-align': 'center'}">
              <h4>Furling</h4>
              <p>{{ quote.furl_sys }}</p>
        </div>
        <div class="col-md-2" :style="{'text-align': 'center'}">
              <h4>Num/Logo</h4>
              <p>{{ quote.num_logo }}</p>
        </div>
        <div class="col-md-2" :style="{'text-align': 'center'}">
              <h4>UV/Color</h4>
              <p>{{ quote.uv_color }}</p>
        </div>
      </div>
      <div class="row col-md-12 finance-div">
        <div class="col-md-6 offset-md-2">
          <p class="med-print"><span class="label-clr">Price:</span> {{ quote.price }}</p>
        </div>
        <div class="col-md-4">
          <p class="med-print"><span class="label-clr">Balance Due:</span> {{ quote.quote_price - quote.amount_paid }}</p>
        </div>
      </div>
      <div v-if="haveDocs" class="row col-md-12" :style="{'margin': 35 + 'px auto'}">
        <p class="label-clr">Document(s)</p>
        <ul>
          <li class="med-print" v-for= "(doc, index) in quote.doc_path" :key="index">
              <span @click="showPdf(doc)" :style="{'margin-right': 35 + '%'}">
                {{ doc }}
              </span>
              <span>
              <a @click='emailDocument(doc)' :style="{'margin-right': 8+'px'}">
                <i class="fa fa-envelope" aria-hidden="true"></i>
              </a>
              <a @click="getFile(doc)" :style="{'margin-right': 8+'px'}">
                <i class="fa fa-download" aria-hidden="true"></i>
              </a>
              <a @click='deleteDocument(doc)' :style="{'margin-right': 2+'px'}">
                <i class="fa fa-trash" aria-hidden="true"></i>
              </a>
              </span>
          </li>
        </ul>
      </div>
      <div class="row col-md-10">
        <span class="error" v-if="errorMsg">{{ errorMsg }}</span>
        <div class="d-flex justify-content-evenly">
          <button title="Edit Quote" @click="timeToEdit()">
            <i class="fa fa-pencil" aria-hidden="true"></i>
          </button>
          <button v-if="!haveDocs" title="Create PDF" @click="printQuote()">
            <i class="fa fa-file" aria-hidden="true"></i>
          </button>
          <button title="Upload File" @click="selectFileForUpload()">
            <i class="fa fa-upload" aria-hidden="true"></i>
          </button>
          <input
            style="display:none;"
            type="file"
            ref="file"
            @change="uploadFile($event)" />
          <button title="Delete Quote" @click="deleteQuote()">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </button>
          <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
          <button @click="goBack()">Back</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'

export default {
  name: 'quoteDisplay',
  components: { ConfirmDialogue },
  props: ['payload', 'caller'],
  data () {
    return {
      quote: null,
      customer: null,
      salesperson: null,
      salesRecipients: [],
      callerName: 'Quotes',
      file: null,
      errorMsg: null,
      isFetching: true,
      toggleText: 'show',
      customerHidden: true 
    }
  },
  computed: {
    allowSubmitForm: function () {
      return this.inputFields.some(this.hasValue)
    },
    haveDocs: function () {
      return this.quote.doc_path.length > 0
    },
    showExtras: function () {
      let extras = [this.quote.battens, this.quote.reefing_pts, this.quote.furl_sys, this.quote.num_logo, this.quote.uv_color]
      let answer = extras.some((item) => {
          return item !== '' && item !== undefined && item !== null 
        })

      return answer
    }
  },
  methods: {
    timeToEdit () {
      let payload = JSON.stringify(this.quote)
      this.$router.replace({ name: 'QuoteEdit', params: { 'edit_payload': payload } })
    },
    toggleCustomerInfo () {
      this.customerHidden = !this.customerHidden
      this.toggleText = (this.customerHidden) ? 'show' : 'hide'
    },
    async showPdf (doc) {
        this.$router.replace({ name: 'QuoteViewPDF', params: {'payload': JSON.stringify(this.quote), 'caller': ['QuoteDisplay', this.callerName], 'filename': doc } })

    },
    async getFile (filename) {
      let response = await AuthenticationService.downloadFile(filename)
      
      const uriContent = window.URL.createObjectURL(new Blob([response.data]))

      const link = document.createElement('a')
      link.setAttribute('href', uriContent)
      link.setAttribute('download', filename) // any other extension
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
    async printQuote () {
      
      let payload = {
        'payload': this.quote
      }
      let response = await AuthenticationService.printQuote(payload)
      if (response.status === 200) {
        this.quote = response.data
      }
     
    },
    async deleteQuote () {

      let name = `${this.quote.customer.fname} ${this.quote.customer.lname}`

      let options = {
        title: `Delete ${name}'s Request`,
        okButton: 'I\'m Sure! Delete!',
        cancelButton: 'Cancel',
        message: `Deleting ${name}'s request will also delete all of their  associated PDFs!<p><strong>This action cannot be undone!&nbsp;Are you sure?</strong></p>`,
        verification: 'delete'
      }

      const ok = await this.$refs.confirmDialogue.show(options)
      if (ok) {
        let payload = {
          'quote': this.quote
        }
        let response = await AuthenticationService.deleteQuote(payload)

        if (response.status === 200) {
          this.goBack()
        } else {
          console.log(`Response: ${response.message}`)
        }
      } else {
        console.log('You have chosen not to delete this quote!!')
      }
    },
    emailDocument (filename) {
      let regex = new RegExp(`${this.customer.lname}_${this.customer.fname}.+\\d{4}-\\d{1,2}-\\d{1,2}.pdf`)

      if (regex.test(filename)) {
        this.$router.replace({ name: 'CreateMessage', params: { 'attachment': filename, 'targets': this.salesRecipients } })
      } else {
        this.$router.replace({ name: 'CreateMessage', params: { 'attachment': filename, 'targets': [this.quote.customer.email] } })
      }
    },
    async deleteDocument (filename) {
      var newDocPath = this.quote.doc_path.filter((value) => {
        return value !== filename
      })

      var payload = {
        'pdf_list': [filename],
        'criteria': {
          '_id': this.quote._id
        },
        'update': {
          'doc_path': newDocPath
        }
      }

      try {
        var response = await AuthenticationService.deleteQuoteDocument(payload)
        var result = response
        if (result.status === 200) {
          this.quote = result.data
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getSalespeopleToEmail () {
      var response = await AuthenticationService.getEmailSalespeople()
      if (response.status === 200) {
        let salespeople = response.data
        for (var idx = 0; idx < salespeople.length; idx++) {
          let salesPerson = salespeople[idx]
          this.salesRecipients.push(salesPerson.email)
        }
      }
    },
    selectFileForUpload () {
        this.$refs.file.click()
    },
    uploadFile (evt) {
      const file = evt.target.files[0]

      if (file.type === 'application/pdf') {
        let self = this;
        const filename = evt.target.value.split(/(\\|\/)/g).pop()

        // Encode the file using the fileReader API
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64String = reader.result
                .replace('data:', '')
                .replace(/^.+,/, '');

          const params = {
            quote_id: self.quote._id,
            pdf_filename: filename,
            pdf_bytes: base64String
          }

          try {
            var response = await AuthenticationService.uploadFile(params)
            if (response.status === 200) {
              self.quote = response.data
              self.customer = self.quote.customer
              self.salesperson = self.quote.salesperson
            }
          } catch (err) {
            self.errorMsg = 'Server has trouble uploading your file!'
          }
        }

        reader.readAsDataURL(file)
      } else {
        self.errorMsg = 'Only .pdf files can be uploaded!'
      }
    },
    hasValue (inputField) {
      return inputField.value != null &&
        inputField.value !== undefined &&
        inputField.value !== ''
    },
    capitalizeFirst (inputText) {
      return inputText.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
    },
    formatDate (dateString) {
      let result = ''
      if (dateString) {
        let dte = new Date(dateString)
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(dte)
        let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(dte)
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(dte)
        result = `${da}-${mo}-${ye}`
      }
      return result
    },
    goBack () {
      if (['Quotes', 'Customers', 'StaffList'].includes(this.callerName)) {
        this.$router.replace({name: this.callerName})
      } else {
        let payload = JSON.stringify(this.customer)
        this.$router.replace({ name: this.callerName[0], params: { 'payload': payload, 'caller': this.callerName.splice(1) } })
      }
    }
  },
  mounted () {
    if (this.payload) {
      this.quote = JSON.parse(this.$route.params.payload)
      this.customer = this.quote.customer
      this.salesperson = this.quote.salesperson
      if (this.caller) {
        this.callerName = this.caller
      }
      this.getSalespeopleToEmail()
      this.isFetching = false
    }
  }
}
</script>
<style scoped>
h4 {
  color: #0E6EFB;
}

ul {
  list-style: none;
}

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
  padding: 8px;
  font-size: 1.5em;
}

.header-div {
  margin: auto;
  text-align: center;
  line-height: 1.2em;
  padding: 10px;
  font-weight: bold;
  font-size: 30px; 
  overflow: wrap;
  overflow-wrap: break-word;
}

.customer-info-div {
  text-align: start;
  line-height: 0.2em;
}

.hilite {
  font-weight: bold;
  font-size: 30px; 
}

.label-clr {
  color: #0E6EFB;
}

.small-print {
  font-size: 18px; 
}

.med-print {
  font-size: 19px; 
}

.large-print {
  font-size: 22px; 
}

button {
  margin: 5px 5px;
  border-radius: 25px;
  font-weight: bold;
}


button:hover, a:hover {
  opacity: 0.7;
}

span.error {
  font-size: 22px;
  color: #FF0000;
}

.extras-div {
  margin-top: 5%;
}

.finance-div {
  margin-top: 5%;
}

</style>

