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

let formHolder = document.querySelector('.form');
let form = formHolder.querySelector('#skuna-contact-form');
let inputs = [].slice.call(form.querySelectorAll('input'));
let errors = [].slice.call(form.querySelectorAll('small'));

let placeholders = [{
	type : 'name',
	large : 'A name so we know who to ask for when we contact you',
	small : 'Your name here please',
	check : /^[a-zA-Z\s?]{2,30}$/
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
		let text = placeholders.filter(ph => input.getAttribute('data-desc') === ph.type)[0][mobile ? 'small' : 'large'];
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

function submitForm(inputs) {
	
	let data = JSON.stringify(inputs);
    let xhr = new XMLHttpRequest();
    let formError = form.querySelector('.form-error');

    xhr.open('POST', 'contact.php');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(data);
    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            formHolder.innerHTML = '';
            let thankYou = document.createElement('h2');
            thankYou.textContent = 'Thanks for enquiring about Skuna! We\'ll be back in touch within 24-48 hours!';
            formHolder.appendChild(thankYou);
            formError.className += ' hide';
        }
        else if(xhr.status !== 200 && xhr.readyState === 4) {
        	formError.style.display = 'block';
        	formError.className = formError.className.replace(/\s?hide/g, '');
        }
    };

}

form.addEventListener('submit', function(e) {

	e.preventDefault();
	let isValid = true;
	let inValid = [];

	inputs.forEach((input, index) => {
		let { value } = input;
		let type = input.getAttribute('data-desc');
		let check = placeholders.filter(ph => type === ph.type)[0]['check'];
		let error = getError(type);
		if(!check.test(value)) {
			isValid = false;
			error.className = error.className += ' show';
			inValid.push(type);
		}
		else {
			error.className = error.className.replace(/\s?show/g, '');	
			inValid.splice(inValid.indexOf(type), 1);	
		}
	});

	if(isValid) {
		let formData = inputs.reduce((data, input) => {
			let { value } = input;
			let type = input.getAttribute('data-desc');
			data[type] = value;  
			return data;
		}, {});
		submitForm(formData);
	}

});