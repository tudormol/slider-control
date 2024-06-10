
/**

  Custom range input UI component.

  @see PARAMS:

  @param {string} selector    css dom element selector string / dom object
  @param {string} setValue    value to set
  @param {function} onChange  fn to call on change

  ```

  HTML:
  <div class="slider volume">
      <span class="current"></span>
      <span class="bg"></span>
      <div class="knob"></div>
  </div>

  JS:
  volumeSlider = new RangeInput({
    selector : '.slider.volume',
    onChange : function (value, domElement) { },
    setValue : 75
  })
  ```

  @see METHODS:

  @method setValue (value, updateUI) value 0..100
  @method increaseValue (amount) increase value by amount
  @method decreaseValue (amount) decrease value by amount
  @member getValue get value of control

 */


class RangeInput {

  constructor (options) {

    var t = this

    var defaults = {
      selector  : '',
      setValue  : null,
      onChange  : null
    }

    var opts = Object.assign(defaults, options)
    var t = this

    // store props
    t.opts = opts
    t.opts.selector = typeof t.opts.selector === 'string' ? document.querySelector(t.opts.selector) : t.opts.selector
    t.domElement = t.opts.selector


    if (!t.opts.selector) {
      return
    }

    t.knob = t.domElement.querySelector('.knob')

    if (!t.knob) {
      console.error('Wrong html for custom range input (.knob missing).')
    }

    if (!isNaN(t.opts.setValue)) {
      t.setValue(t.opts.setValue, true, true)
    }

    t._addEventListeners()


  }

  _addEventListeners() {

    var t         = this
    var drag      = false
    var bounds    = t.domElement.getBoundingClientRect()
    var knobWidth = t.knob.clientWidth


    var positionKnob = function (x) {

      var left = bounds.left
      var val

      if (x < left) {
        x = left
      }

      if (x > bounds.right - knobWidth) {
        x = bounds.right - knobWidth
      }

      var pos  = x - left

      t.knob.style.left = pos + 'px'

      val = Math.floor((pos / (bounds.width - knobWidth)) * 100)

      t.domElement.querySelector('span.current').style.width = pos + 'px'

      t.setValue(val)
    }


    var onMouseMove = function (e) {

      if (drag) {
        positionKnob(e.clientX)
      }

    }


    var onMouseUp = function (e) {

      drag = false



      document.body.removeEventListener('mousemove', onMouseMove)
      document.body.removeEventListener('mouseup', onMouseUp)

      e.preventDefault()
      e.stopPropagation()
    }


    t.domElement.addEventListener('mousedown', function (e) {

      drag = true

      positionKnob(e.clientX - knobWidth/2)

      document.body.addEventListener('mousemove', onMouseMove)
      document.body.addEventListener('mouseup', onMouseUp)

      e.preventDefault()
      e.stopPropagation()
    })

  }

  _onChange (value) {

    var t = this

    if (typeof t.opts.onChange === 'function') {
      t.opts.onChange(value, t.domElement)
    }
  }


  // use skipTriggeringChange from init not to call onchange fn on init
  setValue (value, updateUI, skipTriggeringChange) {

    var t = this

    t.value = value
    t.domElement.setAttribute('data-value', value)

    if (updateUI) { // only do on init
      if (value < 0) {
        value = 0
      }

      if (value > 100) {
        value = 100
      }

      var bounds    = t.domElement.getBoundingClientRect()
      var knobWidth = t.knob.clientWidth
      var pos       = Math.floor((bounds.width - knobWidth) * value / 100)

      t.knob.style.left = pos + 'px'

      t.domElement.querySelector('span.current').style.width = pos + 'px'
    }

    if (!skipTriggeringChange) {
      t._onChange(value)
    }

  }

  increaseValue (amount) {
    
    var t          = this
    var amount     = (typeof amount === 'undefined') ? 10 : amount
    var currentVal = t.getValue()
    var newVal     = currentVal + amount

    if (newVal > 100) {
      newVal = 100
    }

    t.setValue(newVal, true)


  }

  decreaseValue (amount) {

    var t          = this
    var amount     = (typeof amount === 'undefined') ? 10 : amount
    var currentVal = t.getValue()
    var newVal     = currentVal - amount

    if (newVal < 0) {
      newVal = 0
    }

    t.setValue(newVal, true)

  }

  getValue () {
    return this.value
  }

}
