<template>
  <div class="container">
    <div class="container">
      <h1>Salesperson List</h1>
      <div class="form-check form-switch" :style="{'display': 'inline-block'}">
        <input class="form-check-input" type="checkbox" role="switch" id="inactiveSwitch" @change="toggleView()">
        <label class="form-check-label" for="inactiveSwitch">Show Inactive Salespeople</label>
      </div>
      <div>
        <table class="responsive-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Get Mail</th>
              <th scope="col">Active</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for= "salesperson in staff_display"
              :key="salesperson._id">
              <th scope="row"><router-link :to="{ name: 'StaffProfile', params: { 'payload': JSON.stringify(salesperson), 'caller': 'StaffList' } }">{{ salesperson.fname }} {{ salesperson.lname }}</router-link></th>
              <td data-title="Email"><router-link :to="{ name: 'CreateMessage', params: { 'targets': [salesperson.email], 'caller': 'StaffList' } }">{{ salesperson.email }}</router-link></td>
              <td data-title="Phone">{{ salesperson.phone }}</td>
              <td data-title="Get Mail">{{ (salesperson.get_mail) ? 'Y' : 'N' }}</td>
              <td data-title="Active">{{ (salesperson.isActive) ? 'Y' : 'N' }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'StaffList',
  data () {
    return {
      salespeople: [],
      staff_display: [],
      showInactive: false
    }
  },
  methods: {
    getSalespeople: async function () {
      let response = await AuthenticationService.getSalespeople()
      this.salespeople = response.data
      this.sortList()
      this.filterList()
    },
    alphanumericSort: function (a, b) {
      return (a.lname < b.lname) ? -1 : (a.name > b.name) ? 1 : 0
    },
    sortList () {
      var ftn = this.alphanumericSort
      this.salespeople.sort(ftn)
    },
    filterList () {
        if (this.showInactive) {
            this.staff_display = this.salespeople
        } else {
            this.staff_display = this.salespeople.filter((elem) => elem.isActive)
        }
    },
    toggleView () {
        this.showInactive = !this.showInactive
        this.filterList()
    },
  },
  mounted () {
    this.getSalespeople()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "bourbon";

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}


/*  Breakpoints */
$bp-maggie: 15em; 
$bp-lisa: 30em;
$bp-bart: 48em;
$bp-marge: 62em;
$bp-homer: 75em;

/* Styles */
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  font-family: $font-stack-system;
  color: rgba(0,0,0,.87);
}

a {
  color: rgba(64,64,255,1);
  
  &:hover,
  &:focus {
    color: rgba(4,106,56,1); 
  }
}

.container {
  margin: 5% 3%;
  
  @media (min-width: $bp-bart) {
    margin: 2%; 
  }
  
  @media (min-width: $bp-homer) {
    margin: 2em auto;
    max-width: $bp-homer;
  }
}

.responsive-table {
  width: 100%;
  margin-bottom: 1.5em;
  border-spacing: 0;
  
  @media (min-width: $bp-bart) {
    font-size: .9em; 
  }
  
  @media (min-width: $bp-marge) {
    font-size: 1em; 
  }
  
  thead {
    /* Accessibly hide <thead> on narrow viewports */
    position: absolute;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    padding: 0;
    border: 0;
    height: 1px; 
    width: 1px; 
    overflow: hidden;
    
    @media (min-width: $bp-bart) {
      /* Unhide <thead> on wide viewports */
      position: relative;
      clip: auto;
      height: auto;
      width: auto;
      overflow: auto;
    }
    
    th {
      background-color: rgba(170,195,197,1);
      border: 1px solid rgba(134,188,37,1);
      font-weight: normal;
      text-align: center;
      color: brown;
      
      &:first-of-type {
        text-align: left; 
      }
    }
  }
  
  /* Set these items to display: block for narrow viewports */
  tbody,
  tr,
  th,
  td {
    display: block;
    padding: 0;
    text-align: left;
    white-space: normal;
  }
  
  tr {   
    @media (min-width: $bp-bart) {
      /* Undo display: block */ 
      display: table-row; 
    }
  }
  
  th,
  td {
    padding: .5em;
    vertical-align: middle;
    
    @media (min-width: $bp-lisa) {
      padding: .75em .5em; 
    }
    
    @media (min-width: $bp-bart) {
      /* Undo display: block */
      display: table-cell;
      padding: .5em;
    }
    
    @media (min-width: $bp-marge) {
      padding: .75em .5em; 
    }
    
    @media (min-width: $bp-homer) {
      padding: .75em; 
    }
  }
  
  caption {
    margin-bottom: 1em;
    font-size: 1em;
    font-weight: bold;
    text-align: center;
    
    @media (min-width: $bp-bart) {
      font-size: 1.5em;
    }
  }
  
  tfoot {
    font-size: .8em;
    font-style: italic;
    
    @media (min-width: $bp-marge) {
      font-size: .9em;
    }
  }
  
  tbody {
    @media (min-width: $bp-bart) {
      /* Undo display: block  */
      display: table-row-group; 
    }
    
    tr {
      margin-bottom: 1em;
      
      @media (min-width: $bp-bart) {
        /* Undo display: block  */
        display: table-row;
        border-width: 1px;
      }
      
      &:last-of-type {
        margin-bottom: 0; 
      }
/*      
      &:nth-of-type(even) {
        @media (min-width: $bp-bart) {
          background-color: rgba(0,0,0,.12);
        }
      }
*/
    }
    
    th[scope="row"] {
      background-color: rgba(170,195,197,1);
      color: yellow;
      
      @media (min-width: $bp-lisa) {
        border-left: 1px solid rgba(134,188,37,1);
        border-bottom: 1px solid rgba(134,188,37,1);
      }
      
      @media (min-width: $bp-bart) {
        background-color: transparent;
        color: rgba(0,0,0.87);
        text-align: left;
      }
    }
    
    td {
      text-align: right;
      
      @media (min-width: $bp-bart) {
        border-left: 1px solid rgba(134,188,37,1);
        border-bottom: 1px solid rgba(134,188,37,1);
        text-align: center; 
      }

      &:last-of-type {
        @media (min-width: $bp-bart) {
          border-right: 1px solid rgba(134,188,37,1);
        } 
      }
    }
    
    td[data-type=currency] {
      text-align: right; 
    }
    
    td[data-title]:before {
      content: attr(data-title);
      float: left;
      font-size: .8em;
      color: rgba(0,0,0,.54);
      
      @media (min-width: $bp-lisa) {
        font-size: .9em; 
      }
      
      @media (min-width: $bp-bart) {
        /* Don’t show data-title labels */
        content: none; 
      }
    } 
  }
}
</style>
