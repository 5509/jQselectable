# jQselectable
make selectbox so useful

How about select element do you think?  
That's worse UI for the Web I think.  
Using this jQuery plugin, select element will be nicer UI.

Thanks for your using and feedback.

## usage

### simple

To insert below code to jQuery ready func, jQselectable is to be executed.

	$(selector).jQselectable();

### with options

execution with options.

	$(selector).jQselectable({
	  style: 'selectable', // or simple
	  showDuration: 200, // int
	  hudeDuration: 200, // int
	  show: 'fadeIn', // or slideDown, show
	  hide: 'fadeOut', // or slideUp, hide
	  height: 'auto', // int or auto
	  top: 0, // int
	  left: 0, // int
	  opacity: .9 // 0.1~1
	});

### with APIs

jQselectable has some APIs listed below.

* enable - make target jQselectable object enable
* disable - make target jQselectable object disable
* destroy - destroy target jQselectable object
* refresh - rebuild options and refresh target jQselectable object

with

	var $jqs = $(selector).jQselectable();
	$jqs.jQselectable('disable'); // disabled

	// some code

	$jqs.jQselectable('enable'); // enabled
