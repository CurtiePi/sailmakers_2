<template>
  <div class="container">
    <div class="col-md-12 mt-5">
      <h1 v-if="!hasToken">{{ msg }}</h1>
      <h1 v-else>{{ customGreeting() }}</h1>
    </div>
    <div v-if="hasToken" class="row col-md-12">
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
      hasToken: false,
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
      console.log(`Looking for name: ${target.originalArgument}`)
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
      console.log(`Getting ${name}`)
      let response = await AuthenticationService.salespersonByName(name)
      console.log(response.data)
      this.salesperson = response.data[0]
      localStorage.sp = JSON.stringify(this.salesperson)
    },
    async getDashboardData () {
      let response = await AuthenticationService.getDashboard()
      console.log(response.data)
      const results = response.data.data
      Object.keys(results).map((key) =>  {
        this.dashboard[key] = results[key]
      });
      this.monthlyTypeCount = this.filterData('')
    },
    async login () {
      let payload = {
        username: 'captainDave',
        password: this.credential
      }

      console.log(payload)
      await this.userLogin(payload)
      if (this.getLoginApiStatus) {
        //this.$router.push("/customers")
        this.hasToken = true
        this.$forceUpdate()
      }
      else {
        this.$router.push("/")
      }
    },
    customGreeting () {
      var date = new Date()
      var hour = date.getHours()
      var timeGreeting = ''
      if (hour >= 0 && hour < 12) {
        timeGreeting ='Good Morning' 
      } else if (hour >= 12 && hour < 6) {
        timeGreeting ='Good Afternoon' 
      } else {
        timeGreeting ='Good Evening' 
      }

      return `${timeGreeting} ${this.salesperson.fname}`
    },
  },
  created () {
    console.log('Get a salesperson')
    this.getSalespersonByName('David Martin')
  },
  mounted () {
      this.hasToken = this.getLoginApiStatus
      this.getDashboardData()
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
    position: absolute;
    top: 18%;
    left: 51%;
  }
</style>
