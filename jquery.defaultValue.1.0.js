/*
 * jQuery default Value plug-in 1.0
 *
 * Copyright (c) 2011 Nitzan Miron
 *
 */

(function($) {

if (typeof($.validator) != 'undefined')
{
	$.validator.addMethod('notplaceholder', function(value, element) {
		return value != $(element)[0].__defaultValue;
	}, $.validator.messages.required);
	$.validator.addClassRules({notplaceholder: {notplaceholder: true}});
}

$.extend($.fn, {
	defaultValue: function(options) {
		var defaultOptions = {
			// Attribute that signifies the default value of an input box
			defaultValueAttribute: "default_value",
			// Class which should be applied while the input box has the default value in it
			defaultClass: "default_value_present"
		};
		var settings = $.extend({}, defaultOptions, options);

		function applyDefaultValueText(element)
		{
			var default_value = $(element).attr(settings.defaultValueAttribute);
			element.__defaultValue = default_value;

			$(element).toggleClass(settings.defaultClass, (element.value == default_value) || (element.value == ''));

			$(element).focus(function() {
				$(element).removeClass(settings.defaultClass);
				if (element.value == default_value)
					element.value = '';
			});
			
			$(element).blur(function() 
			{
				if (element.value == '') 
				{
					$(element).addClass(settings.defaultClass);
					element.value = default_value;
				}
			}).blur();
		}

		function applyDefaultValuePassword(element)
		{
			var default_value = $(element).attr(settings.defaultValueAttribute);

			if ($.browser.msie)
			{
				// In IE, you can't change the type attribute after cloning, so try to
				// reconstruct the object manually.
				var placeholder = $('<input type="text"/>').attr('class', $(element).attr('class') || "")
					.attr('style', $(element).attr('style') || "");
			}
			else
			{
				var placeholder = $(element).clone()
					.attr('type', 'text').attr('name', '')
					.attr('id', $(element).attr('id') ? $(element).attr('id') + '_placeholder' : '');
			}
			placeholder.addClass(settings.defaultClass).val(default_value)
					.insertAfter(element);

			placeholder.focus(function() {
				placeholder.hide();
				$(element).show().focus();
			});
			
			$(element).blur(function() 
			{
				if (element.value == '') 
				{
					$(element).hide();
					$(placeholder).show();
				}
			}).blur();
		}

		return this.each(function() {
			if ((this.tagName.toLowerCase() == 'input') && (this.type == 'password'))
				applyDefaultValuePassword(this);
			else
				applyDefaultValueText(this);
		});
	}
});

})(jQuery);

