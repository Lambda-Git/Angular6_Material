import { environment as defaultEnvironment } from './environment';

export const environmentLoader = new Promise<any>((resolve, reject) => {

  var xmlhttp = new XMLHttpRequest(),
    method = 'GET',
    url = './assets/environments/environment.json';

  xmlhttp.open(method, url, true);

  xmlhttp.onload = function() {
    if (xmlhttp.status === 200) {
      resolve(JSON.parse(xmlhttp.responseText));
    } else {
      resolve(defaultEnvironment);
    }
  };

  xmlhttp.send();
});

// export const configLoader = new Promise<any>((resolve, reject) => {
//
//   var xmlhttp = new XMLHttpRequest(),
//     method = 'GET',
//     url = './assets/environments/config.json';
//
//   xmlhttp.open(method, url, true);
//
//   xmlhttp.onload = function() {
//     if (xmlhttp.status === 200) {
//       resolve(JSON.parse(xmlhttp.responseText));
//     } else {
//       resolve({});
//     }
//   };
//
//   xmlhttp.send();
// });
