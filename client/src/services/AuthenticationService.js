import Api from '@/services/Api'

export default {
  login (payload) {
    return Api().insecure.post('/user/login', payload)
  },
  customerList () {
    return Api().insecure.get('/api/customer')
  },
  customerCreate (payload) {
    return Api().insecure.post('/api/customer/create', payload)
  },
  customerUpdate (payload) {
    return Api().insecure.post('/api/customer/update', payload)
  },
  customerDelete (payload) {
    return Api().insecure.post('/api/customer/delete', payload)
  },
  quoteList () {
    return Api().insecure.get('/api/quote')
  },
  quoteCreate (payload) {
    return Api().insecure.post('/api/quote/create', payload)
  },
  quoteUpdate (payload) {
    return Api().insecure.post('/api/quote/update', payload)
  },
  getCustomerQuotes (payload) {
    return Api().insecure.get(`/api/quote/customer/${payload}`)
  },
  sendEmail (payload) {
    return Api().insecure.post('/api/email', payload)
  },
  printQuote (payload) {
    return Api().insecure.post('/api/quote/print', payload)
  },
  deleteQuote (payload) {
    return Api().insecure.post('/api/quote/delete', payload)
  },
  deleteQuoteDocument (payload) {
    return Api().insecure.post('/api/quote/removePdf', payload)
  },
  salespersonByName (nameParam) {
    let url = `/api/staff/name/${nameParam}`
    console.log(url)
    return Api().insecure.get(url)
  },
  createPort (payload) {
    return Api().insecure.post('/api/port/create', payload)
  },
  getPrice (payload) {
    return Api().insecure.post('/api/quote/price', payload)
  },
  getSalespeople () {
    return Api().insecure.get('/api/staff')
  },
  createSalesperson (payload) {
    return Api().insecure.post('/api/staff/create', payload)
  },
  updateSalesperson (payload) {
    return Api().insecure.post('/api/staff/update', payload)
  },
  getEmailSalespeople () {
    return Api().insecure.get('/api/staff/emaillist')
  },
  portList () {
    return Api().insecure.get('/api/port')
  },
  pdfView (filename) {
    return `${Api().pdfUrl}${filename}`
  },
  uploadFile (payload) {
    return Api().insecure.post('api/utils/upload', payload)
  },
  addAttachment (payload) {
    return Api().insecure.post('api/utils/attach', payload)
  },
  downloadFile (filename) {
    return Api().insecure.get(`/api/utils/download/${filename}`, {
      responseType: 'blob'
    })
  }
}
