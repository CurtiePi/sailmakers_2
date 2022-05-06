<template>
  <div class="container">
    <div class="col-md-12 mt-5">
      <h1 v-if="!hasToken">{{ msg }}</h1>
      <h1 v-else>{{ greeting }}</h1>
    </div>
    <div v-if="hasToken" class="row col-md-12">
      <div v-if="isFetching" class="col-md-12">
        <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
        <p>Loading . . .</p>
      </div>
      <div v-else class="col-md-12">
        <div class="col">
          <span
            @click="showNewCustomers()">
            <i class="fa fa-eye"></i> New Customers This Month
          </span>
          <br/>
          <span
            @click="showReadyQuotes()">
            <i class="fa fa-eye"></i> Requests Status Ready
          </span>
        </div>
        <div class="alert alert-warning fade hide" ref="alert_message" role="alert">
          <strong>{{ errorMsg }}</strong> Check back at a later time.
        </div>
      </div>
      <div class="col-md-6 mt-4">
        <DxChart
          :data-source="dashboard.monthlyQuoteCount"
          title="Monthly Quote Count">
          <DxArgumentAxis :tick-interval="10" />
          <DxSeries type="bar">
            <DxLabel :visible="true" />
          </DxSeries>
          <DxLegend :visible="false" />
        </DxChart>
      </div>
      <div class="col-md-6 mt-4">
        <DxChart
          id="chart"
          :customize-point="customizePoint"
          :class="isFirstLevel ? 'pointer-on-bars' : ''"
          :data-source="monthlyTypeCount"
          :title="requestTypeTitle"
          @point-click="onPointClick"
        >
          <DxSeries type="bar">
            <DxLabel :visible="true" />
          </DxSeries>
          <DxValueAxis :show-zero="false"/>
          <DxLegend :visible="false"/>
        </DxChart>
        <DxButton
          :visible="!isFirstLevel"
          class="button-container"
          text="Back"
          icon="chevronleft"
          @click="onButtonClick"
        />
      </div>
      <div class="col-md-6 mt-4">
        <DxChart
          :data-source="dashboard.currentStatusCount"
          title="Quote Status Count">
          <DxArgumentAxis :tick-interval="10" />
          <DxSeries type="bar" color="#003355">
            <DxLabel :visible="true" />
          </DxSeries>
          <DxLegend :visible="false" />
        </DxChart>
      </div>
      <div class="col-md-6 mt-4">
        <DxChart
          :data-source="dashboard.monthlyCustomerCount"
          title="New Customers Count">
          <DxArgumentAxis :tick-interval="10" />
          <DxSeries type="bar" color="#2345F2">
            <DxLabel :visible="true" />
          </DxSeries>
          <DxLegend :visible="false" />
        </DxChart>
      </div>
    </div>
    <div v-else>
      <form>
        <label for="credentials" class="form-label">Enter Password
          <input name="credentials"
            id="credentials"
            type="password"
            placeholder="Enter password"
            v-model.trim="credential" />
        </label>
        <button type="button" class="btn btn-primary"
          @click="login()">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import { mapActions, mapGetters } from 'vuex'
import DxChart, { DxArgumentAxis, DxLabel, DxSeries, DxValueAxis, DxLegend } from 'devextreme-vue/chart'
import { DxButton } from 'devextreme-vue/button'

export default {
  name: 'homeComponent',
  components: { DxChart, DxArgumentAxis, DxLabel, DxSeries, DxValueAxis, DxLegend, DxButton},
  data () {
    return {
      greeting: 'Welcome',
      isFetching: false,
      hasToken: false,
      hasError: false,
      errorMsg: 'This is an error message',
      credential: '',
      msg: 'Sailmakers',
      salesperson: null,
      dashboard: {},
      monthlyTypeCount: null,
      isFirstLevel: true,
      colors: ['#6BABAC', '#E55253'],
      requestTypeTitle: 'Request Type Count',
    }
  },
  computed: {
    ...mapGetters("auth", {
      getLoginApiStatus: "getLoginApiStatus"
    })
  },
  methods: {
    ...mapActions('auth', {
      userLogin: "userLogin"
    }),
    filterData(name) {
      return this.dashboard.monthlyTypeCount.filter((item) => item.parentID === name)
    },
    customizePoint() {
      return {
        color: this.colors[Number(this.isFirstLevel)],
        hoverStyle: !this.isFirstLevel ? { hatching: 'none', } : {},
      }
    },
    onPointClick({ target }) {
      if (this.isFirstLevel) {
        this.isFirstLevel = false
        this.monthlyTypeCount = this.filterData(target.originalArgument)
        this.requestTypeTitle = `${target.originalArgument} Count` 
      }
    },
    onButtonClick() {
      if (!this.isFirstLevel) {
        this.isFirstLevel = true
        this.monthlyTypeCount = this.filterData('')
        this.requestTypeTitle = 'Request Type Count' 
      }
    },
    async getSalespersonByName (name) {
      let response = await AuthenticationService.salespersonByName(name)
      this.salesperson = response.data[0]
      this.createGreeting(this.salesperson.fname)
      localStorage.sp = JSON.stringify(this.salesperson)
    },
    async getDashboardData () {
      let response = await AuthenticationService.getDashboard()
      const results = response.data.data
      Object.keys(results).map((key) =>  {
        this.dashboard[key] = results[key]
      });
      this.monthlyTypeCount = this.filterData('')
      this.isFetching = false;
    },
    async login () {
      let payload = {
        username: 'captainDave',
        password: this.credential
      }

      await this.userLogin(payload)
      if (this.getLoginApiStatus) {
        //this.$router.push("/customers")
        this.hasToken = true
        this.isFetching = true
        this.getDashboardData()
      }
      else {
        this.$router.push("/")
      }
    },
    createGreeting (name) {
      var date = new Date()
      var hour = date.getHours()
      var timeGreeting = ''
      if (hour >= 0 && hour < 12) {
        timeGreeting ='Good Morning' 
      } else if (hour >= 12 && hour < 18) {
        timeGreeting ='Good Afternoon' 
      } else {
        timeGreeting ='Good Evening' 
      }

      this.greeting = `${timeGreeting} ${name}`
    },
    async showNewCustomers() {
      var date = new Date()
      date.setMonth(date.getMonth() - 1)

      var payload = {'criteria' : {'createdAt': {'$gt' : date.toISOString()} }}
      let response = await AuthenticationService.customerSearch(payload)
      let customerList = response.data
      if (customerList.length == 0) {
        this.showErrorMessage('There are no new customers this month!')
      } else {
        this.$router.replace({ name: 'Customers', params: { 'payload': JSON.stringify(customerList), caller: 'Home' } })
      }
      
    },
    async showReadyQuotes() {
      var payload = {'criteria' : {'status': 'ready'}}
      let response = await AuthenticationService.quoteSearch(payload)
      let quoteList = response.data
      if (quoteList.length == 0) {
        this.showErrorMessage('There are no quotes to show that have the ready status!')
      } else {
        this.$router.replace({ name: 'Quotes', params: { 'payload': JSON.stringify(quoteList), caller: 'Home' } })
      }
    },
    showErrorMessage(message) {
      this.errorMsg = message
      var classList = this.$refs.alert_message.classList.value
      classList = classList.replace('hide', 'show')
      this.$refs.alert_message.classList.value = classList
      setTimeout(this.hideErrorMessage, 5000)
    },
    hideErrorMessage() {
      var classList = this.$refs.alert_message.classList.value
      classList = classList.replace('show', 'hide')
      this.$refs.alert_message.classList.value = classList
    }
  },
  created () {
    this.getSalespersonByName('David Martin')
  },
  mounted () {
      this.hasToken = this.getLoginApiStatus
      if (this.hasToken) {
        this.isFetching = true
        this.getDashboardData()
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home {
    background-color: rgba(0, 176, 234, 0.5);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #chart {
    height: 440px;
    width: 100%;
  }

  #chart.pointer-on-bars .dxc-series rect {
    cursor: pointer;
  }

  .button-container {
    text-align: center;
    height: 40px;
    position: relative;
    top: -91%;
    left: -35%;
  }
</style>
