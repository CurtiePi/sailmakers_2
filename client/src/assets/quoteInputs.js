export default {
  inputFields: [
    {
      id: 0,
      name: 'quote_type',
      label: 'Quote Type',
      type: 'checkbox',
      options: [
        {name: 'New Sail'},
        {name: 'Sail Repair'},
        {name: 'Winter Service'},
        {name: 'Sail Cover'}
      ],
      isEditOnly: false,
      inCustomer: false,
      value: null
    },
    {
      id: 1,
      name: 'status',
      label: 'Status',
      type: 'radio',
      options: [
        {name: 'Quote Request'},
        {name: 'Pending'},
        {name: 'Production'},
        {name: 'Ready'},
        {name: 'Delivered'},
        {name: 'No Sale'}
      ],
      isEditOnly: true,
      inCustomer: false,
      value: null
    },
    {
      id: 2,
      name: 'quote_price',
      label: 'Price',
      type: 'number',
      isEditOnly: true,
      inCustomer: false,
      value: null
    },
    {
      id: 3,
      name: 'amount_paid',
      label: 'Amount paid',
      type: 'number',
      isEditOnly: true,
      inCustomer: false,
      value: null
    },
    {
      id: 4,
      name: 'customer',
      label: 'Name',
      type: 'text',
      isEditOnly: false,
      inCustomer: true,
      value: null
    },
    {
      id: 5,
      name: 'phone',
      label: 'Phone',
      type: 'text',
      isEditOnly: false,
      inCustomer: true,
      value: null
    },
    {
      id: 6,
      name: 'sail_request',
      label: 'Sail Requested',
      type: 'textarea',
      cols: 60,
      rows: 2,
      isEditOnly: false,
      inCustomer: false,
      value: null
    },
    {
      id: 7,
      name: 'email',
      label: 'Email',
      type: 'text',
      isEditOnly: false,
      inCustomer: true,
      value: null
    },
    {
      id: 8,
      name: 'battens',
      label: 'Battens',
      type: 'text',
      isEditOnly: false,
      inCustomer: false,
      value: null
    },
    {
      id: 9,
      name: 'address',
      label: 'Address',
      type: 'text',
      isEditOnly: false,
      inCustomer: true,
      value: null
    },
    {
      id: 10,
      name: 'reefing_pts',
      label: 'Reefing Points',
      type: 'number',
      isEditOnly: false,
      inCustomer: false,
      value: null
    },
    {
      id: 11,
      name: 'boat_model',
      label: 'Boat',
      type: 'text',
      isEditOnly: false,
      inCustomer: true,
      value: null
    },
    {
      id: 12,
      name: 'num_logo',
      label: 'Numbers/Logos',
      type: 'text',
      isEditOnly: false,
      inCustomer: false,
      value: null
    },
    {
      id: 13,
      name: 'boat_name',
      label: 'Boat Name',
      type: 'text',
      isEditOnly: false,
      inCustomer: true,
      value: null
    },
    {
      id: 14,
      name: 'furl_sys',
      label: 'Furling System',
      type: 'text',
      isEditOnly: false,
      inCustomer: false,
      value: null
    },
    {
      id: 15,
      name: 'boat_home',
      label: 'Home Port',
      type: 'text',
      isEditOnly: false,
      inCustomer: true,
      value: null
    },
    {
      id: 16,
      name: 'uv_color',
      label: 'UV Color',
      type: 'text',
      isEditOnly: false,
      inCustomer: false,
      value: null
    },
    {
      id: 17,
      name: 'pick_drop',
      label: 'Sail pick up/Drop off',
      type: 'text',
      isEditOnly: false,
      inCustomer: false,
      value: null
    },
    {
      id: 18,
      name: 'sailing_type',
      label: 'Type of Sailing',
      type: 'textarea',
      cols: 60,
      rows: 2,
      isEditOnly: false,
      inCustomer: false,
      value: null
    },
    {
      id: 19,
      name: 'notes',
      label: 'Additional Notes',
      type: 'textarea',
      cols: 60,
      rows: 6,
      isEditOnly: false,
      inCustomer: false,
      value: null
    }
  ]
}
