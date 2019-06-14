const exec = require('child_process').exec;

module.exports = {

    getToken: function () {
        return new Promise(function(resolve, reject) {
            exec('python -m esp_cli.snow_token --config=./config.yaml',
                function (error, stdout, stderr) {
                      if (stdout && typeof stdout === "string" && stdout[0] === "B") {
                          let clean = stdout.replace("\n", "");
                          resolve(clean);
                       } else {
                          reject("NO TOKEN")
                        }
              })
          })
    },

     // -f name,operational_status,ip_address,
     // sysparm_display_value=true
    getData: function (userQuery) {
        return new Promise(function(resolve, reject) {
            exec('python -m esp_cli.snow_exporter --query=nameSTARTSWITH' + userQuery + ' --table=u_it_service_offering --config=config.yaml --format=json -f name,operational_status,ip_address',
                function (error, stdout, stderr) {
                      let parsed = JSON.parse(stdout);
                      if( (parsed[0]['name'][0] + parsed[0]['name'][1]).toUpperCase() === (userQuery[0]+userQuery[1]).toUpperCase() ) {
                        resolve(parsed);
                      } else {
                        reject("NO RESULTS FOUND")
                      }
              })
        })
    }

}
