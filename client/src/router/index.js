import { createRouter, createWebHistory } from 'vue-router'
import store from '../store';


const routes = [
    {
      path: '/',
      name: 'Home',
      component: () => import('../components/HomeComponent.vue')
    },
    {
      path: '/customers',
      name: 'Customers',
      component: () => import('../components/CustomerList.vue')
    },
    {
      path: '/customer',
      name: 'CustomerProfile',
      component: () => import('../components/CustomerProfile.vue'),
      props: true
    },
    {
      path: '/customer_add',
      name: 'CustomerAdd',
      component: () => import('../components/CustomerInput.vue'),
      props: true
    },
    {
      path: '/customer_edit',
      name: 'CustomerEdit',
      component: () => import('../components/CustomerInput.vue'),
      props: true
    },
    {
      path: '/customer_quotes',
      name: 'CustomerQuotes',
      component: () => import('../components/CustomerQuotesList.vue'),
      props: true
    },
    {
      path: '/create_message',
      name: 'CreateMessage',
      component: () => import('../components/CreateMessage.vue'),
      props: true
    },
    {
      path: '/select_customers',
      name: 'SelectCustomers',
      component: () => import('../components/CustomerSelect.vue'),
      props: true
    },
    {
      path: '/quotes',
      name: 'Quotes',
      component: () => import('../components/QuotesList.vue')
    },
    {
      path: '/quote_create',
      name: 'QuoteCreate',
      component: () => import('../components/QuoteInput.vue'),
      props: true
    },
    {
      path: '/quote_edit',
      name: 'QuoteEdit',
      component: () => import('../components/QuoteInput.vue'),
      props: true
    },
    {
      path: '/quote_display',
      name: 'QuoteDisplay',
      component: () => import('../components/QuoteDisplay.vue'),
      props: true
    },
    {
      path: '/new_customer_quote',
      name: 'NewCustomerQuote',
      components: () => import('../components/CustomerInput.vue'),
      props: true
    },
    {
      path: '/staff_list',
      name: 'StaffList',
      component: () => import('../components/StaffList.vue')
    },
    {
      path: '/staff_create',
      name: 'StaffCreate',
      component: () => import('../components/StaffForm.vue'),
      props: true
    },
    {
      path: '/staff_edit',
      name: 'StaffEdit',
      component: () => import('../components/StaffForm.vue'),
      props: true
    },
    {
      path: '/staff_profile',
      name: 'StaffProfile',
      component: () => import('../components/StaffProfile.vue'),
      props: true
    },
    {
      path: '/select_salespeople',
      name: 'SelectStaff',
      component: () => import('../components/StaffSelect.vue'),
      props: true
    },
    {
      path: '/ports',
      name: 'PortsList',
      component: () => import('../components/PortsList.vue')
    },
    {
      path: '/port_create',
      name: 'PortCreate',
      component: () => import('../components/PortForm.vue'),
      props: true
    },
    {
      path: '/quote_display_pdf',
      name: 'QuoteViewPDF',
      component: () => import('../components/QuotePdf.vue'),
      props: true
    }
  ]

const routerHistory = createWebHistory();

const router = createRouter({
    history: routerHistory,
    routes
});

router.beforeEach(async (to, from, next) => {
    if ( to.name !== 'Home' && !store.state.auth.loginApiStatus) 
        next({ name: 'Home' });
    else next()
})

export default router;
