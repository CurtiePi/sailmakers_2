export default [ 
        {
          text: 'Customer',
          icon: 'fa-solid fa-person',
          subNavLinks: [
            {
              text: 'Customer List',
              name: 'Customers',
              icon: 'fa-solid fa-people-group',
            },
            {
              text: 'Message Customers',
              name: 'SelectCustomers',
              icon: 'fa-solid fa-message'
            },
            {
              text: 'Add Customer',
              name: 'CustomerAdd',
              icon: 'fa-solid fa-person-circle-plus',
              param: {
                name: 'singleOp',
                value: true
              }
            },
            {
              text: 'New Customer Request',
              name: 'CustomerAdd',
              icon: 'fa-solid fa-file-circle-plus',
              param: {
                name: 'singleOp',
                value: false
              }
            }
          ]
        },
        {
          text: 'Request',
          icon: 'fa-solid fa-file-invoice',
          subNavLinks: [
            {
              text: 'Request List',
              name: 'Quotes',
              icon: 'fa-solid fa-table-list'
            },
            {
              text: 'New Customer Request',
              name: 'CustomerAdd',
              icon: 'fa-solid fa-file-circle-plus',
              param: {
                name: 'singleOp',
                value: false
              }
            }
          ]
        },
        {
          text: 'Salespeople',
          icon: 'fa-solid fa-people-group',
          subNavLinks: [
            {
              text: 'Salespeople List',
              name: 'StaffList',
              icon: 'fa-solid fa-table-list'
            },
            {
              text: 'Add Salesperson',
              name: 'StaffCreate',
              icon: 'fa-solid fa-person-circle-plus',
            }
          ]
        },
        {
          text: 'Port',
          icon: 'fa-solid fa-anchor',
          subNavLinks: [
            {
              text: 'Ports List',
              name: 'PortsList',
              icon: 'fa-solid fa-table-list'
            },
            {
              text: 'Add Port',
              name: 'PortCreate',
              icon: 'fa-solid fa-sailboat'
            }
          ]
        }
      ]
