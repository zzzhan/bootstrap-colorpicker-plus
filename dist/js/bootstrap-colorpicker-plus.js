/*!
 * Bootstrap Colorpicker Plus
 * https://github.com/zzzhan/bootstrap-colorpicker-plus
 *
 * Licensed under the Apache License v2.0
 * http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 */
(function(factory){
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery','bootstrap-colorpicker'], factory);
    } else if (window.jQuery && !window.jQuery.fn.colorpickerplus) {
        factory(window.jQuery);
    }	
}(function($){
	var panelColors = ["#5B0F00","#660000","#783F04","#7F6000","#274E13","#0C343D","#1C4587","#073763","#20124D","#4C1130",
					   "#5B0F00","#660000","#783F04","#7F6000","#274E13","#0C343D","#1C4587","#073763","#20124D","#4C1130",
					   "#85200C","#990000","#B45F06","#BF9000","#38761D","#134F5C","#1155CC","#0B5394","#351C75","#741B47",
					   "#A61C00","#CC0000","#E69138","#F1C232","#6AA84F","#45818E","#3C78D8","#3D85C6","#674EA7","#A64D79",
					   "#CC4125","#E06666","#F6B26B","#FFD966","#93C47D","#76A5AF","#6D9EEB","#6FA8DC","#8E7CC3","#C27BA0",
					   "#DD7E6B","#EA9999","#F9CB9C","#FFE599","#B6D7A8","#A2C4C9","#A4C2F4","#9FC5E8","#B4A7D6","#D5A6BD",
					   "#E6B8AF","#F4CCCC","#FCE5CD","#FFF2CC","#D9EAD3","#D0E0E3","#C9DAF8","#CFE2F3","#D9D2E9","#EAD1DC",
					   "#980000","#FF0000","#FF9900","#FFFF00","#00FF00","#00FFFF","#4A86E8","#0000FF","#9900FF","#FF00FF"];
    var storage = window.localStorage;
    var customColors = [];
    if(!!storage) {
        if(!storage.getItem("colorpickerplus_custom_colors")) {
            storage.setItem("colorpickerplus_custom_colors",customColors.join());
        }
        customColors = storage.getItem("colorpickerplus_custom_colors").split(',');
    }
	var ROWS = 8;
	var CELLS = 10;
    var createColorCell = function(color, cell) {
        if(!cell) {
          cell = $('<div class="colorcell"></div>');
		}
        if(!!color) {
          cell.attr('data-color', color);
          cell.css('background-color', color);
        } else {
          cell.addClass('colorpicker-color');//alpha
        }
        return cell;        
    };
    var ColorpickerEmbed = function(element) {
        var container = $(element);
        var customRows = Math.max(Math.ceil(customColors.length/CELLS), 1);
        var row = null;
        for(var i=0;i<customRows;i++) {
            if(i===customRows-1) {
                row = $('<div class="colorpickerplus-custom-colors"></div>');
            } else {
                row = $('<div class="colorpickerplus-colors-row"></div>');
			}
            for(var j=0;j<CELLS;j++) {
                var cInd = i*CELLS+j;
                var cell = null;
                if(cInd<customColors.length) {
                    var c = customColors[cInd];
                    cell = createColorCell(c);
                } else {
                    cell = $('<div class="colorcell nohover"></div>');
                }
                cell.appendTo(row);
            }
            row.appendTo(container);
        }
        for(i=0;i<ROWS;i++) {
            row = null;
            if(i<ROWS-1) {
                row = $('<div class="colorpickerplus-colors-row"></div>');
            } else {
                row = $('<div class="colorpickerplus-primary-colors"></div>');
			}
            for(var jj=0;jj<CELLS;jj++) {
                var cc = panelColors[i*CELLS+jj];
                createColorCell(cc).appendTo(row);
            }
            row.appendTo(container);
        }
        var inputGrp = $('<div class="input-group input-group-sm"><input type="text" class="form-control" size="6"/><span class="input-group-btn"><button class="btn btn-default" type="button" title="Custom Color">C</button></span></div>');
        var colorInput = $('input', inputGrp);
        inputGrp.appendTo(container);
        container.on('click.colorpickerplus-container', '.colorcell', $.proxy(this.select, this));
        inputGrp.on('click.colorpickerplus-container', 'button', $.proxy(this.custom, this));
        colorInput.on('changeColor.colorpickerplus-container', $.proxy(this.change, this));
        container.on('mousedown mouseup click touchstart', $.proxy(this.stopPropagation, this));
        this.element = container;
        colorInput.colorpicker();
        this.colorInput = colorInput;
        colorInput.data('colorpicker').picker.on('click touchstart', $.proxy(this.stopPropagation, this));
    };
    ColorpickerEmbed.prototype = {
        constructor: ColorpickerEmbed,
        custom: function() {
            var color = this.colorInput.val();
            customColors[customColors.length] = color;
            var cells = $('.colorcell.nohover', this.element);
            var cell = createColorCell(color, cells.first());
            cell.removeClass('nohover');
            storage.setItem("colorpickerplus_custom_colors",customColors.join());
        },
        select: function(e) {
            var c = $(e.target).data('color');
            if(c==null) {
              this.element.trigger({type:'changeColor',
                color:c});
            } else {
              this.update(c);
            }
            this.element.trigger({
                type: 'select',
                color: c
            });
            this.colorInput.colorpicker('hide');
        },
        change: function(e) {
            e.stopPropagation();
            this.element.trigger({type:'changeColor',
                color:e.color.toHex()});
        },
        update: function(color) {
            var cells = $('.colorcell', this.element);
            cells.removeClass('selected');
            if(color!=null) {
              this.colorInput.val(color);
              this.colorInput.colorpicker('setValue', color);
            }
            cells.each(function(){
                var c = $(this).data('color');
                if(color!=null&&c===color.toUpperCase()) {
                    $(this).addClass('selected');
                    return false;
                }
            });
        },
        stopPropagation:function(e) {
            // if (!e.pageX && !e.pageY && e.originalEvent) {
            //     e.pageX = e.originalEvent.touches[0].pageX;
            //     e.pageY = e.originalEvent.touches[0].pageY;
            // }
            if(!$(e.target).is('.colorcell')) {
              e.stopPropagation();
			}
            //e.preventDefault();
        }
    };
    $.colorpickerembed = ColorpickerEmbed;

    $.fn.colorpickerembed = function(option) {
        var pickerArgs = arguments;

        return this.each(function() {
            var $this = $(this),
            inst = $this.data('colorpickerembed'),
            options = ((typeof option === 'object') ? option : {});
            if ((!inst) && (typeof option !== 'string')) {
                $this.data('colorpickerembed', new ColorpickerEmbed(this, options));
            } else {
                if (typeof option === 'string') {
                    inst[option].apply(inst, Array.prototype.slice.call(pickerArgs, 1));
                }
            }
        });
    };
    $.fn.colorpickerembed.constructor = ColorpickerEmbed;
    //singleton
	var colorpickerplus = $('.colorpickerplus');
	if(colorpickerplus.length<=0) {
      colorpickerplus = $('<div class="colorpickerplus"></div>');
	  colorpickerplus.appendTo($('body'));
	  //console.log('append singleton to body');
	}
    var _container = $('<div class="colorpickerplus-container"></div>').appendTo(colorpickerplus);
    _container.colorpickerembed();
    var currPicker = null;
    _container.on('select', function(){
        if(!!currPicker) {
            // currPicker.setValue(c);
            hide();
        }
    });
    _container.on('changeColor', function(e){
        if(!!currPicker) {
            currPicker.setValue(e.color);
        }
    });
    //var embed = _container.data('colorpickerembed');
    colorpickerplus.on('mousedown mouseup click touchstart', function(e) {
        e.stopPropagation();
    });
    var show = function(picker) {
        _container.data('colorpickerembed').update(picker.getValue());
        currPicker = picker;
        colorpickerplus.show();
        //console.log('show');
    };
    var hide = function() {
        //colorpickerplus.offset({top:0, left:0});
        colorpickerplus.hide();
        currPicker = null;
    };
    var reposition = function(picker) {
        var offset = picker.element.offset();
        //var mx = offset.left+picker.element.outerHeight();
        //var my = offset.top;
        //console.log(picker.element.outerHeight());
        offset.top +=picker.element.outerHeight();
        colorpickerplus.css(offset);
    };
    var defaults = {};
    var ColorpickerPlus = function(element, options) {
        this.element = $(element);
        this.options = $.extend({}, defaults, this.element.data(), options);        
        this.input = this.element.is('input') ? this.element : (this.options.input ?
            this.element.find(this.options.input) : false);
        if (this.input && (this.input.length === 0)) {
            this.input = false;
        }
        if (this.input !== false) {
            this.element.on({
                'focus.colorpickerplus': $.proxy(this.show, this)
            });
            // this.element.on({
            //     'focusout.colorpickerplus': $.proxy(this.hide, this)
            // });
        }

        if ((this.input === false)) {
            this.element.on({
                'click.colorpickerplus': $.proxy(this.show, this)
            });
        }
        // $($.proxy(function() {
        //     this.element.trigger('create');
        // }, this));
    };
    ColorpickerPlus.version = '0.1.0';
    ColorpickerPlus.prototype = {
        constructor: ColorpickerPlus,
        destroy: function() {
            this.element.removeData('colorpickerplus').off('.colorpickerplus');
            if (this.input !== false) {
                this.input.off('.colorpickerplus');
            }
            this.element.trigger({
                type: 'destroy'
            });
        },
        reposition: function() {
        	reposition(this);
        },
        show: function() {
            this.reposition();
            $(window).on('resize.colorpickerplus', $.proxy(this.reposition, this));
            $(window.document).on({
                'mousedown.colorpickerplus': $.proxy(this.hide, this)
            });
            show(this);
            this.element.trigger({
                type: 'showPicker',
                color: this.getValue()
            });
        },
        hide: function(e) {
            var p = $(e.target).closest('.colorpicker');
            if(p.length>0) {return;}
            hide();
            $(window).off('resize.colorpickerplus', $.proxy(this.reposition, this));
            $(document).off({
                'mousedown.colorpickerplus': $.proxy(this.hide, this)
            });
            this.element.trigger({
                type: 'hidePicker',
                color: this.getValue()
            });
        },
        setValue: function(val) {
            this.element.data('cpp-color', val);
            this.element.trigger({
                type: 'changeColor',
                color: val
            });
        },
        getValue: function(defaultValue) {
            defaultValue = (defaultValue === undefined) ? '#000000' : defaultValue;
            var val;
            if (this.hasInput()) {
                val = this.input.val();
            } else {
                val = this.element.data('cpp-color');
            }
            if ((val === undefined) || (val === '') || (val === null)) {
                // if not defined or empty, return default
                val = defaultValue;
            }
            return (typeof val==='string')?val.toUpperCase():val;
        },
        hasInput: function() {
            return (this.input !== false);
        }
    };

    $.colorpickerplus = ColorpickerPlus;

    $.fn.colorpickerplus = function(option) {
        var pickerArgs = arguments;

        return this.each(function() {
            var $this = $(this),
            inst = $this.data('colorpickerplus'),
            options = ((typeof option === 'object') ? option : {});
            if ((!inst) && (typeof option !== 'string')) {
                $this.data('colorpickerplus', new ColorpickerPlus(this, options));
            } else {
                if (typeof option === 'string') {
                    inst[option].apply(inst, Array.prototype.slice.call(pickerArgs, 1));
                }
            }
        });
    };

    $.fn.colorpickerplus.constructor = ColorpickerPlus;
}));