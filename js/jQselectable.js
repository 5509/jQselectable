/*
	title: jQuery.jQselectable.js (ex jQuery.selectable.js)
	required: jQuery(tested on 1.3.2)
	encoding: UTF-8
	copy: Copyright 2008-2009 nori (norimania@gmail.com)
	license: MIT
	author: 5509 - http://moto-mono.net
	archive: http://moto-mono.net/2008/09/14/jqueryselectable.html
	rebuild: 2009-09-16 22:48
	update: 2009-09-23 03:12
	date: 2008-09-14 02:34
 */
 
(function($j){
	
	// jQuery.jQselectable
	// Make selectbox so usuful and accesible
	// @ 2009-09-16 (2.0.0)
	var jQselectable = function(select,options){
		this.conf = {
			style: 'selectable', // or 'simpleBox'
			set: 'show', // 'show', 'slideDown' or 'fadeIn'
			out: 'hide', // 'hide', 'slideUp' or 'fadeOut'
			inDuration: 'normal', // 'slow', 'normal', 'fast' or 0~1
			outDuration: 'normal',
			opacity: 1, // pulldown mat
			top: 0,
			left: 0,
			callback: null
		}
		
		$j.extend(this.conf,options || {});
		
		this.target = $j(select);
		this.attrs = {
			id: this.target.attr('id'),
			cl: this.target.attr('class')
		}
		
		// Init start
		this.init();
	}
	
	jQselectable.prototype = {
		// Init selectable
		// @ 09-09-17 22:08
		init: function(){
			// Build selectable
			this.build();
			// Event apply
			this.bind_events();
		},
		
		// Rebuild selectable
		// @ 09-09-18 17:28
		rebuild: function(){
			// unbind events from elements related selectable
			this.m_input.unbind();
			this.mat.unbind();
			$j('a',this.mat).unbind();
			$j('label[for="'+this.attrs.id+'"]').unbind();
			
			// Build selectable
			this.build();
			
			// Event apply
			this.bind_events();
		},
		
		// Building selectable from original select element
		// @ 2009-09-16 19:15
		build: function(){
			
			// Declare flag
			var has_optgroup = $j('optgroup',this.target).length>0 ? true : false;
			
			var _this = this;
			var generate_anchors = function(obj,parent){
				var _a = $j('<a/>');
				$j(parent).append(_a);
				
				_a.text(obj.text()).attr({
					href: '#'+encodeURI(obj.text()),
					name: obj.val()
				});
				
				if(obj.is(':selected')){
					_this.m_text.text(obj.text());
					_a.addClass('selected');
				}
				if(obj.hasClass('br')){
					var _br = $j('<br/>');
					_br.insertAfter(_a);
				}
			}
			
			if(!this.m_input){
				this.m_input = $j('<a/>');
				this.m_text = $j('<span/>');
				var _style = this.conf.style.match(/simpleBox/) ? 'sBox' : 'sctble';
				
				this.m_input.append(this.m_text).attr({
					id: this.attrs.id+'_dammy',
					href: '#'
				}).addClass('sctble_display').addClass(_style).addClass(this.attrs.cl).insertAfter(this.target);
				
				this.target.hide();
				
				this.mat = $j('<div/>');
				
				// Customed
				if(_style=='sBox'){

					this.mat.append('<div class="sBoxHead"></div><div class="sBoxBody"></div><div class="sBoxFoot"></div>');
				}else{
					this.mat.append('<div class="head"></div><div class="body"></div><div class="foot"></div>');
				}
				// Customed end
				
				this.mat.attr({
					id: this.attrs.id+'_mat'
				}).addClass(_style).addClass(this.attrs.cl);
			}
			
			// For rebuilding
			if(this.mat.hasClass('sBox')){
				if($('div.sBoxBody',this.mat).children().length>0){
					$('div.sBoxBody',this.mat).empty();
				}
			}else{
				if(this.mat.children().length>0){
					$('div.body',this.mat).empty();
					//this.mat.empty();
				}
			}
			
			if(has_optgroup){
				var _optgroup = $j('optgroup',this.target);
				var _option = [];
				
				for(var i=0;i<_optgroup.length;i++){
					_option[i] = $j('option',_optgroup[i]);
				}
				
				var _dl = $j('<dl/>');
				for(var i=0;i<_optgroup.length;i++){
					var _dt = $j('<dt/>');
					_dt.text($j(_optgroup[i]).attr('label'));
					var _dd = $j('<dd/>');
					for(var j=0;j<_option[i].length;j++){
						generate_anchors($j(_option[i][j]),_dd);
					}
					_dl.append(_dt).append(_dd);
				}
				$('div.body',this.mat).append(_dl).addClass('optg');
				
			}else{
				var _option = $j('option',this.target);
				
				var _p = $j('<p/>');
				for(var i=0;i<_option.length;i++){
					generate_anchors($j(_option[i]),_p);
				}
				if(this.mat.hasClass('sBox')){
					$('div.sBoxBody',this.mat).append(_p).addClass('nooptg');
				}else{
					$('div.body',this.mat).append(_p).addClass('nooptg');
				}
			}
			
			// For rebuilding
			if(!$j('#'+this.attrs.id+'_mat','body') || $j('#'+this.attrs.id+'_mat','body').length<1){
				$j('body').append(this.mat);
				this.mat.addClass('sctble_mat').css({
					position: 'absolute',
					zIndex: 1000,
					display: 'none'
				});
				$j('*:first-child',this.mat).addClass('first-child');
				$j('*:last-child',this.mat).addClass('last-child');
			}
			
			// This is for IE6 that doesn't have "max-height" properties
			if(document.all && typeof document.body.style.maxHeight == 'undefined'){
				if(this.conf.height<this.mat.height()){
					$('div.sBoxBody p',this.mat).css('height',this.conf.height);
				}
			// Other browsers
			}else{
				$('div.sBoxBody p',this.mat).css('maxHeight',this.conf.height);
			}
		},
		
		// Bind events
		// @ 09-09-17 22:59
		bind_events: function(){
			var _this = this;
			// Flag checking where the events was called
			var is_called = true;
			
			var set_pos = function(){
				var _pos = _this.m_input.offset();
				_this.mat.css({
					top: _pos.top + _this.m_input.height()*1.3 + _this.conf.top,
					left: _pos.left + _this.conf.left
				});
			}
			
			// Hide all mats are displayed
			var mat_hide = function(){
				var _mat = $j('.sctble_mat');
				switch(_this.conf.out){
					case 'slideUp':
						_mat.slideUp(_this.conf.outDuration);
						break;
					case 'fadeOut':
						_mat.fadeOut(_this.conf.outDuration);
						break;
					default:
						_mat.hide();
						break;
				}
			}
			
			// Show the mat
			var mat_show = function(){
				mat_hide();
				switch(_this.conf.set){
					case 'slideDown':
						_this.mat.slideDown(_this.conf.inDuration).css('opacity',_this.conf.opacity);
						break;
					case 'fadeIn':
						_this.mat.css({
							display: 'block',
							opacity: 0
						}).fadeTo(_this.conf.inDuration,_this.conf.opacity);
						break;
					default:
						_this.mat.show().css('opacity',_this.conf.opacity);
						break;
				}
				
				var _interval = isNaN(_this.conf.inDuration) ? null : _this.conf.inDuration+10;
				if(_interval==null){
					if(_this.conf.inDuration.match(/slow/)){
						interval = 610;
					}else if(_this.conf.inDuration.match(/normal/)){
						interval = 410;
					}else{
						interval = 210;
					}
				}
				
				var _chk = setInterval(function(){
					$j('a.selected',_this.mat).focus();
					clearInterval(_chk);
				},_interval);
			}
			
			// Call selectable
			this.m_input.click(function(event){
				set_pos();
				$j(this).addClass('sctble_focus');
				$j('a.sctble_display').not(this).removeClass('sctble_focus');
				
				mat_show();
				event.stopPropagation();
				return false;
			}).keyup(function(event){
				if(is_called){
					set_pos();
					mat_show();
					event.stopPropagation();
				}else{
					is_called = true;
				}
			});
			
			// Stop event propagation
			this.mat.click(function(event){
				event.stopPropagation();
			});
			
			// Hide the mat
			$j('body,a').not('a.sctble_display').click(function(event){
				$j('a.sctble_display').removeClass('sctble_focus');
				mat_hide();
			}).not('a').keyup(function(event){
				if(event.keyCode==27){
					$j('a.sctble_focus').removeClass('sctble_focus');
					is_called = false;
					_this.m_input.blur();
					mat_hide();
				}
			});
			
			// Click value append to both dummy and change original select value
			$j('a',this.mat).click(function(){
				var self = $j(this);
				_this.m_text.text(decodeURI(self.attr('href').split('#')[1]));
				$j('option[value="'+self.attr('name')+'"]',_this.target).attr('selected','selected');
				$j('.selected',_this.mat).removeClass('selected');
				self.addClass('selected');
				_this.m_input.removeClass('sctble_focus');
				is_called = false;
				mat_hide();
				
				if(_this.conf.callback && typeof _this.conf.callback=='function'){
					_this.conf.callback();
				}
				
				_this.m_input.focus();
				return false;
			});
			
			// Be able to click original select label
			$j('label[for="'+this.attrs.id+'"]').click(function(event){
				set_pos();
				_this.m_input.addClass('sctble_focus');
				$j('a.sctble_focus').not(_this.m_input).removeClass('sctble_focus');
				mat_show();
				event.stopPropagation();
				return false;
			});
		}
	}
	
	// Extense the namespace of jQuery as method
	// This function returns (the) instance(s)
	$j.fn.jQselectable = function(options){
		if($j(this).length>1){
			var _instances = [];
			$j(this).each(function(i){
				_instances[i] = new jQselectable(this,options);
			});
			return _instances;
		}else{
			return new jQselectable(this,options);
		}
	}
	
	// If namespace of jQuery.fn has 'selectable', this is 'jQselectable'
	// To prevent the interference of namespace
	// You can call 'selectable' method by both 'jQuery.fn.selectable' and 'jQuery.fn.jQselectable' you like
	if(!jQuery.fn.selectable){
		$j.fn.selectable = $j.fn.jQselectable;
	}
	
})(jQuery);