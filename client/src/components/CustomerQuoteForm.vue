<template>
  <div class="container">
    <form>
      <div class="form-group">
        <input v-for="inputField in inputFields.customer"
          class="test-control" size="25"
          :type="inputField.type"
          :placeholder="inputField.placeholder"
          :name="inputField.name"
          :id="inputField.name"
          v-model="inputField.value" />
      </div>
      <div class="form-group">
        <input v-for="inputField in inputFields.quote"
          class="test-control" size="25"
          :type="inputField.type"
          :placeholder="inputField.placeholder"
          :name="inputField.name"
          :id="inputField.name"
          v-model="inputField.value" />
      </div>
    </form>
    </form>
  </div>
</template>

<script>
import quoteInputs from '@/assets/quoteInputs'
import customerInputs from '@/assets/customerInputs'

export default {
  name: 'createCustomerQuote',
  data () {
    return {
      inputFields: {
        customer: customerInputs.inputFields,
        quote: quoteInputs.inputFields
      }
    }
  }
}
</script>

<style scoped>

</style>
