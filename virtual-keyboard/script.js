const Keyboard = {
  elements: {
    main: null,
    keyContainer: null,
    keys: [],
    keyboardInput: null
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: '',
    capsLock: false,
    capsText: false,
    shift: false
  },

  init() {
    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('keyboard', 'keyboard--hidden');

    this.elements.keyContainer = document.createElement('div');
    this.elements.keyContainer.classList.add('keyboard__keys');
    this.elements.keyContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keyContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keyContainer);
    document.body.appendChild(this.elements.main);

    document.querySelectorAll('.use-keyboard-input').forEach(element => {

      // Capslock checking with a physical keyboard
      element.addEventListener('click', (e) => {
        this.properties.keyboardInput = element;
        this.properties.capsLock = !e.getModifierState('CapsLock');
        this._toggleCapsLock();
        document.querySelector('.caps').classList.toggle('keyboard__key--active', this.properties.capsLock)
      });

      element.addEventListener('focus', (e) => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });

        // Blinking cursor
        this.elements.main.onmousedown = function (e) {
          if (document.activeElement === element) {
            e.preventDefault();
          }
        }
      });
    });

  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
      "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "done", "space"
    ];

    const createIconHTML = (iconName) => {
      return `<i class='material-icons'>${iconName}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', ']', 'enter', '?'].indexOf(key) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent('oninput');
          });

          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'caps');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });

          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.textContent = key[0].toUpperCase() + key.substring(1, key.length).toLowerCase();

          keyElement.addEventListener('click', () => {
            this._toggleShift()
            keyElement.classList.toggle('keyboard__key--active', this.properties.shift);
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            this.properties.value += '\n';
            this._triggerEvent('oninput');
          });

          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            this.properties.value += ' ';
            this._triggerEvent('oninput');
          });

          break;

        case 'done':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('keyboard_hide');

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.classList.add('keyboard__key--caps');

          keyElement.addEventListener('click', () => {
            this.properties.value += this.properties.capsText ? key.toUpperCase() : key.toLowerCase();
            this._triggerEvent('oninput');
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.classList.contains('keyboard__key--caps')) {
        this.properties.capsText = (!this.properties.capsLock && this.properties.shift || this.properties.capsLock && !this.properties.shift) || false;
        key.textContent = this.properties.capsText ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;

    for (const key of this.elements.keys) {
      if (key.classList.contains('keyboard__key--caps')) {
        this.properties.capsText = (!this.properties.capsLock && this.properties.shift || this.properties.capsLock && !this.properties.shift) || false;
        key.textContent = this.properties.capsText ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
    this.properties.keyboardInput.blur();
  }

};

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.init();
});
