<template>
  <div class="container">
    <div v-if="isFetching" className="col-12">
      <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
      <p>Loading . . .</p>
    </div>
    <div v-else class="card">
      <div class="center-div">
        <p class="hilite label-clr">{{ capitalizeFirst(quote.quote_type.join(', ')) }} Request for {{ customer.fname }} {{ customer.lname }}
          <span @click="toggleCustomerInfo()" :style="{'font-size': '8px'}">{{ toggleText }}</span>
        </p>
        <p v-if="!customerHidden" class="med-print"><i class="fa fa-home"></i>{{ customer.address }}</p>
        <br />
        <p v-if="!customerHidden" class="med-print"><i class="fa fa-phone"></i>{{ customer.phone }}</p>
        <br />
        <p v-if="!customerHidden" class="med-print"><i class="fa fa-envelope"></i>
          <router-link :to="{ name: 'CreateMessage', params: { 'targets': [customer.email], 'caller': ['CustomerProfile', callerName], 'cbdata': JSON.stringify(customer) } }">
            {{ customer.email }}
          </router-link>
        </p>
        <br />
        <p v-if="!customerHidden" class="med-print"><span class="label-clr">Club:</span> {{ customer.club }}</p>
      </div>
      <div class="row col-md-12">
        <div class="col-md-6 offset-md-2">
          <p class="small-print"><span class="label-clr">Status:</span> {{ capitalizeFirst(quote.status) }}</p>
        </div>
        <div class="col-md-4">
          <p class="small-print"><span class="label-clr">Created:</span> {{ formatDate(quote.createdAt) }}</p>
        </div>
      </div>
      <br />
      <div class="row col-md-12 offset-md-2">
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
      <div class="row col-md-9 offset-md-2" :style="{'margin': 35+'px auto'}">
        <table class="extras-table">
          <thead>
            <tr>
              <th>Battens</th>
              <th>Reefing Pts.</th>
              <th>Furling</th>
              <th>Num/Logo</th>
              <th>UV/Color</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ quote.battens }}</td>
              <td>{{ quote.reefing_pts }}</td>
              <td>{{ quote.furl_sys }}</td>
              <td>{{ quote.num_logo }}</td>
              <td>{{ quote.uv_color }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="row col-md-12">
        <div class="col-md-6 offset-md-2">
          <p class="med-print"><span class="label-clr">Price:</span> {{ quote.price }}</p>
        </div>
        <div class="col-md-4">
          <p class="med-print"><span class="label-clr">Balance Due:</span> {{ quote.quote_price - quote.amount_paid }}</p>
        </div>
      </div>
      <div v-if="haveDocs" class="row col-md-10" :style="{'margin': 35 + 'px auto'}">
        <div class="col med-print">
          <tr>
            <th>Document Name</th>
            <th></th>
            <th></th>
          </tr>
          <tr v-for= "(doc, index) in quote.doc_path"
            :key="index">
            <td style="width: 90%;">
              <router-link :to="{ name: 'QuoteViewPDF' , params: {'payload': JSON.stringify(quote), 'caller': ['QuoteDisplay', callerName], 'filename': doc} }">
                {{ doc }}
              </router-link>
            </td>
            <td style="width: 5%;">
              <a @click='emailDocument(doc)'>
                <i class="fa fa-envelope" aria-hidden="true"></i>
              </a>
            </td>
            <td style="width: 5%;">
              <a @click="getFile(doc)">
                <i class="fa fa-download" aria-hidden="true"></i>
              </a>
            </td>
            <td style="width: 5%;">
              <a @click='deleteDocument(doc)'>
                <i class="fa fa-trash" aria-hidden="true"></i>
              </a>
            </td>
          </tr>
        </div> 
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
          <button v-if="haveFile" title="Upload File" @click="uploadFile">
            <i class="fa fa-upload" aria-hidden="true"></i>
          </button>
          <button v-if="!haveFile" title="Select File For Upload" @click="selectFileForUpload()">
            <i class="fa fa-folder-open" aria-hidden="true"></i>
          </button>
          <input
            style="display:none;"
            type="file"
            ref="file"
            @change="onSelect" />
          <button title="Delete Quote" @click="deleteQuote()">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </button>
          <button @click="goBack()">Back</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'quoteDisplay',
  props: ['payload', 'caller'],
  data () {
    return {
      haveFile: false,
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
    async getFile (filename) {
      console.log(`Getting ${filename}`)
      var response = await AuthenticationService.downloadFile(filename)
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = downloadUrl
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
      let quote = this.quote
      let leavePage = this.goBack

      let message = {
        title: 'Delete Request',
        body: `Deleting request will also delete all associated PDFs!<p><strong>This action cannot be undone!Are you sure?</strong></p>`
      }

      let options = {
        html: true,
        okText: 'I\'m Sure! Delete!',
        cancelText: 'Cancel',
        animation: 'fade',
        type: 'hard',
        verification: 'delete'
      }

      this.$dialog
        .confirm(message, options)
        .then(async function () {
          let payload = {
            'quote': quote
          }
          let response = await AuthenticationService.deleteQuote(payload)

          if (response.status === 200) {
            leavePage()
          } else {
            console.log(`Response: ${response.message}`)
          }
        })
        .catch(function () {
          console.log('Clicked on cancel')
        })
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
    selectFileForUpload () {
        console.log("selecting file")
        this.$refs.file.click()
    },
    onSelect () {
      const file = this.$refs.file.files[0]
      this.file = file
      this.haveFile = true;
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
    async uploadFile () {
      if (this.file.type === 'application/pdf') {
        const formData = new FormData()
        formData.append('file', this.file)
        formData.append('quote_id', this.quote._id)
        try {
          var response = await AuthenticationService.uploadFile(formData)
          if (response.status === 200) {
            this.quote = response.data
            this.customer = this.quote.customer
            this.salesperson = this.quote.salesperson
          }
        } catch (err) {
          this.errorMsg = 'Only .pdf files can be uploaded!'
        }
      } else {
        this.errorMsg = 'Only .pdf files can be uploaded!'
      }
      this.haveFile = false
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

.center-div {
  margin: auto;
  text-align: center;
  line-height: 0.3em;
  padding: 10px;
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


tr {
  text-align: center;
}

td {
  text-align: center;
}

.extras-table {
  width: 100%;
  margin-bottom: 1.5em;
  border-spacing: 0;
}

.extras-table thead {
  font-size: 0.8em;
  color: #0E6EFB;
}

.extras-table tr {
  border:1px solid #000000;
}

.extras-table td {
  border:1px solid #000000;
}
</style>
