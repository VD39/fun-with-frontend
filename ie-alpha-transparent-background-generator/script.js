(function(window, document) {
  'use strict';

  //get elements
  var elements = {
    inputForm: document.getElementById('input-form'),
    resultForm: document.getElementById('result-form'),
    colourEl: document.getElementById('colour'),
    opacityEL: document.getElementById('opacity'),
    resultEL: document.getElementById('result'),
    outputEl: document.getElementById('output'),
    elName: document.getElementById('element-name'),
    errorEl: document.getElementById('error'),
    styles: document.getElementById('styles'),
  };

  /**
   * Checks the colour hex value is valid
   * @param {string} colour
   */
  function checkColour(colour) {
    var regex = /^([0-9a-f]){6}$/i;
    return regex.test(colour.trim());
  }

  /**
   * Checks the opacity value is valid
   * @param {number} opacity
   */
  function checkOpacity(opacity) {
    return opacity >= 0 && opacity <= 1;
  }

  /**
   * Display's the error message to user
   * @param {string} message
   */
  function showError(message) {
    elements.errorEl.style.display = 'block';
    elements.errorEl.querySelector('#error-message').innerHTML = message;
    return false;
  }

  /**
   * Validates the form values are entered
   * @param {string} colour
   * @param {number} opacity
   */
  function validateForm(colour, opacity) {
    elements.errorEl.style.display = 'none';
    var message = '';
    if (!colour || !opacity) {
      message += 'All required values must be set.';
      return showError(message);
    }

    if (!checkColour(colour)) {
      message +=
        'The colour value: ' +
        colour +
        ' is not a valid. Please enter a six digit hex value.<br>';
    }

    if (!checkOpacity(opacity)) {
      message +=
        'The opacity value: ' +
        opacity +
        ' is not a valid. Please make sure it is a decimal between 0 and 1.';
    }

    if (message !== '') {
      return showError(message);
    }

    return true;
  }

  /**
   * Generates the CSS
   * @param {string} name
   * @param {string} rgb
   * @param {string} hexOpacity
   * @param {string} colour
   * @param {number} opacity
   */
  function getCSS(name, rgb, hexOpacity, colour, opacity) {
    return [
      '' + name + ' {',
      '    background:rgb(' + rgb + ');',
      '    background: transparent\\9;',
      '    background:rgba(' + rgb + ',' + opacity + ');',
      "    filter:progid:DXImageTransform.Microsoft.gradient(startcolourstr='#" +
        hexOpacity +
        colour +
        "', endcolourstr='#" +
        hexOpacity +
        colour +
        "');",
      '    zoom: 1;',
      '}',
      '',
      '' + name + ':nth-child(n) {',
      '    filter: none;',
      '}',
    ].join('\n');
  }

  /**
   * Converts the hex value into the RGB value
   * @param {string} hex
   */
  function hexToRgb(hex) {
    var red = parseInt(hex.substring(0, 2), 16);
    var green = parseInt(hex.substring(2, 4), 16);
    var blue = parseInt(hex.substring(4, 6), 16);
    return red + ',' + green + ',' + blue;
  }

  /**
   * Converts the opacity into the hex value
   * @param {numner} opacity
   */
  function opacityToHex(opacity) {
    var num = opacity * 255;
    return Math.floor(num).toString(16);
  }

  /**
   * Generte the CSS for text area and style tag
   * @param {string} colour
   * @param {number} opacity
   */
  function generateCSS(colour, opacity) {
    var rgb = hexToRgb(colour);
    var hexOpacity = opacityToHex(opacity);
    var name = elements.elName.value || '.div';

    elements.resultEL.value = getCSS(name, rgb, hexOpacity, colour, opacity);
    name = '#output';
    elements.styles.innerHTML = getCSS(name, rgb, hexOpacity, colour, opacity);
  }

  /**
   * Function for when generate CSS button is clicked
   */
  elements.inputForm.onsubmit = function(event) {
    event.preventDefault();
    var colour = elements.colourEl.value;
    var opacity = elements.opacityEL.value;

    if (validateForm(colour, opacity)) {
      generateCSS(colour, opacity);
    }
  };

  /**
   * Function for when copy to clipboard button is clicked
   */
  elements.resultForm.onsubmit = function(event) {
    event.preventDefault();

    if (!elements.resultEL.value) {
      return;
    }

    elements.resultEL.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful
        ? 'successful, you may copy to your css file.'
        : 'unsuccessful. Please try again';
      window.alert('Copying CSS text was ' + msg);
      elements.resultEL.blur();
    } catch (err) {
      window.alert('Oops, unable to copy');
    }
  };

  //helper function
  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  }
})(window, document);
