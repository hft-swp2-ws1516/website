/*jslint browser: true*/
/*global getTimespan, filterResponseByTimespan, drawTable, sortResults, mergeDoubleEntrys */
'use strict';

// Code will be executed  once the entire page (images or iframes), not just the DOM, is ready.
window.onload = function() {
  // Timeout setup for ajax
  // If the API is not responding within 3 seconds, the hard coded charts will be loaded
  $.ajaxSetup({
    timeout: 3000
  });

  // loading icon
  $(document).ajaxStart(function() {
    // show loader on start
    $("#loader").css("display", "block");
  }).ajaxSuccess(function() {
    // hide loader on success

  });

  function loadChartByHash(hash) {
    switch (hash) {
      case 'PFS':
        loadPFS();
        break;
      case 'DHE':
        loadDHE();
        break;
      case 'ECDHE':
        loadECDHE();
        break;
      case 'logjam':
        loadLogjam();
        break;
      case 'Ciphers':
        $("#filterTLS").show();
        loadCiphers();
        break;
      case 'Auth':
        loadAuth();
        break;
      case 'Kx':
        loadKx();
        break;
      case 'Enc':
        loadEnc();
        break;
      case 'MAC':
        loadMac();
        break;
      default:
        document.location.href = 'index.html';
        break;
    }
  }

  $("#filterTLS").hide();
  loadChartByHash(window.location.hash.substring(1));

  // This is called when the reload button is clicked!
  $("button.applytimespan").click(function() {
    // the called function depends of the hash value in the URL
    loadChartByHash(window.location.hash.substring(1));

  });


  $("#filterDateStartInput").change(function() {
    loadChartByHash(window.location.hash.substring(1));
  });

  $("#filterDateEndInput").change(function() {
    loadChartByHash(window.location.hash.substring(1));
  });

  $("#openGlobaldata").click(function() {
    document.location.href = 'index.html';
  });

  $("#loadPFS").click(function() {
    loadPFS();
    $("#filterTLS").hide();
  });

  $("#loadDHE").click(function() {
    loadDHE();
    $("#filterTLS").hide();
  });

  $("#loadECDHE").click(function() {
    $("#filterTLS").hide();
    loadECDHE();
  });

  $("#loadlogjam").click(function() {
    $("#filterTLS").hide();
    loadLogjam();
  });
  $("#loadCiphers").click(function() {
    $("#filterTLS").show();
    loadCiphers();
  });
  $("#loadMAC").click(function() {
    $("#filterTLS").hide();
    loadMac();
  });
  $("#loadAuth").click(function() {
    $("#filterTLS").hide();
    loadAuth();
  });
  $("#loadKx").click(function() {
    $("#filterTLS").hide();
    loadKx();
  });
  $("#loadEnc").click(function() {
    $("#filterTLS").hide();
    loadEnc();
  });




};


function loadEnc() {

  var totalHosts, filteredTotalHosts, filtered, chart, distribution;
  var tld = $('#filterTLD').val().replace('.', '');

  jQuery.get("https://hotcat.de:1337/api/v0/hostcount?tld=" + tld, function(response) {

    totalHosts = response;

  }).error(function() {
    $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
    $("#loader").css("display", "none");
  }).done(function() {

    // Load data from the server using a HTTP GET request
    // jquery.get is a equivalent to $.ajax({....
    jQuery.get("https://hotcat.de:1337/api/v0/enc/overview?tld=" + tld, function(response) {
      var start = getTimespan();

      if (start[0] !== start[1]) {

        // filter response Array by timespan
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        //fill months for x-axis
        var months = [];
        for (var i = 0; i < filtered.length; i++) {
          months.push(filtered[i].month);
        }

        // filter hostcount endpoint by given timespan
        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        // percentual line
        for (var i = 0; i < filtered.length; i++) {
          filtered[i].totalHosts = filteredTotalHosts[i].hostCount;
          distribution = filtered[i].encs;
          for (var j = 0; j < distribution.length; j++) {
            // if TLD is given match the total host correctly
            if (tld) {
              distribution[j].percent = ((distribution[j].count / filteredTotalHosts[i].hostCount) * 100).toFixed(2);
            } else {
              distribution[j].percent = ((distribution[j].count / filtered[i].totalHosts) * 100).toFixed(2);
            }
          }
        }


        // Convert the response in syntax like : { '512': [323,3234], '1024': [421,3424]}
        var json = {};

        for (var i = 0; i < filtered.length; i++) {
          // get distribution array
          distribution = filtered[i].encs;
          for (var j = 0; j < distribution.length; j++) {
            // only take dh keygorups
            if (!(Array.isArray(json[distribution[j].enc]))) {
              json[distribution[j].enc] = [];
            }
            // if there is ja new key and the previous elements in the array are null, then c3 will not work
            if (i >= 1 && !json[distribution[j].enc][i - 1]) {
              json[distribution[j].enc][i - 1] = 0;
            }
            json[distribution[j].enc][i] = distribution[j].percent;


          }
        }

        // draw Table 
        drawTable(["month", "encs", "totalHosts"], filtered, ["enc", "count", "percent"]);

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: json,
          },
          axis: {
            x: {
              type: 'category',
              categories: months,
            },
            y: {
              label: {
                text: 'In Percent',
                position: 'outer-middle'
              },
              min: 0,
              max: 99,
            }
          },

        });


      } else {
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));
        // filter hostcount endpoint by given timespan
        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        distribution = filtered[0].encs;
        // add total hosts number fo each value
        for (var i = 0; i < distribution.length; i++) {
          // if tld is given set the total number of hosts correctly
          if (distribution[i].enc === null) {
            distribution[i].enc = "unkown";
          }
          distribution[i].totalHosts = filteredTotalHosts[0].hostCount;
        }

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: distribution,
            keys: {
              x: 'enc',
              value: ['count']
            },
            type: 'bar',
          },
          axis: {
            x: {
              type: 'category',
            },
            y: {
              label: {
                text: 'Total Count',
                position: 'outer-middle'
              },
            }
          },
        });
        drawTable(["enc", "count", "totalHosts"], distribution);
      }
    }).error(function() {
      $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
      $("#loader").css("display", "none");
    }).done(function() {
      $("#loader").css("display", "none");
    });

  });


}


function loadKx() {

  var totalHosts, filteredTotalHosts, filtered, chart, distribution;
  var tld = $('#filterTLD').val().replace('.', '');

  jQuery.get("https://hotcat.de:1337/api/v0/hostcount?tld=" + tld, function(response) {

    totalHosts = response;

  }).error(function() {
    $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
    $("#loader").css("display", "none");
  }).done(function() {

    // Load data from the server using a HTTP GET request
    // jquery.get is a equivalent to $.ajax({....
    jQuery.get("https://hotcat.de:1337/api/v0/kx/overview?tld=" + tld, function(response) {
      var start = getTimespan();

      if (start[0] !== start[1]) {

        // filter response Array by timespan
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        //fill months for x-axis
        var months = [];
        for (var i = 0; i < filtered.length; i++) {
          months.push(filtered[i].month);
        }

        // filter hostcount endpoint by given timespan
        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        // percentual line
        for (var i = 0; i < filtered.length; i++) {
          filtered[i].totalHosts = filteredTotalHosts[i].hostCount;
          distribution = filtered[i].kxs;
          for (var j = 0; j < distribution.length; j++) {
            // if TLD is given match the total host correctly
            if (tld) {
              distribution[j].percent = ((distribution[j].count / filteredTotalHosts[i].hostCount) * 100).toFixed(2);
            } else {
              distribution[j].percent = ((distribution[j].count / filtered[i].totalHosts) * 100).toFixed(2);
            }
          }
        }


        // Convert the response in syntax like : { '512': [323,3234], '1024': [421,3424]}
        var json = {};

        for (var i = 0; i < filtered.length; i++) {
          // get distribution array
          distribution = filtered[i].kxs;
          for (var j = 0; j < distribution.length; j++) {
            // only take dh keygorups
            if (!(Array.isArray(json[distribution[j].kx]))) {
              json[distribution[j].kx] = [];
            }
            // if there is ja new key and the previous elements in the array are null, then c3 will not work
            if (i >= 1 && !json[distribution[j].kx][i - 1]) {
              json[distribution[j].kx][i - 1] = 0;
            }
            json[distribution[j].kx][i] = distribution[j].percent;


          }
        }

        // draw Table 
        drawTable(["month", "kxs", "totalHosts"], filtered, ["kx", "count", "percent"]);

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: json,
          },
          axis: {
            x: {
              type: 'category',
              categories: months,
            },
            y: {
              label: {
                text: 'In Percent',
                position: 'outer-middle'
              },
              min: 0,
              max: 99,
            }
          },

        });


      } else {
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));
        // filter hostcount endpoint by given timespan
        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        distribution = filtered[0].kxs;
        // add total hosts number fo each value
        for (var i = 0; i < distribution.length; i++) {
          // if tld is given set the total number of hosts correctly
          if (distribution[i].kx === null) {
            distribution[i].kx = "unkown";
          }
          distribution[i].totalHosts = filteredTotalHosts[0].hostCount;
        }

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: distribution,
            keys: {
              x: 'kx',
              value: ['count']
            },
            type: 'bar',
          },
          axis: {
            x: {
              type: 'category',
            },
            y: {
              label: {
                text: 'Total Count',
                position: 'outer-middle'
              },
            }
          },
        });
        drawTable(["kx", "count", "totalHosts"], distribution);
      }
    }).error(function() {
      $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
      $("#loader").css("display", "none");
    }).done(function() {
      $("#loader").css("display", "none");
    });

  });

}

function loadAuth() {

  var totalHosts, filteredTotalHosts, filtered, chart, distribution;
  var tld = $('#filterTLD').val().replace('.', '');

  jQuery.get("https://hotcat.de:1337/api/v0/hostcount?tld=" + tld, function(response) {

    totalHosts = response;

  }).error(function() {
    $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
    $("#loader").css("display", "none");
  }).done(function() {

    // Load data from the server using a HTTP GET request
    // jquery.get is a equivalent to $.ajax({....
    jQuery.get("https://hotcat.de:1337/api/v0/auth/overview?tld=" + tld, function(response) {
      var start = getTimespan();

      if (start[0] !== start[1]) {

        // filter response Array by timespan
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        //fill months for x-axis
        var months = [];
        for (var i = 0; i < filtered.length; i++) {
          months.push(filtered[i]._id);
        }

        // filter hostcount endpoint by given timespan
        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        // percentual line
        for (var i = 0; i < filtered.length; i++) {
          filtered[i].totalHosts = filteredTotalHosts[i].hostCount;
          distribution = filtered[i].auths;
          for (var j = 0; j < distribution.length; j++) {
            // if TLD is given match the total host correctly
            if (tld) {
              distribution[j].percent = ((distribution[j].count / filteredTotalHosts[i].hostCount) * 100).toFixed(2);
            } else {
              distribution[j].percent = ((distribution[j].count / filtered[i].totalHosts) * 100).toFixed(2);
            }
          }
        }


        // Convert the response in syntax like : { '512': [323,3234], '1024': [421,3424]}
        var json = {};

        for (var i = 0; i < filtered.length; i++) {
          // get distribution array
          distribution = filtered[i].auths;
          for (var j = 0; j < distribution.length; j++) {
            // only take dh keygorups
            if (!(Array.isArray(json[distribution[j].auth]))) {
              json[distribution[j].auth] = [];
            }
            // if there is ja new key and the previous elements in the array are null, then c3 will not work
            if (i >= 1 && !json[distribution[j].auth][i - 1]) {
              json[distribution[j].auth][i - 1] = 0;
            }
            json[distribution[j].auth][i] = distribution[j].percent;


          }
        }

        // draw Table 
        drawTable(["month", "auths", "totalHosts"], filtered, ["auth", "count", "percent"]);

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: json,
          },
          axis: {
            x: {
              type: 'category',
              categories: months,
            },
            y: {
              label: {
                text: 'In Percent',
                position: 'outer-middle'
              },
              min: 0,
              max: 99,
            }
          },

        });


      } else {
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));
        // filter hostcount endpoint by given timespan
        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        distribution = filtered[0].auths;
        // add total hosts number fo each value
        for (var i = 0; i < distribution.length; i++) {
          // if tld is given set the total number of hosts correctly
          if (distribution[i].auth === null) {
            distribution[i].auth = "unkown";
          }
          distribution[i].totalHosts = filteredTotalHosts[0].hostCount;
        }

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: distribution,
            keys: {
              x: 'auth',
              value: ['count']
            },
            type: 'bar',
          },
          axis: {
            x: {
              type: 'category',
            },
            y: {
              label: {
                text: 'Total Count',
                position: 'outer-middle'
              },
            }
          },
        });
        drawTable(["auth", "count", "totalHosts"], distribution);
      }
    }).error(function() {
      $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
      $("#loader").css("display", "none");
    }).done(function() {
      $("#loader").css("display", "none");
    });

  });


}

function loadMac() {

  var totalHosts, filteredTotalHosts, filtered, chart, distribution;
  var tld = $('#filterTLD').val().replace('.', '');

  jQuery.get("https://hotcat.de:1337/api/v0/hostcount?tld=" + tld, function(response) {

    totalHosts = response;

  }).error(function() {
    $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
    $("#loader").css("display", "none");
  }).done(function() {

    // Load data from the server using a HTTP GET request
    // jquery.get is a equivalent to $.ajax({....
    jQuery.get("https://hotcat.de:1337/api/v0/mac/distribution?tld=" + tld, function(response) {
      var start = getTimespan();

      if (start[0] !== start[1]) {

        // filter response Array by timespan
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        //fill months for x-axis
        var months = [];
        for (var i = 0; i < filtered.length; i++) {
          months.push(filtered[i].month);
        }

        // filter hostcount endpoint by given timespan
        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        // percentual line
        for (var i = 0; i < filtered.length; i++) {
          filtered[i].totalHosts = filteredTotalHosts[i].hostCount;
          distribution = filtered[i].distribution;
          for (var j = 0; j < distribution.length; j++) {
            // if TLD is given match the total host correctly
            if (tld) {
              distribution[j].percent = ((distribution[j].count / filteredTotalHosts[i].hostCount) * 100).toFixed(2);
            } else {
              distribution[j].percent = ((distribution[j].count / filtered[i].totalHosts) * 100).toFixed(2);
            }
          }
        }

        // Convert the response in syntax like : { '512': [323,3234], '1024': [421,3424]}
        var json = {};

        for (var i = 0; i < filtered.length; i++) {
          // get distribution array
          distribution = filtered[i].distribution;
          for (var j = 0; j < distribution.length; j++) {
            // only take dh keygorups
            if (!(Array.isArray(json[distribution[j].mac]))) {
              json[distribution[j].mac] = [];
            }
            // if there is ja new key and the previous elements in the array are null, then c3 will not work
            if (i >= 1 && !json[distribution[j].mac][i - 1]) {
              json[distribution[j].mac][i - 1] = 0;
            }
            json[distribution[j].mac][i] = distribution[j].percent;


          }
        }

        // draw Table 
        drawTable(["month", "distribution", "totalHosts"], filtered, ["mac", "count", "percent"]);

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: json,
          },
          axis: {
            x: {
              type: 'category',
              categories: months,
            },
            y: {
              label: {
                text: 'In Percent',
                position: 'outer-middle'
              },
              min: 0,
              max: 99,
            }
          },

        });


      } else {
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));
        // filter hostcount endpoint by given timespan
        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        distribution = filtered[0].distribution;
        // add total hosts number fo each value
        for (var i = 0; i < distribution.length; i++) {
          // if tld is given set the total number of hosts correctly
          distribution[i].totalHosts = filteredTotalHosts[0].hostCount;
        }

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: filtered[0].distribution,
            keys: {
              x: 'mac',
              value: ['count']
            },
            type: 'bar',
          },
          axis: {
            x: {
              type: 'category',
            },
            y: {
              label: {
                text: 'Total Count',
                position: 'outer-middle'
              },
            }
          },
        });
        drawTable(["mac", "count", "totalHosts"], filtered[0].distribution);
      }
    }).error(function() {
      $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
      $("#loader").css("display", "none");
    }).done(function() {
      $("#loader").css("display", "none");
    });

  });


}

function loadCiphers() {

  var totalHosts, filteredTotalHosts, filtered, chart, ciphers;

  jQuery.get("https://hotcat.de:1337/api/v0/hostcount", function(response) {
    totalHosts = response;
  }).error(function() {
    $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
    $("#loader").css("display", "none");
  }).done(function() {

    var tld = $('#filterTLD').val().replace('.', '');

    // Load data from the server using a HTTP GET request
    // jquery.get is a equivalent to $.ajax({....
    jQuery.get("https://hotcat.de:1337/api/v0/ciphers/summary?tld=" + tld, function(response) {

      var start = getTimespan();
      if (start[0] !== start[1]) {
        // filter response Array by timespan
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        var months = [];
        for (var i = 0; i < filtered.length; i++) {
          months.push(filtered[i].month);
        }


        // filter hostcount endpoint by given timespan
        var filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        var tlsFilter = $('#filterTLSProtocol').val();

        // json for graph
        var json = {};

        // array for table 
        var test = [];

        // iterate over all months
        for (var i = 0; i < filtered.length; i++) {
          // get ciphers array
          ciphers = filtered[i].summary;
          if (tld) {
            ciphers = mergeDoubleEntrys(ciphers, tlsFilter, filtered[i].totalHosts);
          } else {
            ciphers = mergeDoubleEntrys(ciphers, tlsFilter, filteredTotalHosts[i].hostCount);

          }

          sortResults(ciphers, 'count', false);

          // For drawing the table
          test[i] = {};
          test[i].month = filtered[i].month;
          // deep copy of array by value, not by reference! 
          test[i].summary = $.extend(true, [], ciphers);
          // if tld is given match the total hosts correctly
          if (tld) {
            test[i].totalHosts = filtered[i].totalHosts;
          } else {
            test[i].totalHosts = filteredTotalHosts[i].hostCount;
          }
          // show only top 20 used cipher suites
          ciphers = ciphers.splice(0, 20);

          // Convert the response in syntax like
          //var json = { 'AES128': [324234,312332], 'DES': [22234,312332]};
          for (var j = 0; j < ciphers.length; j++) {
            //check if array is initialized
            if (!(Array.isArray(json[ciphers[j].cipher]))) {
              json[ciphers[j].cipher] = [];
            }

            // if there is ja new key and the previous elements in the array are null, then c3 will not work
            if (i >= 1 && !json[ciphers[j].cipher][i - 1]) {
              json[ciphers[j].cipher][i - 1] = 0;
            }
            // choose either percent either count as value 
            if (ciphers[j].percent === undefined) {
              json[ciphers[j].cipher][i] = ciphers[j].count;
            } else {
              json[ciphers[j].cipher][i] = ciphers[j].percent;
            }

          }
        }

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: json,
          },
          axis: {
            x: {
              type: 'category',
              categories: months,
            },
            y: {
              label: {
                text: 'Total Count',
                position: 'outer-middle'
              },
            }
          },

        });

        drawTable(["month", "summary", "totalHosts"], test, ["cipher", "count", "percent"]);

      } else {
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));
        ciphers = filtered[0].summary;

        var summarizedArray = mergeDoubleEntrys(ciphers);
        // result array by property count in descending order
        sortResults(summarizedArray, 'count', false);

        // Only Top 20 most frequent Cipher suites
        summarizedArray = summarizedArray.splice(0, 20);

        var finalJson = {};
        for (var i = 0; i < summarizedArray.length; i++) {
          finalJson[summarizedArray[i].cipher] = summarizedArray[i].count;
        }

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: finalJson,
            type: 'bar',
          },
          axis: {
            x: {
              type: 'category',
            },
            y: {
              label: {
                text: 'Total Count',
                position: 'outer-middle'
              },
            }
          },
        });

        drawTable(["cipher", "count"], summarizedArray);
      }
    }).error(function() {
      $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
      $("#loader").css("display", "none");
    }).done(function() {
      $("#loader").css("display", "none");
    });


  });

}

function loadLogjam() {
  var totalHosts, filteredTotalHosts;
  var tld = $('#filterTLD').val().replace('.', '');

  jQuery.get("https://hotcat.de:1337/api/v0/hostcount?tld=" + tld, function(response) {

    totalHosts = response;

  }).error(function() {
    $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
    $("#loader").css("display", "none");
  }).done(function() {

    // Load data from the server using a HTTP GET request
    // jquery.get is a equivalent to $.ajax({....
    jQuery.get("https://hotcat.de:1337/api/v0/exp/overview?tld=" + tld, function(response) {
      var filtered, chart;
      var start = getTimespan();

      if (start[0] !== start[1]) {

        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));
        // filter response Array by timespan
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        var hostcount;
        for (var i = 0; i < filtered.length; i++) {
          hostcount = filteredTotalHosts[i].hostCount;
          filtered[i].total = hostcount;
          filtered[i].expDisabled = hostcount - filtered[i].expEnabled;
        }

        drawTable(["month", "expDisabled", "expEnabled", "total"], filtered);

        // percentual line
        for (var i = 0; i < filtered.length; i++) {
          filtered[i].expEnabledPercent = ((filtered[i].expEnabled / filteredTotalHosts[i].hostCount) * 100).toFixed(2);
          filtered[i].expDisabledPercent = ((filtered[i].expDisabled / filteredTotalHosts[i].hostCount) * 100).toFixed(2);
        }


        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: filtered,
            keys: {
              x: 'month',
              value: ['expDisabledPercent', 'expEnabledPercent']
            },
            type: 'line',
            colors: {
              expEnabled: '#D62728', //green
              expDisabled: '#2CA02C', // red
            },

          },
          type: 'line',
          axis: {
            x: {
              type: 'category',
            },
            y: {
              label: {
                text: 'In Percent',
                position: 'outer-middle'
              },
            }
          },

        });
      } else {
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));
        var hostcount = filteredTotalHosts[0].hostCount;

        filtered[0].total = hostcount;
        filtered[0].expDisabled = hostcount - filtered[0].expEnabled;

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: filtered,
            keys: {
              x: 'month',
              value: ['expDisabled', 'expEnabled']
            },
            type: 'pie',
            colors: {
              expEnabled: '#D62728', //green
              expDisabled: '#2CA02C', // red
            },

          },

        });
        drawTable(["month", "expDisabled", "expEnabled", "total"], filtered);
      }
    }).error(function() {
      $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
      $("#loader").css("display", "none");
    }).done(function() {
      $("#loader").css("display", "none");

    });


  });



}

function loadECDHE() {

  var totalHosts, filteredTotalHosts, filtered, chart, distribution;

  jQuery.get("https://hotcat.de:1337/api/v0/pfs/overview", function(response) {
    totalHosts = response;
  }).error(function() {
    $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
    $("#loader").css("display", "none");
  }).done(function() {

    var tld = $('#filterTLD').val().replace('.', '');

    // Load data from the server using a HTTP GET request
    // jquery.get is a equivalent to $.ajax({....
    jQuery.get("https://hotcat.de:1337/api/v0/pfs/distribution?tld=" + tld, function(response) {
      var start = getTimespan();

      if (start[0] !== start[1]) {

        // filter response Array by timespan
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));
        // create array with months for x-axis
        var months = [];
        for (var i = 0; i < filtered.length; i++) {
          months.push(filtered[i].month);
        }

        // filter hostcount endpoint by given timespan
        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        // calc  percentual line
        for (var i = 0; i < filtered.length; i++) {
          distribution = filtered[i].distribution;
          if (!tld) {
            filtered[i].totalHosts = filteredTotalHosts[i].monthlyPfsEnabled;
          }
          for (var j = 0; j < distribution.length; j++) {
            // if TLD is given 
            if (tld) {
              distribution[j].percent = ((distribution[j].count / filtered[i].totalHosts) * 100).toFixed(2);
            } else {
              distribution[j].percent = ((distribution[j].count / filteredTotalHosts[i].monthlyPfsEnabled) * 100).toFixed(2);
            }
          }
        }
        // Convert the response in syntax like : { '512': [323,3234], '1024': [421,3424]}
        var json = {};

        for (var i = 0; i < filtered.length; i++) {
          // get distribution array
          distribution = filtered[i].distribution;
          var tempArray = [];
          for (var j = 0; j < distribution.length; j++) {
            // only take ecdh keygroups
            if (distribution[j].kx === "ECDH") {
              tempArray.push(distribution[j]);
              if (!(Array.isArray(json[distribution[j].kxStrength]))) {
                json[distribution[j].kxStrength] = [];
              }
              // if there is ja new key and the previous elements in the array are null, then c3 will not work
              if (i >= 1 && !json[distribution[j].kxStrength][i - 1]) {
                json[distribution[j].kxStrength][i - 1] = 0;
              }
              json[distribution[j].kxStrength].push(distribution[j].percent);

            }

          }
          filtered[i].distribution = tempArray;
        }

        drawTable(["month", "distribution", "totalHosts"], filtered, ["kxStrength", "count", "percent"]);

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: json,
          },
          axis: {
            x: {
              type: 'category',
              categories: months,
            },
            y: {
              label: {
                text: 'In Percent',
                position: 'outer-middle'
              },
              min: 0,
              max: 99,
            }
          },
        });
      } else {

        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));
        // filter hostcount endpoint by given timespan
        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));


        // remove ECDHE data
        var filteredElement = filtered[0].distribution;

        for (var i = filteredElement.length - 1; i >= 0; i--) {
          if (tld) {
            filteredElement[i].totalHosts = filtered[0].totalHosts;
          } else {
            filteredElement[i].totalHosts = filteredTotalHosts[0].monthlyPfsEnabled;
          }
          if (filteredElement[i].kx === "DH") {
            filteredElement.splice(i, 1);
          }
        }
        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: filteredElement,
            keys: {
              x: 'kxStrength',
              value: ['count']
            },
            type: 'bar',
          },
          axis: {
            x: {
              type: 'category',
            },
            y: {
              label: {
                text: 'Total Count',
                position: 'outer-middle'
              },
            }
          },
        });
        drawTable(["kxStrength", "count", "totalHosts"], filteredElement);
      }
    }).error(function() {
      $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
      $("#loader").css("display", "none");
    }).done(function() {
      $("#loader").css("display", "none");
    });

  });


}



function loadDHE() {

  var totalHosts, filteredTotalHosts, filtered, chart, distribution;
  // The base is the server which supports pfs (dhe or ecdhe enabled)
  jQuery.get("https://hotcat.de:1337/api/v0/pfs/overview", function(response) {
    totalHosts = response;
  }).error(function() {
    $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
    $("#loader").css("display", "none");
  }).done(function() {

    var tld = $('#filterTLD').val().replace('.', '');
    tld = tld;

    // Load data from the server using a HTTP GET request
    // jquery.get is a equivalent to $.ajax({....
    jQuery.get("https://hotcat.de:1337/api/v0/pfs/distribution?tld=" + tld, function(response) {
      var chart;
      var start = getTimespan();

      if (start[0] !== start[1]) {

        // filter response Array by timespan
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

        // fill months for x-axis
        var months = [];
        for (var i = 0; i < filtered.length; i++) {
          months.push(filtered[i].month);
        }

        // filter hostcount endpoint by given timespan
        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));


        //  calc percentual line
        for (i = 0; i < filtered.length; i++) {
          distribution = filtered[i].distribution;
          if (!tld) {
            filtered[i].totalHosts = filteredTotalHosts[i].monthlyPfsEnabled;
          }
          for (var j = distribution.length - 1; j >= 0; j--) {
            if (tld) {
              distribution[j].percent = ((distribution[j].count / filtered[i].totalHosts) * 100).toFixed(2);
            } else {
              distribution[j].percent = ((distribution[j].count / filteredTotalHosts[i].monthlyPfsEnabled) * 100).toFixed(2);
            }

          }
        }

        // Convert the response in syntax like : { '512': [323,3234], '1024': [421,3424]}
        var json = {};
        // iterate over all months
        for (i = 0; i < filtered.length; i++) {
          // get distribution array
          distribution = filtered[i].distribution;
          // this array is for table, graph differs from the table
          var tempArray = [];
          // iterate over the distribution of one month
          for (var j = 0; j < distribution.length; j++) {
            // only take dh keygorups
            if (distribution[j].kx === "DH") {
              tempArray.push(distribution[j]);
              // fields with the value 0 should not be drawn
              if (distribution[j].percent !== 0) {
                if (!(Array.isArray(json[distribution[j].kxStrength]))) {
                  json[distribution[j].kxStrength] = [];
                }
                // if there is ja new key and the previous elements in the array are null, then c3 will not work
                if (i >= 1 && !json[distribution[j].kxStrength][i - 1]) {
                  json[distribution[j].kxStrength][i - 1] = 0;
                }
                json[distribution[j].kxStrength][i] = distribution[j].percent;
              }


            }

          }
          filtered[i].distribution = tempArray;

        }


        // draw Table and say which keys should be printed,
        drawTable(["month", "distribution", "totalHosts"], filtered, ["kxStrength", "count", "percent"]);

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: json,
          },
          axis: {
            x: {
              type: 'category',
              categories: months,
            },
            y: {
              label: {
                text: 'In Percent',
                position: 'outer-middle'
              },
              min: 0,
              max: 99,
            }
          },

        });


      } else {
        filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));
        // filter hostcount endpoint by given timespan
        filteredTotalHosts = filterResponseByTimespan(totalHosts, new Date(parseInt(start[0])), new Date(parseInt(start[1])));


        // remove ECDHE data
        var filteredElement = filtered[0].distribution;

        for (var i = filteredElement.length - 1; i >= 0; i--) {
          if (tld) {
            filteredElement[i].totalHosts = filtered[0].totalHosts;
          } else {
            filteredElement[i].totalHosts = filteredTotalHosts[0].monthlyPfsEnabled;

          }

          if (filteredElement[i].kx === "ECDH") {
            filteredElement.splice(i, 1);
          }

        }

        chart = c3.generate({
          bindto: '#chart',
          data: {
            json: filteredElement,
            keys: {
              x: 'kxStrength',
              value: ['count']
            },
            type: 'bar',
          },
          axis: {
            x: {
              type: 'category',
            },
            y: {
              label: {
                text: 'Total Count',
                position: 'outer-middle'
              },
            }
          },
        });
        drawTable(["kxStrength", "count", "totalHosts"], filteredElement);
      }
    }).error(function() {
      $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
      $("#loader").css("display", "none");
    }).done(function() {
      $("#loader").css("display", "none");
    });



  });



}


function loadPFS() {
  // Load data from the server using a HTTP GET request
  // jquery.get is a equivalent to $.ajax({....
  jQuery.get("https://hotcat.de:1337/api/v0/pfs/overview", function(response) {
    // Get Timespan, in this case two elements with start and end time
    var filtered, overview, chart;
    var start = getTimespan();
    // get TLD 
    var tld = $('#filterTLD').val().replace('.', '');

    // Check if start and end values of the slider are the same
    if (start[0] !== start[1]) {

      filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));

      // filling the x axis with dates
      var months = ['x'];
      for (var i = 0; i < filtered.length; i++) {
        months.push(filtered[i].month);
      }

      // if tld is given
      if (tld) {
        var tldOverview = [];

        for (var j = 0; j < months.length - 1; j++) {
          overview = filtered[j].overviews;
          for (i = 0; i < overview.length; i++) {
            if (overview[i].tld === tld) {
              overview[i].monthlyPfsEnabled = overview[i].pfsEnabled;
              overview[i].monthlyPfsDisabled = overview[i].pfsDisabled;
              overview[i].monthlyTotalHosts = overview[i].totalHosts;
              tldOverview.push(overview[i]);
            }
          }
        }

        filtered = tldOverview;

      }

      // filling data about pfs enabled
      var pfsEnabled = ['PFS_Support'];
      for (i = 0; i < filtered.length; i++) {
        pfsEnabled.push(((filtered[i].monthlyPfsEnabled / filtered[i].monthlyTotalHosts) * 100).toFixed(2));
      }

      chart = c3.generate({
        bindto: '#chart',
        data: {
          x: 'x',
          columns: [
            months,
            pfsEnabled,
          ],
          colors: {
            PFS_Support: '#2CA02C', // green
          },
        },
        type: 'line',
        axis: {
          x: {
            type: 'category',
          },
          y: {
            label: {
              text: 'In percent',
              position: 'outer-middle'
            },
            min: 0,
            max: 99,
          }
        },
        subchart: {
          show: true
        },
      });
      drawTable(["month", "monthlyPfsEnabled", "monthlyPfsDisabled", "monthlyTotalHosts"], filtered);
    } else {
      filtered = filterResponseByTimespan(response, new Date(parseInt(start[0])), new Date(parseInt(start[1])));
      // if tld is given
      if (tld) {
        overview = filtered[0].overviews;
        for (var i = 0; i < overview.length; i++) {
          if (overview[i].tld === tld) {
            filtered = [];
            overview[i].monthlyPfsEnabled = overview[i].pfsEnabled;
            overview[i].monthlyPfsDisabled = overview[i].pfsDisabled;
            overview[i].monthlyTotalHosts = overview[i].totalHosts;
            filtered.push(overview[i]);
          }
        }
      }


      chart = c3.generate({
        bindto: '#chart',
        data: {
          json: filtered,
          keys: {
            value: ['monthlyPfsEnabled', 'monthlyPfsDisabled'],
          },
          type: 'pie',
        },
      });
      drawTable(["month", "monthlyPfsEnabled", "monthlyPfsDisabled", "monthlyTotalHosts"], filtered);
    }
  }).error(function() {
    $('#error-message').html('<div class="alert alert-danger" role="alert">Error loading JSON!</div>');
    $("#loader").css("display", "none");
  }).done(function() {

    $("#loader").css("display", "none");
  });
}