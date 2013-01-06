/* ===================================================
 * bootstrap-multivalue.js v0.0.1
 * ===================================================
 * Copyright 2012 Sathit Jittanupat.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

 !function($){

  "use strict"; // jshint ;_;


 /* Multivalue PUBLIC CLASS DEFINITION
  * ================================= */
  var Multivalue = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.multivalue.defaults, options)
    this.values = [].concat(this.options.values || [])
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
    this.seperator = this.options.seperator || ','
    this.items = this.options.items || 0
    this.lookup()
  }
  if (!RegExp.escape) {
      RegExp.escape = function(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')  
      }
  }
  Multivalue.prototype = {

    constructor: Multivalue
    
  , sepSigns: {
        ',' : '&sbquo;'
      , '-' : '&minus;'
      , '~' : '&sim;'
      , '*' : '&loast;'
    }

  , splitter: function(val) {
      return val.split(this.seperator)
    }

  , joiner: function(items) {
    return items.join(this.seperator)
  }
    
  , store: function () {
  
      var val = this.splitter(this.$element.val())
        , v
        
      while (val.length) {
        if (this.options.item && this.options.items <= this.values.length)
          break
          
        v = val.shift()
        if (v.trim()!='') {
          this.values.push(v)
        }
      }
      
      this.$element.val(this.joiner(val))
      return this
    }
    
  , restore: function () {
  
      if (this.values.length) {
        var items = [].concat(this.values)
  
        this.values = []

        if (this.$element.val()) items.push(this.$element.val())

        this.$element.val(this.joiner(items))
      }
      return this
    }

  , show: function () {
      
      switch(this.options.menuAlign) 
      {
        case 'right':
          this.$element
            .addClass('pull-left')
            .css('margin-right',this.options.menuMargin)
          this.$menu
            .insertAfter(this.$element)
            .show()
          break
          
        case 'top':
          this.$menu
            .css('margin-bottom',this.options.menuMargin)
            .insertBefore(this.$element)
            .show()
          break
          
        case 'bottom':
          this.$menu
            .css('margin-top',this.options.menuMargin)
            .insertAfter(this.$element)
            .show()
          break
          
        default:
          this.$menu
            .addClass('pull-left')
            .css('margin-right',this.options.menuMargin)
            .insertBefore(this.$element)
            .show()
          break
      }
      
      this.shown = true
      var plugin
      // fix for some known plugin
      plugin = this.$element.data('typeahead')
      if (plugin)
        setTimeout($.proxy(function(){if (this.shown) this.show()},plugin),200)

      plugin = this.$element.data('datepicker')
      if (plugin)
        setTimeout($.proxy(function(){if (this.picker.is(':visible')) this.place()},plugin),200)
        
      return this
    }
    
  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function () {
      if (!this.values.length && !this.$element.val()) {
        return this.shown ? this.hide() : this
      }
      return this.render().show()
    }

  , pushBtn: function() {
    if (this.options.pushBtn == undefined)
      return '<b class="label label-info">&crarr;</b>'
    return this.options.pushBtn
  }

  , popBtn: function() {
    if (this.options.popBtn == undefined) {
      var sign = this.seperator.trim()

      if (sign in this.sepSigns) sign = this.sepSigns[sign]
      return '<b class="label">'+sign+'</b>'
    }
    return this.options.pushBtn
  }

  , removeBtn: function() {
    if (this.options.removeBtn == undefined)
      return  '<b class="muted">&times;</b> '
    return this.options.removeBtn
  }
  
  , renderItem: function(cls,data,html) {
      var i     = $(this.options.item)
                    .addClass('multivalue-'+cls)
                    .attr('data-value',data)
        , $cell = i.find('.multivalue-cell')
        
      if (!$cell.length) $cell = i.find('a:first')
      
      $cell.html(html)
      //if (cls=='pop') $cell.attr('tabindex','-1')
      return i[0]
  }

  , render: function () {
  
      var that    = this
        , items   = this.values
        , $store  = this.$menu.find('.multivalue-store')

      if (!$store.length) $store = this.$menu.find('ul:first')
        
      if ($store.length) {

        items = $(items).map(function (i, item) {
          return that.renderItem('item',item,that.removeBtn()+item)
        })
        
        $store.html(items)
        
        var btn
        if (this.values.length!=0 && (btn = this.popBtn())) {
            $store.append(this.renderItem('pop','',btn))
          }

        if (this.$element.val() && (btn = this.pushBtn())
        && (!this.options.items || this.options.items > this.values.length)) {
            var fn= (~['right'].indexOf(this.options.menuAlign))
                  ? 'prepend' : 'append'
            $store[fn](this.renderItem('push','',btn))
          }
      }
      return this
    }

  , listen: function () {
  
      this.$element
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))
        .on('change',   $.proxy(this.change, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
      
      if (this.options.autoRestore) {
        var restore = {selector: 'form', event: 'submit', callback: function(){this.restore().lookup()}}
          , arest   = this.options.autoRestore
          
        switch (typeof arest) {
          case 'string':
              restore.selector = arest
              break
          case 'object' :
              $.extend(restore,arest)
              break
        }

        var $form = this.$element.parents(restore.selector)
        if ($form)
          $form.on(restore.event, $.proxy(restore.callback,this))
      }
    }

  , eventSupported: function(eventName) {
  
      var isSupported = eventName in this.$element
      
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      
      return isSupported
    }

  , move: function (e) {
  
      //if (!this.shown) return
      switch(e.keyCode) {

        case 8: // backspace
          if (!this.$element.val() && this.values) {
            this.values.pop()
            this.lookup()
          }
          break
         
        case 13: // enter
          e.preventDefault()
          break
      }

      //e.stopPropagation()
    }
    
  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,8,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return

      this.move(e)
    }
    
  , change: function (e) {
      this.lookup()
    }
    
  , keyup: function (e) {
      switch(e.keyCode) {
        case 13: // enter
          this.store()
          break
          
        default :
          var val = this.splitter(this.$element.val())
          
          if (val.length>1 && val.pop()=='') {
            this.store()
          }

          break
      }
      
      this.lookup()
    }

  , click: function (e) {
      var that = this
        , $target = $(e.target).parents('li,.multivalue-item,.multivalue-push,.multivalue-pop')
        
      if ($target.length) {
        e.stopPropagation()
        e.preventDefault()
        
        if ($target.is('.multivalue-push')){
          this.store()
        } 
        else {
          if ($target.is('.multivalue-pop')){
            this.restore()
          }
          else {
            $target.remove()
            this.values = []
            $('.multivalue-item',this.$menu).each(
                function(){ 
                    that.values.push($(this).attr('data-value')) 
                })
            this.render()
          }
        }
        
        
        setTimeout(function(){that.lookup().$element.focus()},150)
      }
    }

  }


  /* Multivalue PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.multivalue

  $.fn.multivalue = function (option) {
  
    return this.each(function () {
    
      var $this = $(this)
        , data = $this.data('multivalue')
        , options = typeof option == 'object' && option
        
      if (!data) $this.data('multivalue', (data = new Multivalue(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.multivalue.defaults = {
    menu:       '<div><div class="pagination" style="margin:0 0 0 0;"><ul></ul></div></div>'
  , menuAlign:  'left'
  , menuMargin: '10px'
  , item:       '<li><a href="#"></a></li>'
  , autoRestore:  true

  }

  $.fn.multivalue.Constructor = Multivalue


 /* Multivalue NO CONFLICT
  * =================== */

  $.fn.multivalue.noConflict = function () {
    $.fn.multivalue = old
    return this
  }


 /* Multivalue DATA-API
  * ================== */

  $(document).on('focus.multivalue.data-api', '[data-provide="multivalue"]', function (e) {
    var $this = $(this)
    
    if ($this.data('multivalue')) return
    
    e.preventDefault()
    $this.multivalue($this.data())
  })

}(window.jQuery);
