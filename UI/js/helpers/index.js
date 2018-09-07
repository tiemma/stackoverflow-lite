
const API_URL = 'http://localhost:3000/api/v1';

String.prototype.replaceAll = function (search, replacement) {
  return this.split(search).join(replacement);
};

toJSONString = (form) => {
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

getFormObject = (event) => {
  event.preventDefault();
  const target = event.target.dataset.target; // login or register
  return document.forms[`${target}-form`];
};

getFormData = event => toJSONString(getFormObject(event));

createEvents = (element, func) => {
  Array.from(document.querySelectorAll(element)).forEach((elem) => {
    elem.addEventListener('click', func, false);
  });
};


getHeaders = (url) => {
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

getDataWithoutBody = (url = '', method = '') => fetch(url, {
  mmethod: method, // *GET, POST, PUT, DELETE, etc.
  mode: 'cors', // no-cors, cors, *same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, same-origin, *omit
  headers: getHeaders(url),
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // no-referrer, *client
});
postData = (url = '', data = {}, method = '') => fetch(url, {
  method, // *GET, POST, PUT, DELETE, etc.
  mode: 'cors', // no-cors, cors, *same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, same-origin, *omit
  headers: getHeaders(url),
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // no-referrer, *client
  body: JSON.stringify(data), // body data type must match 'Content-Type' header
});

formatDate = (date) => {
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
  };
  return new Date(date.replaceAll('\'', '').replaceAll('"', '')).toLocaleDateString('en-US', options);
};
