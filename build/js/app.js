/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var debounce = function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this,
			    args = arguments;
			var later = function later() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	var isMobile = window.innerWidth < 650;

	var form = document.querySelector('#skuna-contact-form');
	var inputs = [].slice.call(form.querySelectorAll('input'));
	var errors = [].slice.call(form.querySelectorAll('small'));

	var placeholders = [{
		type: 'text',
		large: 'A name so we know who to ask for you when we contact you',
		small: 'Your name here please',
		check: /^[a-zA-Z]{2,30}$/
	}, {
		type: 'email',
		large: 'An email address we can send Skuna details to',
		small: 'Your email here please',
		check: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	}, {
		type: 'number',
		large: 'A contact number we can call you on',
		small: 'Your number here please',
		check: /^[\d\s]{10,12}$/
	}];

	function replacePlaceholders(mobile) {
		inputs.forEach(function (input) {
			var text = placeholders.filter(function (ph) {
				return input.type === ph.type;
			})[0][mobile ? 'small' : 'large'];
			input.placeholder = text;
		});
	}

	window.addEventListener('resize', debounce(function () {
		if (window.innerWidth < 650) {
			if (!isMobile) {
				isMobile = true;
				replacePlaceholders(isMobile);
			}
		} else {
			if (isMobile) {
				isMobile = false;
				replacePlaceholders(isMobile);
			}
		}
	}, 100));

	document.addEventListener('DOMContentLoaded', function () {
		replacePlaceholders(isMobile);
	});

	function getError(type) {
		return errors.filter(function (error) {
			return error.getAttribute('data-type') === type;
		})[0];
	}

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		var isInvalid = true;
		inputs.forEach(function (input, index) {
			var check = placeholders.filter(function (ph) {
				return input.type === ph.type;
			})[0]['check'];
			var error = getError(input.type);
			if (!check.test(input.value)) {
				isInvalid = false;
				error.className = error.className += ' show';
			} else {
				error.className = error.className.replace(/\s?show/g, '');
			}
		});
		if (isInvalid) {
			alert('sorry invalid');
		} else {
			alert('form is valid!');
		}
	});

/***/ }
/******/ ]);