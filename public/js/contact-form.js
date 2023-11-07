import joi from 'https://cdn.jsdelivr.net/npm/joi@17.11.0/+esm'

const name = document.getElementById('name')
const email = document.getElementById('email')
const message = document.getElementById('message')

let notification = document.getElementById('notification')
let notificationEmblem = document.getElementById('notification-emblem')
let notificationMessage = document.getElementById('notification-message')
let notificationTitle = document.getElementById('notification-title')

const form = document.getElementById('contact-form')
const submit = document.getElementById('submit-button')

const schema = joi.object({
	name: joi.string().required().messages({
		'string.base': `There was an error with your name`,
		'string.empty': `Your name is required`,
		'string.required': `Your name is required`
	}),
	email: joi
		.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			'string.base': `There was an error with your email address`,
			'string.email': `Enter a valid email address`,
			'string.required': `Your email address is required`,
			'string.empty': `Your email address is required`
		}),
	message: joi.string().min(3).max(5000).required().messages({
		'string.base': `There was an error with your message`,
		'string.min': `Your message must be at least 3 characters long`,
		'string.max': `Your message must be less than 5000 characters long`,
		'string.required': `Your message is required`,
		'string.empty': `Your message is required`
	})
})

function onSubmit() {
	onChange()

	const result = schema.validate({
		name: name.value || '',
		email: email.value || '',
		message: message.value || ''
	})

	if (result.error) {
		return
	}

	setButtonState('Sending...', null, 'sending')
	//send()
	console.log('sending')
}

function send() {
	// service_rm0lk0p template_umowtzz dev
	// service_lb1roui template_7mjogek prod
	emailjs.sendForm('service_lb1roui', 'template_7mjogek', form).then(
		function (response) {
			console.log('Successfully submitted form: ', response)
			showSuccessState()
		},

		function (error) {
			console.log('Failed to submit form: ', error)
			showErrorState()
		}
	)
}

function onChange() {
	const nameResult = schema.validate({
		name: name.value || '',
		email: 'a@a.a',
		message: 'aaaa'
	})
	const emailResult = schema.validate({
		email: email.value || '',
		name: 'aaaa',
		message: 'aaaa'
	})
	const messageResult = schema.validate({
		message: message.value || '',
		name: 'aaaa',
		email: 'aaa@aaa.aaa'
	})
	setFieldError('name', nameResult.error)
	setFieldError('email', emailResult.error)
	setFieldError('message', messageResult.error)
}

function setFieldError(id, error) {
	const field = document.getElementById(id)

	if (!error) {
		field.classList.remove('error')
		field.setAttribute('aria-invalid', 'false')
		field.parentElement.lastElementChild.innerHTML = ''
		return
	}

	const prettyError = error.toString().replace('ValidationError:', '')

	field.classList.add('error')
	field.setAttribute('aria-invalid', 'true')
	field.parentElement.lastElementChild.innerHTML = prettyError
}

function showNotification(error, title, message) {
	notification.classList.remove('error')
	notificationEmblem.classList.remove('error')
	notification.style.display = 'grid'

	if (error) {
		notification.classList.add('error')
		notificationEmblem.classList.add('error')
	}

	notificationTitle.innerText = title
	notificationMessage.innerText = message
}

function hideNotification() {
	notification.style.display = 'none'
}

function showErrorState() {
	setButtonState('Send message', null, '')
	showNotification(
		true,
		'Internal error',
		'Please check your connection and try again. If this persists: chrisdenais@gmail.com'
	)
}

function showSuccessState() {
	setButtonState('Message sent', 'sending', 'sent')
	setFieldError('name', null)
	setFieldError('email', null)
	setFieldError('message', null)
	showNotification(
		false,
		'Message sent',
		'Your message has been sent. We’ll get back to you shortly.'
	)
}

function setButtonState(text, remove, style) {
	submit.innerText = text

	if (!!remove) {
		submit.classList.remove(remove)
	}
	submit.classList.add(style)
}

name.addEventListener('input', onChange)
email.addEventListener('input', onChange)
message.addEventListener('input', onChange)
submit.addEventListener('click', onSubmit)
