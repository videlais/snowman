import DOMUtils from './DOMUtils.js';

class Screen {
  /**
   * Trigger screen-lock event.
   * @function lock
   */
  static lock () {
    // Append an element filling screen with CSS loading spinner.
    DOMUtils.append(document.body, '<tw-screenlock><div class="loading"></div></tw-screenlock>');
  }

  /**
   * Trigger screen-unlock event.
   * @function unlock
   */
  static unlock () {
    // Remove tw-screenlock element, if there is one.
    DOMUtils.remove('tw-screenlock');
  }
}

export default Screen;
