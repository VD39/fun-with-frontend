(function(window) {
  'use strict';

  // The size of a swatch (in pixels)
  var SWATCH_SIZE = 25;

  // Utility function - checks if a given swatch name is walkable terrain.
  function isTerrain(swatchType) {
    swatchType = swatchType.trim();
    return (
      [
        'grass',
        'flowers-red',
        'flowers-orange',
        'flowers-blue',
        'weed',
        'weed-4x',
        'weed-small',
        'weed-2x',
        'field',
        'sand-patch',
        'sand',
        'sand-nw',
        'sand-n',
        'sand-ne',
        'sand-w',
        'sand-e',
        'sand-sw',
        'sand-s',
        'sand-se',
        'sand-nw-inverse',
        'sand-ne-inverse',
        'sand-sw-inverse',
        'sand-se-inverse',
      ].indexOf(swatchType) > -1
    );
  }

  function checkIfNegative(number, type) {
    var temp = number;
    if (type === 'minus') {
      temp--;
    } else {
      temp++;
    }

    if (temp < 0) {
      return number;
    }
    return temp;
  }

  /*
   * Constructor for the player (Pikachu sprite).
   *
   * @param x - The beginning x coordinate (usually zero)
   * @param y - The beginning y coordinate (usually zero)
   * @param builder - The MapBuilder object, with information about the map.
   * In particular, this builder object should have the container element
   * as a property so the '.map' div can be found using a jQuery 'find' call.
   */
  function Player(x, y, builder) {
    this.builder = builder;
    this.map = builder.element.find('#map');
    this.position = {
      x: x,
      y: y,
    };

    this.addPlayer = function() {
      var $playerEl = this.map.find('.player');
      var css = {
        left: this.position.x * SWATCH_SIZE,
        top: this.position.y * SWATCH_SIZE,
      };

      if ($playerEl.length < 1) {
        var $player = $('<div>').addClass('player facing-down');
        $player.css(css);
        this.map.prepend($player);
      } else {
        $playerEl.addClass('facing-down').css(css);
      }
    };

    this.addKeyDown = function() {
      var pos = this.position;

      function movePlayer(event) {
        var key = event.which;
        var tempPos = {
          x: pos.x,
          y: pos.y,
        };

        if ([37, 38, 39, 40].indexOf(key) > -1) {
          var $playerEl = $('.player');
          $playerEl.attr('class', '').addClass('player');
          var className = '';

          switch (key) {
            case 37:
              className = 'facing-left';
              pos.x = checkIfNegative(pos.x, 'minus');
              break;
            case 38:
              className = 'facing-up';
              pos.y = checkIfNegative(pos.y, 'minus');
              break;
            case 39:
              className = 'facing-right';
              pos.x = checkIfNegative(pos.x, 'plus');
              break;
            case 40:
              className = 'facing-down';
              pos.y = checkIfNegative(pos.y, 'plus');
              break;
            default:
              break;
          }

          $playerEl.addClass(className);

          var swatch = $('#map .swatches .row')
            .eq(pos.y)
            .find('.tile')
            .eq(pos.x);

          if (swatch.length > 0) {
            var currentSwatch = swatch
              .attr('class')
              .replace('tile', '')
              .replace('swatch', '');

            if (isTerrain(currentSwatch)) {
              $playerEl.css({
                left: pos.x * SWATCH_SIZE,
                top: pos.y * SWATCH_SIZE,
              });
            } else {
              pos = tempPos;
            }
          } else {
            pos = tempPos;
          }
          return false;
        }
      }

      $(document).on('keydown', movePlayer);
    };
  }

  window.Player = Player;
})(window);
