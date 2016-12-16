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

let form = document.querySelector('#skuna-contact-form');
let inputs = [].slice.call(form.querySelectorAll('input'));
let errors = [].slice.call(form.querySelectorAll('small'));

let placeholders = [{
	type : 'text',
	large : 'A name so we know who to ask for you when we contact you',
	small : 'Your name here please',
	check : /^[a-zA-Z]{2,30}$/
}, {
	type : 'email',
	large : 'An email address we can send Skuna details to',
	small : 'Your email here please',
	check : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
}, {
	type : 'number',
	large : 'A contact number we can call you on',
	small : 'Your number here please',
	check : /^[\d\s]{10,12}$/
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

function getError(type) {
	return errors.filter(error => error.getAttribute('data-type') === type)[0];
}

form.addEventListener('submit', function(e) {
	e.preventDefault();
	let isInvalid = true;
	inputs.forEach((input, index) => {
		let check = placeholders.filter(ph => input.type === ph.type)[0]['check'];
		let error = getError(input.type);
		if(!check.test(input.value)) {
			isInvalid = false;
			error.className = error.className += ' show';
		}
		else {
			error.className = error.className.replace(/\s?show/g, '');		
		}
	});
	if(isInvalid) {
		alert('sorry invalid');
	}
	else {
		alert('form is valid!');
	}
});