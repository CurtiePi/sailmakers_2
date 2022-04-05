export default [ 
        {
          text: 'Customer',
          icon: 'person',
          subNavLinks: [
            {
              text: 'Customer List',
              name: 'Customers',
              icon: 'people'
            },
            {
              text: 'Message Customers',
              name: 'SelectCustomers',
              icon: 'documents'
            },
            {
              text: 'Add Customer',
              name: 'CustomerAdd',
              icon: 'person-add',
              param: {
                name: 'atomic',
                value: true
              }
            },
            {
              text: 'New Customer Request',
              name: 'CustomerAdd',
              icon: 'document-attach',
              param: {
                name: 'atomic',
                value: false
              }
            }
          ]
        },
        {
          text: 'Request',
          icon: 'document',
          subNavLinks: [
            {
              text: 'Request List',
              name: 'Quotes',
              icon: 'documents'
            },
            {
              text: 'New Customer Request',
              name: 'CustomerAdd',
              icon: 'document-attach',
              param: {
                name: 'atomic',
                value: false
              }
            }
          ]
        },
        {
          text: 'Salespeople',
          icon: 'people',
          subNavLinks: [
            {
              text: 'Salespeople List',
              name: 'StaffList',
              icon: 'list-circle'
            },
            {
              text: 'Add Salesperson',
              name: 'StaffCreate',
              icon: 'person'
            }
          ]
        },
        {
          text: 'Port',
          icon: 'home',
          subNavLinks: [
            {
              text: 'Ports List',
              name: 'PortsList',
              icon: 'list-circle'
            },
            {
              text: 'Add Port',
              name: 'PortCreate',
              icon: 'boat'
            }
          ]
        }
      ]
