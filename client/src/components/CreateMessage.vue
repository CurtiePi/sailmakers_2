<template>
<div id="container">
     <label>Subject
       <input type='text' v-model="message.subject"/>
     </label>
     <br />
     <label>Recipients
       <input type='text' size="70" v-model="recipients"/>
     </label>
     <span v-if="message.file_attachment">Attachment: {{ message.file_attachment }} </span>
     <br />
     <input type="file" id="myFileInput" @change="addAttachment()" />
     <button type="button" class="attachBtn"
       @click="getAttachment()">
       Attach File
     </button>
     <button type="button" class="sendBtn"
       @click="sendMessage()">
       Send Mail
     </button>
     <button type="button" class="cancelBtn"
       @click="cancelEmail()">
       Cancel
     </button>
     <br />
     <span class="errorMsg" v-if="errorMsg">{{ errorMsg }}</span>
     <editor
       :api-key="mce_key"
       :init="{
         height: 500,
         menubar: false,
         plugins: [
           'advlist autolink lists link image charmap print preview anchor',
           'searchreplace visualblocks code fullscreen',
           'insertdatetime media table paste code help wordcount'
         ],
         toolbar:
           'undo redo cut copy paste| formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help'
       }"
       v-model="message.body"
     />
   </div>
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'customerMessage',
  props: ['targets', 'attachment', 'caller', 'cbdata', 'isBulk'],
  components: {
    'editor': Editor
  },
  data () {
    return {
      message: {
        subject: null,
        body: null,
        file_attachment: null
      },
      mce_key: process.env.VUE_APP_MCE_KEY,
      errorMsg: null,
      recipients: null,
      callback_data: null,
      callerName: 'Customers',
      isBulkEmail: false
    }
  },
  methods: {
    sendMessage: async function () {
      if (this.message.subject !== null && this.message.body !== null) {
        var payload = {
          'subject': this.message.subject,
          'body': this.message.body,
          'recipients': this.recipients.split(','),
          'isBulk': this.isBulkEmail
        }

        if (this.message.file_attachment) {
          payload['attachment'] = this.message.file_attachment
        }

        let response = await AuthenticationService.sendEmail(payload)
        if (response.status === 200) {
          this.$router.replace({ name: 'Customers' })
        }
      } else {
        this.errorMsg = 'Please write your message and subject before trying to email your message!'
      }
    },
    getReceivers: function () {
      if (this.message.body === null || this.message.subject === null) {
        this.errorMsg = 'You must have a subject and a message to send to proceed!'
      } else {
        this.$router.push({ name: 'SelectCustomers', params: { 'payload': this.message } })
      }
    },
    getAttachment: function () {
      document.getElementById('myFileInput').click()
    },
    addAttachment: async function () {
      var attachEl = document.getElementById('myFileInput')
      var filename = attachEl.value.split(/(\\|\/)/g).pop()

      var uploadedFile = attachEl.files[0]
      let formData = new FormData()
      formData.append('attachment', uploadedFile)

      try {
        var response = await AuthenticationService.addAttachment(formData)
        if (response.status === 200) {
          this.message.file_attachment = filename
        }
      } catch (err) {
        this.errorMsg = 'Error adding attachment!'
      }
    },
    cancelEmail: function () {
      if (['Quotes', 'Customers', 'StaffList'].includes(this.callerName)) {
        this.$router.replace({ name: this.callerName })
      } else {
        this.$router.replace({ name: this.callerName[0], params: { 'payload': this.callback_data, 'caller': this.callerName.splice(1) } })
      }
    }
  },
  mounted () {
    if (this.targets) {
      this.recipients = this.targets.join(',')
    }
    if (this.attachment) {
      this.message.file_attachment = this.attachment
    }
    if (this.isBulk) {
      this.isBulkEmail = true
    }
    if (this.caller) {
      this.callerName = this.caller
      if (this.cbdata) {
        this.callback_data = this.cbdata
      }
    }
  }
}
</script>
<style scoped>
.errorMsg {
  font-weight: bold;
  color: #FF0000;
  font-size: 22px;
}

.attachBtn {
  margin-right: 5px;
  margin-left: 5px;
}

.cancelBtn {
  margin-left:25px;
}

.sendBtn {
  margin-right: 5px;
  margin-left: 5px;
}

#myFileInput {
  display: none;
}
</style>
