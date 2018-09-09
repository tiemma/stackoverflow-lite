
// Defined as a normal function since arrow function's
// don't support this explicitly
String.prototype.replaceAll = function (search, replacement) {
  return this.split(search).join(replacement);
};

const toJSONString = (form) => {
  const obj = {};
  const elements = form.querySelectorAll('input, select, textarea');
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    const name = element.name;
    const value = element.value;

    if (name) {
      obj[name] = value;
    }
  }

  return obj;
};

const getFormObject = (event) => {
  event.preventDefault();
  const target = event.target.dataset.target; // login or register
  return document.forms[`${target}-form`];
};

const getFormData = event => toJSONString(getFormObject(event));

const createEvents = (element, func) => {
  Array.from(document.querySelectorAll(element)).forEach((elem) => {
    elem.addEventListener('click', func, false);
  });
};

const verifyToken = (loadDashboardAfterTokenValidation = false) => getDataWithoutBody(`${API_URL}/verify/token`, 'GET')
  .then(resp => resp.json())
  .then((response) => {
    if (!response.auth) {
      if (localStorage.length === 0) {
        return loadLogin();
      }
      logout();
    } else if (loadDashboardAfterTokenValidation) {
      loadDashboard();
    }
  });

const getHeaders = (url) => {
  // verifyToken();
  const requestHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Access-Token': localStorage.getItem('token'),
    // 'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (url.indexOf('auth') !== -1) {
    delete requestHeaders['X-Access-Token'];
  }
  return requestHeaders;
};

const getRequestBody = (url, method) => ({
  method, // *GET, POST, PUT, DELETE, etc.
  mode: 'cors', // no-cors, cors, *same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, same-origin, *omit
  headers: getHeaders(url),
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // no-referrer, *client
});

const getDataWithoutBody = (url = '', method = '') => fetch(url, getRequestBody(url, method));

const postData = (url = '', data = {}, method = '') => {
  const requestBody = getRequestBody(url, method);
  requestBody.body = JSON.stringify(data);
  return fetch(url, requestBody);
};

const formatDate = (date) => {
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
  };
  return new Date(date.replaceAll('\'', '').replaceAll('"', '')).toLocaleDateString('en-US', options);
};
