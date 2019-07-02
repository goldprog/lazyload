(function(global, factory) {
  global.Lozad = factory()
})(this, function() {
  var defaultOptions = {
    thresholds: 0,
    load: function(el) {
      el.src = el.dataset.src
      el.onload = function() {
        console.log('图片：'+el.src+'加载了')
      }
    }
  }
  var _extend = Object.assign || 
  function(target) {
    for(var i=1; i< arguments.length; i++) {
      for(var key in arguments[i]) {
        target[key] = arguments[i][key]
      }
    }
    return target
  }

  var Lozad = function() {
    this.$selector = (arguments.length > 0 && arguments[0] !== undefined) ? arguments[0] : '.lozad'
    this._$options = (arguments.length > 0 && arguments[1] !== undefined) ? arguments[1] : {}
    this.$mergeOptions = _extend({}, defaultOptions, this._$options)
    this.thresholds = this.$mergeOptions.thresholds
    this.load = this.$mergeOptions.load
    this.io = window.IntersectionObserver ? new IntersectionObserver(this._callback.call(this, this.load), {thresholds: this.thresholds}) : void 0
  }
  Lozad.prototype = {
    construtor: Lozad,
    observer: function() {
      var elements = this._getElements(this.$selector)
      for(var i =0; i<elements.length; i++) {
        var element = elements[i]
        if(this._isLoaded(element)) {
          continue 
        }
        if(this.io) {
          this.io.observe(element)
          continue
        }
        this.load(element)
        this._markAsLoad(element)
      }
    },
    _getElements: function(selector) {
      if(selector instanceof Element) {
        return [selector]
      } else if(selector instanceof NodeList) {
        return selector
      } else {
        return document.querySelectorAll(selector)
      }
    },
    _isLoaded: function(element) {
      return element.getAttribute('data-load') === 'true'
    },
    _markAsLoad: function(element) {
      element.setAttribute('data-load', true)
    },
    _callback: function(load) {
      var _this = this
      return function(entires) {
        entires.forEach(function(entry) {
          if(entry.intersectionRatio > 0) {
            _this.io.unobserve(entry.target)
            if(!_this._isLoaded(entry.target)) {
              load(entry.target)
              _this._markAsLoad(entry.target)
            } 
          }
        })
      }
    }
  }
  return Lozad
})