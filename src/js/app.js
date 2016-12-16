let debounce = function(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

let isMobile = window.innerWidth < 650;
let inputs = [].slice.call(document.querySelectorAll('#skuna-contact-form input'));
let placeholders = [{
	type : 'text',
	large : 'A name so we know who to ask for you when we contact you',
	small : 'Your name here please'
}, {
	type : 'email',
	large : 'An email address we can send Skuna details to',
	small : 'Your email here please'
}, {
	type : 'number',
	large : 'A contact number we can call you on',
	small : 'Your number here please'
}];

function replacePlaceholders(mobile) {
	inputs.forEach(input => {
		let text = placeholders.filter(ph => input.type === ph.type)[0][mobile ? 'small' : 'large'];
		input.placeholder = text;
	});
}

window.addEventListener('resize', debounce(() => {
	if(window.innerWidth < 650) {
		if(!isMobile) {
			isMobile = true;
			replacePlaceholders(isMobile);
		}
	}
	else {
		if(isMobile) {
			isMobile = false;
			replacePlaceholders(isMobile);
		}
	}
}, 100));

document.addEventListener('DOMContentLoaded', () => {
	replacePlaceholders(isMobile);
});