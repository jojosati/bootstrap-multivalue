# [Bootstrap Multivalue](http://jojosati.github.com/bootstrap-multivalue)

Multivalue wraps a native input or any javascript input widget to accept multiple values.

See [demo](http://jojosati.github.com/bootstrap-multivalue/demo).

# Using multivalue

#### Use with native input

    <input type="text" id="tags">
######
    $('#tags').multivalue();

or simply declare data-coprovide with no more script.

    <input type="text" data-coprovide="multivalue">
    
#### Use with [typeahead](http://twitter.github.com/bootstrap/javascript.html#typeahead) 

to simulate [tags manager](http://welldonethings.com/tags/manager)

    <input type="text" id="tags">
######
    $('#tags')
      .typeahead({source:['Java','Php','Python','Ruby']})
      .multivalue();
    
or simply declare data-coprovide with no more script.

    <input type="text" 
      data-provide="typeahead" data-source='["Java","Php","Python","Ruby"]'
      data-coprovide="multivalue">

#### Use with [datepicker](http://www.eyecon.ro/bootstrap-datepicker/)

Recommend using [eternicode's repo](https://github.com/eternicode/bootstrap-datepicker) or [thai extension](https://github.com/jojosati/bootstrap-datepicker-thai)
to simulate [daterangepicker](http://www.dangrossman.info/2012/08/20/a-date-range-picker-for-twitter-bootstrap/).

    <input type="text" id="period">
######
    $('#period')
      .datepicker({todaytHighlight:true, forceParse:false})
      .multivalue({items:1, seperator:' - '});
  
or simply declare data-coprovide with no more script.
note - only thai extension that support data-provide declaration.

    <input type="text" 
      data-provide="datepicker" 
      data-coprovide="multivalue">

## Options

### values

Array.  Default: undefined

Predefined stored values.

### seperator

String.  Default: ','

### items

Integer.  Default: 0

Number of maximum stored values, 0 means unlimit.

### menu

String.  Default: `'<div class="multivalue-store"></div>'`

### menuAlign

String.  Default: 'left'

### menuMargin

String.  Default: '10px'

### item

String.  Default: `'<span class="btn btn-small"></span>'`

### pushBtn

String.  Default: undefined

If undefined, use default `'<b class="label label-info">&crarr;</b>'`

### popBtn

String.  Default: undefined

If undefined, use default `'<b class="label label-info">'+sign+''</b>'`

sign should be seperator, except could looked up from 

    sepSigns: {
        ',' : '&sbquo;'
      , '-' : '&minus;'
      , '~' : '&sim;'
      , '*' : '&loast;'
    }  

### removeBtn

String.  Default: undefined

If undefined, use default `'<b class="muted">&times;</b> '`

### autoRestore

Boolean, Object, String.  Default: true  

Try to bind 'event' to parent 'selector', to trigger auto-restore.
if false, disable auto-restore
if true, using default 

    {selector: 'form', event: 'submit', callback: function(){this.restore().lookup()}}.

if String, means override the default selector.
if Object, could override some or all properties of default.

## Methods

### .multivalue(options)

Initializes a multivalue.

### show

Arguments: None

Show the stored values menu.

    $('#input').multivalue('show');

### hide

Arguments: None

Hide the stored values menu.

    $('#input').multivalue('hide');

### lookup

Arguments: None

Hide the menu if stored values is empty, otherwise show.

    $('#input').multivalue('lookup');

### store

Arguments: None

Push the input value to stored value.

    $('#input').multivalue('store');

### restore

Arguments: None

Revert the stored value back to input's value (with seperator).

    $('#input').multivalue('restore');


## Keyboard support

The multivalue includes some keyboard navigation:

### enter, seperator (a comma or whatever defined in options)

Push value from input to store.

### backspace

Delete the lastest stored value item.

