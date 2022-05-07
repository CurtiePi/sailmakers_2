const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getDaysInMonth = (y, m) => {
  return m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
}

const getMonthlyQuoteCount = (quotes) => {
    let startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    let endDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    startDate.setDate(1);
    endDate.setDate(1);
    startDate.setMonth(startDate.getMonth() + 1);
    endDate.setMonth(endDate.getMonth() + 1);
    var lastDay = getDaysInMonth(endDate.getFullYear(), endDate.getMonth() + 1);
    endDate.setDate(lastDay);
    var retVal = [];

    for (var x = 0; x < 12; x++) {
        var monthQuotes = quotes.filter((quote) => startDate < quote.createdAt && quote.createdAt < endDate);
        // retVal[months[endDate.getMonth()]] = monthQuotes.length;
        var item = {'arg': months[endDate.getMonth()],
                    'val': monthQuotes.length};
        retVal.push(item);

        var nextMonth = startDate.getMonth() + 1;
        nextMonth = (nextMonth < 12) ? nextMonth : 0;
        if (nextMonth == 0) {
          startDate.setFullYear(startDate.getFullYear() + 1);
          endDate.setFullYear(endDate.getFullYear() + 1);
        }
        var lastDay = getDaysInMonth(endDate.getFullYear(), nextMonth + 1);
        startDate.setMonth(nextMonth, 1);
        endDate.setMonth(nextMonth, lastDay);
    }

    return retVal;
}

const capitalizeFirst = (inputText) => {
      return inputText.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
}

const getTypeBreakdown = (quotes) => {
    const types = ['new sail', 'sail repair', 'winter service', 'sail cover', 'other'];

    var retVal = [];
    for (var x = 0; x < types.length; x++) {
      var typeQuotes = quotes.filter((quote) => quote.quote_type.includes(types[x]));
      if (typeQuotes.length > 0) {
        // retVal[types[x]] = getMonthlyQuoteCount(typeQuotes);
        var monthQCount = getMonthlyQuoteCount(typeQuotes)};
        retVal.push({'arg': capitalizeFirst(types[x]),
                    'val': typeQuotes.length,
                    'parentID': ''});

        for (var y=0; y < monthQCount.length; y++) {
          var data = monthQCount[y]
          var item = {'arg': data.arg,
                      'val': data.val,
                      'parentID': capitalizeFirst(types[x])};

          retVal.push(item);
        }
      }

    return retVal;
}

const getCurrentStatusBreakdown = (quotes) => {
    const statii = ['quote request', 'pending', 'production', 'ready', 'follow up', 'delivered', 'no sale'];

    var retVal = [];
    for (var x = 0; x < statii.length; x++) {
      var statusQuotes = quotes.filter((quote) => quote.status == statii[x]);
      // retVal[statii[x]] = statusQuotes.length;
      var item = {'arg': capitalizeFirst(statii[x]),
                  'val': statusQuotes.length};
      retVal.push(item);
    }

    return retVal;
}

const getMonthlyNewCustomers = (customers) => {
    let startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    let endDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    startDate.setDate(1);
    endDate.setDate(1);
    startDate.setMonth(startDate.getMonth() + 1);
    endDate.setMonth(endDate.getMonth() + 1);
    var lastDay = getDaysInMonth(endDate.getFullYear(), endDate.getMonth() + 1);
    endDate.setDate(lastDay);
    var retVal = [];

    for (var x = 0; x < 12; x++) {
        var monthCustomers = customers.filter((customer) => startDate < customer.createdAt && customer.createdAt < endDate);
        // retVal[months[endDate.getMonth()]] = monthCustomers.length;
        var item = {'arg': months[endDate.getMonth()],
                    'val': monthCustomers.length};

        retVal.push(item);

        var nextMonth = startDate.getMonth() + 1;
        nextMonth = (nextMonth < 12) ? nextMonth : 0;
        if (nextMonth == 0) {
          startDate.setFullYear(startDate.getFullYear() + 1);
          endDate.setFullYear(endDate.getFullYear() + 1);
        }
        var lastDay = getDaysInMonth(endDate.getFullYear(), nextMonth + 1);
        startDate.setMonth(nextMonth, 1);
        endDate.setMonth(nextMonth, lastDay);
    }

    return retVal;
}

const marshalDashboardData = (req, res, next) => {

    var monthlyCount = getMonthlyQuoteCount(req.dashboardRawData.quoteData);
    //    console.log(monthlyCount);
    var typesMonthlyCount = getTypeBreakdown(req.dashboardRawData.quoteData);
    //    console.log(typesMonthlyCount);
    var statusCount = getCurrentStatusBreakdown(req.dashboardRawData.quoteData);
    //    console.log(statusCount);
    var monthlyCustomerCount = getMonthlyNewCustomers(req.dashboardRawData.customerData);
    //    console.log(monthlyCustomerCount);

    marshalledData = { 'monthlyQuoteCount': monthlyCount,
                  'monthlyTypeCount': typesMonthlyCount,
                  'currentStatusCount': statusCount,
                  'monthlyCustomerCount': monthlyCustomerCount};

    req.marshalledData = marshalledData;

    next();
}


module.exports = {
    marshalDashboardData
}
