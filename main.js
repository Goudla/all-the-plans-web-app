'use strict';

// Utils
/**
 * Format a number as currency
 * @param  {number} value The value to be formatted
 * @return {string}       The value formatted as currency
 */
function formatCurrency(value) {
  if (!value) return;

  var a = value.toFixed(2).split('');
  var l = a.length;
  for (var i = l - 6; i >= 3 ; i -= 3) {
    a.splice(i, 0, ',');
  }

  return '$' + a.join('');
}

(function() {
  var url = 'https://wt-douglasbamber-gmail_com-0.sandbox.auth0-extend.com/plans';

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
  }

  function newReq(url, callBack) {
    var xmlhttp;
    if (window.XDomainRequest) {
      xmlhttp = new XDomainRequest();
      xmlhttp.onload = function() {
        callBack(xmlhttp.responseText)
      };
    } else if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          callBack(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET",url,true);
    xmlhttp.send();
  }

  newReq(url, function(data) {
    var array = JSON.parse(data);
    var total = array.length;
    var sortOrder = getQueryVariable('sortOrder') || 'floorArea';
    var sortDirection = getQueryVariable('sortDirection');
    var sortedArray;
    if (sortOrder) {
      sortedArray = array.sort(function(a, b) {
        var valueA = isNaN(a[sortOrder]) ? a[sortOrder].toUpperCase() : a[sortOrder];
        var valueB = isNaN(b[sortOrder]) ? b[sortOrder].toUpperCase() : b[sortOrder];
        if (valueA < valueB) {
          return sortDirection === 'desc' ? 1 : -1;
        }
        if (valueA > valueB) {
          return sortDirection === 'desc' ? -1 : 1;
        }
        return 0;
      });
    } else {
      sortedArray = array
    }
    var out = "";
    var i;
    for(i = 0; i < sortedArray.length; i++) {
      var value = sortedArray[i];
      out += [
        '<a class="card" href="' + value.link + '" target="_blank" >',
        '<img src="' + value.thumbnailImage + '" alt="' + value.title + '">',
        '<div class="card-body">',
        '<h4 class="card-title">',
         value.title,
        ' - ',
        value.floorArea,
        ' m<sup>2</sup>',
        ' - ',
        value.price ? formatCurrency(value.price) : 'POA',
        '</h4>',
        '<h6 class="card-subtitle">',
        value.companyTitle,
        value.collectionTitle ? ' / ' : '',
        value.collectionTitle || '',
        '</h6>',
        '<h6 class="card-subtitle">' + value.bedrooms + ' bedroom(s) ' + value.bathrooms + ' bathroom(s) ' + value.garages + ' garage(s)' + '</h6>',
        '</div>',
        '</a>'
      ].join('');
    }
    document.getElementById('loading').style.display = 'none';
    document.getElementById('total').innerHTML = total + ' Plans';
    document.getElementById('plans').innerHTML = out;
  });
})();
