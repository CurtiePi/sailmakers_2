<template>
  <canvas ref='canvas' v-bind="canvasAttrs">
  </canvas>
</template>

<script>
export default {
  props: ['page', 'scale'],

  render (h) {
    const {canvasAttrs: attrs} = this
    return h('canvas', {attrs})
  },
  methods: {
    drawPage () {
      if (this.renderTask) {
        return
      }

      const {viewport} = this
      const canvasContext = this.$refs.canvas.getContext('2d')
      const renderContext = {canvasContext, viewport}

      // PDFPageProxy#render
      // https://mozilla.github.io/pdf.js/api/draft/PDFpageProxy.html
      this.renderTask = this.page.render(renderContext)
      this.renderTask
        .promise
        .then(() => this.$emit('rendered', this.page))
        .catch(this.destroyRenderTask)
    },
    destroyPage (page) {
      if (!page) {
        return
      }

      // PDFPageProxy#_destroy
      // https://mozilla.github.io/pdf.js/api/draft/PDFpageProxy.html
      page._destroy()

      // RenderTask#cancel
      // https://mozilla.github.io/pdf.js/api/draft/RenderTask.html
      if (this.renderTask) {
        this.renderTask.cancel()
      }
    },
    destroyRenderTask () {
      if (!this.renderTask) {
        return
      }

      // RenderTask#cancel
      // https://mozilla.github.io/pdf.js/api/draft/RenderTask.html
      this.renderTask.cancel()
      delete this.renderTask
    }
  },
  created () {
    // PDFPageProxy#getViewport
    // https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html
    this.viewport = this.page.getViewport({scale: this.scale})
  },
  beforeUnmount () {
    this.destroyPage(this.page)
  },
  computed: {
    canvasAttrs () {
      /* eslint-disable */
      // let {width, height} = this.viewport
      // [width, height] = [width, height].map(dim => Math.ceil(dim))

      var width = Math.ceil(this.viewport.width)
      var height = Math.ceil(this.viewport.height)

      const style = this.canvasStyle
      return {width, height, style, class: 'pdf-page'}
      /* eslint-enable */
    },

    canvasStyle () {
      const {width: actualSizeWidth, height: actualSizeHeight} = this.actualSizeViewport
      const pixelRatio = window.devicePixelRatio || 1
      const [pixelWidth, pixelHeight] = [actualSizeWidth, actualSizeHeight].map(dim => Math.ceil(dim / pixelRatio))
      return `width: ${pixelWidth}px; height: ${pixelHeight}px;`
    },

    actualSizeViewport () {
      return this.viewport.clone({scale: this.scale})
    }
  },
  watch: {
    page (page, oldPage) {
      this.destroyPage(oldPage)
    }
  },
  mounted () {
    this.drawPage()
  }
}
</script>

<style scoped>
</style>
