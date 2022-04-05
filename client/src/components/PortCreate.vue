<template>
  <div class="container">
    <h1>Create New Port</h1>
    <form>
      <PortInputs ref="formInputs"/>
      <button @click="createPort()">Create Port</button> 
    </form>
  </div>
</template>
<script>
import PortInputs from '@/components/PortForm'
import router from '../router'

export default {
  name: 'createPort',
  components: {
    PortInputs
  },
  props: ['inputFields'],
  data () {
    return {
      inputFields: null
    }
  },
  computed: {
    allowSubmitForm: function () {
      return this.inputFields.some(this.hasValue)
    }
  },
  methods: {
    async createPort () {
      let data = {}

      console.log(this.inputFields)

      for (var idx = 0; idx < this.inputFields.length; idx++) {
        var inputField = this.inputFields[idx]
        if (this.hasValue(inputField)) {
          data[inputField.name] = inputField.value
        }
      }

      let payload = data
      console.log(payload)
      /*
      let response = await AuthenticationService.createPort(payload)
      this.$router.push({ name: 'PortsList' })
      */
    },
    hasValue (inputField) {
      return inputField.value != null &&
        inputField.value !== undefined &&
        inputField.value !== ''
    },
    goBack () {
      router.go(-1)
    }
  },
  mounted () {
    this.inputFields = this.$refs.formInputs.inputFields
  }
}
</script>
<style scoped>
</style>
