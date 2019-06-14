const express    = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const axios = require('axios');
const router = express.Router();
const exec = require('child_process').exec;
const rp = require('request-promise');
const https = require('https');
const saml = require('saml');
const fn = require('./helper_functions.js')

const req_body =
'<?xml version="1.0" encoding="UTF-8"?>' +
'<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
    '<soap:Header>' +
        '<wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="iJFJKoU2cJbfDgjZTwrmZKpS8nKM">http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue</wsa:Action>' +
        '<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" soap:mustUnderstand="1">' +
            '<wsse:UsernameToken xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="ijhaEN438vD_gRUQC06Apb8B43nE">' +
                '<wsse:Username>andwest.gen</wsse:Username>' +
                '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">Marcomms19@</wsse:Password>' +
            '</wsse:UsernameToken>' +
        '</wsse:Security>' +
    '</soap:Header>' +
    '<soap:Body xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="iGPI7F3OqQHNY_nNdIi6mxp16eqE">' +
        '<wst:RequestSecurityToken xmlns:wst="http://docs.oasis-open.org/ws-sx/ws-trust/200512/">' +
            '<wst:TokenType>urn:ietf:params:oauth:grant-type:saml2-bearer</wst:TokenType>' +
            '<wst:RequestType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Issue</wst:RequestType>' +
            '<wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy">' +
                '<wsa:EndpointReference xmlns:wsa="http://www.w3.org/2005/08/addressing">' +
                    '<wsa:Address>https://ciscodev.service-now.com</wsa:Address>' +
                '</wsa:EndpointReference>' +
            '</wsp:AppliesTo>' +
            '<wst:Claims/>' +
            '<wst:OnBehalfOf>' +
                '<wsse:SecurityTokenReference xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' +
                    '<wsse:Reference URI="#ijhaEN438vD_gRUQC06Apb8B43nE" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#UsernameToken"/>' +
                '</wsse:SecurityTokenReference>' +
            '</wst:OnBehalfOf>' +
      '</wst:RequestSecurityToken>' +
    '</soap:Body>' +
'</soap:Envelope>';


const params = '&default=SNOW_INSTANCE=ciscodev&SNOW_AUTH_TYPE=sts&SNOW_STS_URI=https://cloudsso-test.cisco.com/idp/sts.wst&SNOW_WS_USER=andwest&SNOW_WS_PASSWORD=treyUT55&';

// "Content-Type": "text/html",
// "SNOW_INSTANCE": "ciscodev",
// "SNOW_AUTH_TYPE": "sts",
// "SNOW_STS_URI": "https://cloudsso-test.cisco.com/idp/sts.wst",
// "SNOW_WS_USER": "andwest",
// "SNOW_WS_PASSWORD": "treyUT55&",
// default: {
  // "SNOW_INSTANCE": "ciscodev",
  // "SNOW_AUTH_TYPE": "sts",
  // "SNOW_STS_URI": "https://cloudsso-test.cisco.com/idp/sts.wst",
  // "SNOW_WS_USER": "andwest",
  // "SNOW_WS_PASSWORD": "treyUT55&"
// }

const port = 3000 || process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get('/test/:userQuery', function (req, res, next) {
  console.log("HITTING ROUTE");
  // fn.getToken().then(function(token) {
  //     console.log("\n\n\nTOKEN: \n\n\n", token);
  //     let config = {
  //       headers: {
  //           "Authorization": token
  //       }
  //     }
  //     axios.get('https://ciscodev.service-now.com/api/now/table/u_it_service_offering?sysparm_display_value=true', config).then(function(response) {
  //         console.log("data", response.data.result[0]);
  //     })
  //     .catch(function(err) {
  //       console.error("ERR: ", err);
  //     })
  // })

    fn.getData(req.params.userQuery).then(function(data) {
        let cleanData = [];
        for (i = 0; i < data.length; i++) {
            let name = data[i].name.replace(/\-/g, "%2D").split(' ');
            let url = "https://clicktospark.cloudapps.cisco.com/ServiceOfferingAysBot/"
            for (var j in name) {
                if(name[j] && name[j].length) {
                  url += name[j] + "%20"
                }
            }
            var obj = {}
            obj.name = data[i].name; obj.url = url;
            cleanData.push(obj);
        }
        console.log("CLEANED DATA: ", cleanData);
        res.send(cleanData);
      // res.json("https://clicktospark.cloudapps.cisco.com/ServiceOfferingAysBot/IP%20Phone%20%2A%2A%20Features");

    })
    .catch(function(err) {
        console.log("\n\n\nNO DICE:\n\n\n", err);
    })
})







app.listen(port, function() {

});

app.get('*', function (req, res, next) {
  console.log('HITTING GET ROUTE');
  res.send('HITTING GET ROUTE')
})

module.exports = app;

// fn.getToken().then(function(token) {
//     console.log("\n\n\nTOKEN: \n\n\n", token);
//     let config = {
//       headers: {
//           "Authorization": token
//       }
//     }
    // axios.get('https://ciscodev.service-now.com/api/now/table/u_it_service_offering?sysparm_display_value=true', config).then(function(response) {
    //     for (var i = 0; i < response.data.result.length; i++) {
    //         if ( response.data.result[i]['name'].split(' ').includes('Microsoft') ) {
    //           console.log("RESULT: ", response.data.result[i]['name']);
    //         }
    //     }
    //     res.send(response.data.result)
        // for (var i = 0; i < response.data.result.length; i++) {
        //     for (var j = 0; j < response.data.result[i]['catalogs'].length; j++) {
        //         if (response.data.result[i]['catalogs'][j]['sys_id'] && response.data.result[i]['catalogs'][j]['sys_id'].length) {
        //             let sys_id = response.data.result[i]['catalogs'][j]['sys_id'];
        //             fn.getToken().then(function(token) {
        //                 let token2 = token;
        //                 console.log("SECOND TOKEN: ", token2);
        //                 let tableQuery = "cmdb_ci_service";
        //                 let url2 = "https://ciscodev.service-now.com/api/now/table/" + tableQuery + "?active=true";
        //                 let config2 = {
        //                     headers: {
        //                         "Authorization": token2
        //                     }
        //                 }
        //                 console.log("\n\nconfig2\n\n : ", config2);
        //                 axios.get(url2, config2).then(function(response) {
        //                   console.log("RES\n\n\n\n: ", response);
        //                   res.send("RES: ", response.data.result)
        //                 })
        //                 .catch(function(err) {
        //                   console.log("\n\nERR\n\n", err);
        //                 })
        //             }).catch(function (err) {
        //               console.log("\n\nERR:\n\n ", err.Error);
        //             })
        //       }
        //     }
        // }

    // })




      // exec('python -m esp_cli.snow_token --config=./config.yaml',
      //     function (error, stdout, stderr) {
      //           if (stdout && typeof stdout === "string" && stdout[0] === "B") {
      //             let clean = stdout.replace("\n", "");
      //             console.log("\n\nCLEAN: ", clean, "\n\n");
      //             let config = {
      //               headers: {
      //                   "Authorization": clean,
      //                 }
      //             };
      //
      //             let url = "https://ciscodev.service-now.com/api/sn_sc/servicecatalog/items"
      //
      //             axios.get(url, config).then(function(response) {
                    // console.log("\n\n\nHITTING SUCCESS FUNCTION\n\n\n: ", response.data.result);
                    // for (var i = 0; i < response.data.result.length; i++) {
                    //     for (var j = 0; j < response.data.result[i]['catalogs'].length; j++) {
                    //         if (response.data.result[i]['catalogs'][j]['sys_id'] && response.data.result[i]['catalogs'][j]['sys_id'].length) {
                    //             console.log("SYS ID: ", response.data.result[i]['catalogs'][j]['sys_id']);
                    //             let sys_id = response.data.result[i]['catalogs'][j]['sys_id'];
                    //             let config2 = {
                    //               headers: {
                    //                   "Authorization": clean,
                    //                 }
                    //             };
                    //             let tableQuery = "u_service_offering_support";
                    //             let url2 = "https://ciscodev.service-now.com/api/now/table/" + tableQuery + "/" + sys_id;
                    //             console.log("config 2: ", config2);
                    //             axios.get(url2, config2).then(function(res) {
                    //               console.log("RES\n\n\n\n: ", res);
                    //             }).catch(function (err) {
                    //               console.log("\n\nERR:\n\n ", err.Error);
                    //             })
                    //       }
                    //     }
                    // }
                    // let header2 = {
                    //   "Content-Type": "application/json",
                    //   "Accept": "application/json"
                    // }
                    // let auth2 = {
                    //   user: "admin",
                    //   pwd: "admin"
                    // };
                    // let config = {
                    //   headers: {
                    //       "Authorization": clean,
                    //     }
                    // };
                    // let url2 = "https://ciscodev.service-now.com/api/now/cmdb/app_service/" + sys_id + "/getContent";
                    // console.log("URL 2: ", url2);
                    // axios.get(url2, config).then(function(res) {
                    //   console.log("RES\n\n\n\n: ", res);
                    // })
                    // console.log("RESPONSE: ", response);
                    // res.json(response);
          //         }).catch(function(err) {
          //             if (err && err.length && err.response && err.response.length && err.response.headers && err.response.config) {
          //               console.log("ERR\n\n\n headers", err.response.headers, "ERR\n\n\n config", err.response.config);
          //             }
          //         })
          //         }
          //         if (stderr & stderr.length) {
          //           return stderr
          //         }
          //         if (error !== null) {
          //             console.log("\n\nERR:\n\n", error);
          //             return error;
          //         }
          // });

      // axios({method: "POST", url: 'https://cloudsso-test.cisco.com/idp/sts.wst', data: req_body, headers: headers}).then(function(data) {
      //   console.log("data.data: ", data.data);
      //   let token = data.data.split(' ')[13].split('<')[0].split('>')[1].replace(/\'/g, "");
      //
      //   console.log("TEXT\n\n\n", token.length, token + "\n\n\n");
      //   axios.get('https://ciscodev.service-now.com/saml_bearer_oauth_token.do?grant_type=urn:ietf:params:oauth:grant-type:saml2-bearer&assertion=' + token, headers).then(function(response) {
      //     console.log("RESPONSE: \n\n\n", response.data);
      //   }, function error (err) {
      //     console.log("\n\n\nERR\n\n\n", err);
      //   })
      //   .catch(function(err) {
      //     console.error("ERROR\n\n\n\n", err);
      //   })
      // }).catch(function(err) {
      //   console.error("\n\n\nERR\n\n\n\n", err)
      // })
