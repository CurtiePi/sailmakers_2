<template>
  <div class="container">
    <div class="row col-md-12">
      <div class="col-md-1 mt-5">
        <button class="btn btn-primary" @click="goBack()">Back</button>
      </div>
      <div id="pdfvuer col-md-10" ref="pdfviewer">
        <vue-pdf-embed :source="pdfBytes">
          <template v-slot:header>
            <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
            <p>Loading . . .</p>
          </template>
        </vue-pdf-embed>
      </div>
    </div>
  </div>
</template> 

<script>
import VuePdfEmbed from 'vue-pdf-embed'
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'QuotePdf',
  components: { VuePdfEmbed },
  data () {
    return {
      caller: 'Home',
      pdfBytes: null,
      quote: null,
      page: 1,
      numPages: 0,
      pdfdata: undefined,
      errors:[],
      scale: 1.009188953097702,
    }
  },
  computed: {
  },
  mounted () {
    this.caller = this.$route.params.caller
    this.quote = JSON.parse(this.$route.params.payload)
    this.getPdfContent(this.$route.params.filename)

  },
  watch: {
  },
  methods: {
    getPdfContent: async function (filename) {
      var response = await AuthenticationService.pdfView(filename)
      // let blob = new Blob([response.data], {type: 'application/pdf'})
      // this.pdfBytes = `data:application/pdf;base64,${btoa(blob)}`
      this.pdfBytes = `data:application/pdf;base64,${response.data}`
    },
    goBack: function () {
      this.$router.replace({ name: 'QuoteDisplay', params: { 'payload': JSON.stringify(this.quote), 'caller': this.caller[1] } })
    }
  }
}
</script>
<style lang="css" scoped>

  #buttons {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  /* Page content */
  .content {
    padding: 16px;
  }
 .ui.menu.three.item .item {
    width: 15.33%;
 }
</style>
