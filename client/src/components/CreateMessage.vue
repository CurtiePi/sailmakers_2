<template>
<div id="container">
  <form class="form-style-7 mt-5">
    <div class="row col-md-12">
      <div class="col-md-5 mt-5">
        <ul>
          <li>
            <label>Subject</label>
            <input type='text' v-model="message.subject"/>
            <span>Email Subject</span>
          </li>
        </ul>
      </div>
      <div class="col-md-5 offset-md-2 d-inline mt-5">
        <input type="file" id="myFileInput" @change="addAttachment()" />
        <button type="button" class="btn btn-primary ms-3 me-2"
          @click="getAttachment()">
          Attach File
        </button>
        <button type="button" class="btn btn-primary me-3"
          @click="sendMessage()">
          Send Mail
        </button>
        <button type="button" class="btn btn-danger"
          @click="cancelEmail()">
          Cancel
        </button>
      </div>
        <div class="col-md-9 mt-4">
          <ul>
            <li>
              <label>Recipients</label>
              <textarea name="recipients" 
                @keyup="adjustTextarea($event)"
                ref="recipient_list"
                v-model="recipients" />
              <span>Email Recipients</span>
            </li>
          </ul>
      </div>
        <div class="col-md-3 mt-4">
          <span v-if="message.file_attachment">Attachment: {{ message.file_attachment }} </span>
      </div>
    </div>
  </form>
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
    adjustTextarea (event) {
      let target = event.target
      target.style.height = "20px"
      target.style.height = (target.scrollHeight) + "px"
    }, 
    async initializeTextAreaView () {
      await this.$nextTick()
      
      Object.keys(this.$refs).forEach ( key => {
        this.$refs[key].style.height = (this.$refs[key].scrollHeight) + "px"
      })
    },
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
      // this.initializeTextAreaView()
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
</style>
