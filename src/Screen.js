const $ = require('jquery');

class Screen {
  /**
   * Trigger screen-lock event.
   *
   * @function lock
   */
  static lock () {
    // Append an element filling screen with CSS loading spinner.
    $(document.body).append('<tw-screenlock><div class="loading"></div></tw-screenlock>');
  }

  /**
   * Trigger screen-unlock event.
   *
   * @function unlock
   */
  static unlock () {
    // Remove tw-screenlock element, if there is one.
    $('tw-screenlock').remove();
  }
}

module.exports = Screen;
