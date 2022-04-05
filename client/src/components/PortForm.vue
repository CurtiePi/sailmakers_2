<template>
  <div class="containter">
    <h1>Create New Port</h1>
    <form>
      <div v-for="(input, index) in inputFields" class="input_holder"
        :key="index">
        <div v-if="!['submit', 'textarea', 'select'].includes(input.type)">
          <label>{{ input.label }}</label>
          <input
            class="input is-large"
            :type="input.type"
            :name="input.name.toLowerCase()"
            v-model="input.value" />
        </div>
        <div v-else-if="input.type == 'textarea'">
          <label>{{ input.label }}</label>
          <input
            class="textarea"
            :type="input.type"
            :name="input.name.toLowerCase()"
            v-model="input.value" />
        </div>
        <div v-else-if="input.type == 'select'">
          <label>{{ input.label }}</label>
          <input
            class="select"
            :type="input.type"
            :name="input.name.toLowerCase()"
            :id="input.name.toLowerCase()"
            v-model="input.value" />
        </div>
      </div>
      <button type="button" class="btn btn-primary"
        @click="createPort()"
        :disabled="!allowSubmitForm">Create Port</button>
    </form>
  </div>
</template>
<script>
import portInputs from '@/assets/portInputs'
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'portForm',
  data () {
    return {
      inputFields: [],
      form: {}
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

      await AuthenticationService.createPort(payload)
      this.$router.push({ name: 'PortsList' })
    },
    hasValue (inputField) {
      return inputField.value != null &&
        inputField.value !== undefined &&
        inputField.value !== ''
    }
  },
  mounted () {
    this.inputFields = portInputs.inputFields
  }
}
</script>
<style scoped>
.input_holder {
  position: relative;
}
.control {
  display: inline-block;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 5px;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>
