class ThemeToggler extends HTMLElement {
    constructor () {

      super();

      this.setup();
    }

    connectedCallback () {

      this.setup();
    }

    disconnectedCallback () {

      this.toggler.removeEventListener('click', this);
      this.matchMedia.removeEventListener('change', this);
    }

    handleEvent (event) {

      event.preventDefault()

      const hasDark = this.matchMedia.matches

      switch (this.toggler.getAttribute('state')) {
        case 'auto':
          this.changeState(hasDark ? 'light' : 'dark');
          break;

        case 'light':
          this.changeState(hasDark ? 'auto' : 'dark');
          break;

        case 'dark':
          this.changeState(hasDark ? 'light' : 'auto');
          break;
      }
      this.updateLabel();
    }

    /**
     * Initialize element
     *
     * @returns void;
     */
    setup () {

      if (this._instantiated) return;

      this.innerHTML = `
        <button
          id="theme-toggler"
          aria-label="Change to dark theme"
          state="auto">
          <span></span></button>`;

      this.toggler = this.querySelector("#theme-toggler");
      this.storage = window.localStorage;
      this.root = document.documentElement;
      this.matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

      this.toggler.addEventListener('click', this);

      this.initialTheme();
      this.updateLabel();

      this.matchMedia.onchange =(e) => {
        this.updateLabel();
      };
    }

    /**
     * Check initial theme
     * and set if it defined in localStorage
     */
    initialTheme () {
      const persistedTheme = this.storage.getItem('theme')
      const hasTheme = typeof persistedTheme === 'string'

      if (hasTheme) {
        this.changeState(persistedTheme)
      }
    }

    /**
     * Change button & theme state
     * @param {string} state State to change
     */
    changeState (state) {
      state = state.toLowerCase();
      const states = ['auto', 'dark', 'light'];
      const cleanState = states.includes(state) ? state : 'auto';

      this.toggler.setAttribute('state', cleanState);
      this.storage.setItem('theme', cleanState)

      if (cleanState !== 'auto') {
        this.root.setAttribute('data-theme', cleanState)
      } else {
        this.root.removeAttribute('data-theme')
      }
    }

    /**
     * Update button label based on button state and theme
     */
    updateLabel () {
      const nextText = this.getNextState();
      this.toggler.setAttribute('aria-label', `Change to ${nextText} theme`);
    }

    /**
     * Get Next State based on current state and theme
     * @returns text label
     */
    getNextState () {

      const hasDark = this.matchMedia.matches;
      const currentState = this.toggler.getAttribute('state');

      switch (currentState) {
        case 'auto':
          return hasDark ? 'light' : 'dark';

        case 'light':
          return 'dark';

        case 'dark':
          return 'light';
      }
    }
  };

window.customElements.define('theme-toggler', ThemeToggler);
