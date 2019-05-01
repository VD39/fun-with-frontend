(function(window) {
  'use strict';

  var IS_CLICKED = false;

  var MapBuilder = function(element, width, height) {
    this.width = width || 50;
    this.height = height || 18;
    this.element = element;

    this.setupPalette = function() {
      var $swatch = this.element.find('.palette .swatch');
      $swatch.on('click', function() {
        IS_CLICKED = false;
        $swatch.removeClass('selected');
        $(this).addClass('selected');
      });
    };

    this.setupCanvas = function() {
      function onMouseEnter() {
        var $selectedClass = $('.palette .swatch.selected');
        var $currentClass = $selectedClass
          .attr('class')
          .replace('swatch', '')
          .replace('selected', '')
          .trim();
        var $current = $(this);

        if (!$selectedClass.hasClass($current.attr('data-current'))) {
          $current
            .addClass($currentClass)
            .removeClass($current.attr('data-current'));
          if (IS_CLICKED) {
            $current.attr('data-current', $currentClass);
          }
        }
      }

      function onMouseLeave() {
        var $current = $(this);
        var mapCurrent = $current.attr('data-current');

        if (!$current.hasClass(mapCurrent)) {
          if (!IS_CLICKED) {
            $current.attr('class', '').addClass('tile swatch ' + mapCurrent);
          }
        }
      }

      function onMouseDown(event) {
        if (event.which === 1) {
          IS_CLICKED = true;
          var $selectedClass = $('.palette .swatch.selected');
          var $currentClass = $selectedClass
            .attr('class')
            .replace('swatch', '')
            .replace('selected', '')
            .trim();
          var $current = $(this);

          if (!$selectedClass.hasClass($current.attr('data-current'))) {
            $current
              .addClass($currentClass)
              .removeClass($current.attr('data-current'));

            if (IS_CLICKED) {
              $current.attr('data-current', $currentClass);
            }
          }
        }
      }

      function onMouseUp() {
        IS_CLICKED = false;
      }

      var $mapCanvas = this.element.find('#map .swatches');
      $mapCanvas.empty();

      for (var index = 0; index < this.height; index++) {
        var $div = $('<div />');
        $div.addClass('row');

        for (var index1 = 0; index1 < this.width; index1++) {
          var $rowDiv = $('<div />');
          $rowDiv.addClass('tile swatch grass').attr('data-current', 'grass');
          $div.append($rowDiv);
          $rowDiv.on('mouseenter', onMouseEnter);
          $rowDiv.on('mouseleave', onMouseLeave);
          $rowDiv.on('mousedown', onMouseDown);
          $rowDiv.on('mouseup', onMouseUp);
        }
        $mapCanvas.append($div);
      }
    };
  };

  window.MapBuilder = MapBuilder;
})(window);
