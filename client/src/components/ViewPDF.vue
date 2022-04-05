<template>
  <div class="container">
    <button type='button' @click="goBack">Back</button>
    <div class="pdf-document">
      <PDFPage
        v-for="page in pages"
        v-bind="{page, scale}"
        :key="page.pageNumber"
      />
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import range from 'lodash/range'
import PDFPage from '@/components/PDFPage'

export default {
  props: ['payload', 'filename', 'caller'],
  components: {
    PDFPage
  },
  data () {
    return {
      url: null,
      scale: 1.5,
      pages: [],
      pdf: undefined,
      quote: null,
      callerName: null
    }
  },
  watch: {
    pdf (pdf) {
      this.pages = []

      const pageNums = range(1, (1 + pdf.numPages))
      const promises = pageNums.map(number => pdf.getPage(number))

      Promise.all(promises)
        .then(pages => {
          this.pages = pages
        })
    }
  },
  methods: {
    getSource: async function (filename) {
      this.url = AuthenticationService.pdfView(filename)
      const pdfjs = await import('pdfjs-dist/build/pdf')
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry')

      pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
      pdfjs.getDocument(this.url).promise.then(pdf => {
        this.pdf = pdf
      })
        .catch(err => {
          console.log(`We have an error: ${err}`)
        })
    },
    goBack: function () {
      this.$router.replace({ name: 'QuoteDisplay', params: { 'payload': this.quote, 'caller': this.caller } })
    }
  },
  mounted () {
    if (this.payload) {
      this.quote = this.payload
      this.getSource(this.filename)
    }
    if (this.caller) {
      this.callerName = this.caller[0]
    }
  }
}
</script>

<style scoped>

</style>
