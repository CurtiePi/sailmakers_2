<template>
  <div class="container">
    <div class="row col-md-12">
    <div class="col-md-1 mt-5">
    <button class="btn btn-primary" @click="goBack()">Back</button>
    </div>
  <div id="pdfvuer col-md-10" ref="pdfviewer">
    <div id="buttons" ref="button_one" class="ui grey three item inverted bottom fixed menu transition hidden">
      <a class="item" @click="page > 1 ? page-- : 1">
        <i class="left chevron icon"></i>
        Back
      </a>
      <a class="ui active item">
        {{page}} / {{ numPages ? numPages : '∞' }}
      </a>
      <a class="item" @click="page < numPages ? page++ : 1">
        Forward
        <i class="right chevron icon"></i>
      </a>
      <a class="item" @click="zoomOut()">
        <i class="left chevron icon" />
          Zoom -
      </a>
      <a class="ui active item">
        {{ formattedZoom }} %
      </a>
      <a class="item" @click="zoomIn()">
        Zoom +
        <i class="right chevron icon" />
      </a>
    </div>
    <pdfview :src="pdfdata" v-for="i in numPages" :key="i" :id="i" :page="i"
        v-model:scale="scale" style="margin:20px auto;"
        :annotation="true"
        :resize="true"
        @link-clicked="handle_pdf_link">
      <template v-slot:header>
        <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
        <p>Loading . . .</p>
      </template>
    </pdfview>
  </div>
    </div>
  </div>
</template> 

<script>
import pdfvuer from 'pdfvuer'

export default {
  name: 'QuotePdf',
  components: { pdfview: pdfvuer },
  data () {
    return {
      caller: 'Home',
      url: null,
      quote: null,
      page: 1,
      numPages: 0,
      pdfdata: undefined,
      errors:[],
      scale: 1.009188953097702,
    }
  },
  computed: {
    formattedZoom () {
      return Number.parseInt(this.scale * 100)
    },
  },
  mounted () {
    this.caller = this.$route.params.caller
    this.quote = JSON.parse(this.$route.params.payload)
    this.url = this.$route.params.fileUrl

    this.getPdf()
  },
  watch: {
    show: function (s) {
      if (s) {
        this.getPdf()
      }
    },
    page: function (p) {
      if (window.pageYOffset <= this.findPos(document.getElementById(p)) || (document.getElementById(p+1) && window.pageYOffset >= this.findPos(document.getElementById(p+1)) )) {
        document.getElementById(p).scrollIntoView();
      }
    }
  },
  methods: {
    zoomOut: function () {
      if (this.scale > .2) {
        var width = this.$refs.pdfviewer.clientWidth
        width -= width * .1
        this.$refs.pdfviewer.style.width = width + 'px';
      }
    },
    zoomIn: function () {
      if (this.scale < 2.1) {
        var width = this.$refs.pdfviewer.clientWidth
        width += width * .1
        this.$refs.pdfviewer.style.width = width + 'px';
      }
    },
    handle_pdf_link: function (params) {
      // Scroll to the appropriate place on our page - the Y component of
      // params.destArray * (div height / ???), from the bottom of the page div
      var page = document.getElementById(String(params.pageNumber));
      page.scrollIntoView();
    },
    getPdf: function () {
      var self = this;
      self.pdfdata = pdfvuer.createLoadingTask(self.url);
      self.pdfdata.then(pdf => {
        self.numPages = pdf.numPages;
        window.onscroll = function() { 
          changePage() 
          stickyNav()  
        }

        // Get the offset position of the navbar
        // var sticky = $('#buttons')[0].offsetTop
        // var sticky = self.$refs.button_one.offsetTop
        var sticky = self.$refs.button_one.getBoundingClientRect().top

        // Add the sticky class to the self.$refs.nav when you reach its scroll position. Remove "sticky" when you leave the scroll position
        function stickyNav() {
          if (window.pageYOffset >= sticky) {
            if (self.$refs.button_one !== null) {
              self.$refs.button_one.classList.remove("hidden")
            }
          } else {
            if (self.$refs.button_one !== null) {
              self.$refs.button_one.classList.add("hidden")
            }
          }
        }

        function changePage () {
          var i = 1, count = Number(pdf.numPages);
          do {
            if(window.pageYOffset >= self.findPos(document.getElementById(i)) && 
                window.pageYOffset <= self.findPos(document.getElementById(i+1))) {
              self.page = i
            }
            i++
          } while ( i < count)
          if (window.pageYOffset >= self.findPos(document.getElementById(i))) {
            self.page = i
          }
        }
      });
    },
    findPos(obj) {
      //return obj.offsetTop;
      if (obj !== null) {
        return obj.getBoundingClientRect().top;
      }
    },
    goBack: function () {
      this.$router.replace({ name: 'QuoteDisplay', params: { 'payload': JSON.stringify(this.quote), 'caller': this.caller[1] } })
    }
  }
}
</script>
<style src='pdfvuer/dist/pdfvuer.css'></style>
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
