import joi from 'https://cdn.jsdelivr.net/npm/joi@17.11.0/+esm'

const name = document.getElementById('name')
const email = document.getElementById('email')
const message = document.getElementById('message')

let notification = document.getElementById('notification')
let notificationEmblem = document.getElementById('notification-emblem')
let notificationMessage = document.getElementById('notification-message')

const form = document.getElementById('contact-form')
const submit = document.getElementById('submit-button')

const passing = {
	name: 'aaa',
	email: 'a@a.a',
	message: 'aaa'
}

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

	setButtonState('Sending...', true, true)
	send()
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

function onChange(event) {
	const hasTarget = !!event
	switch (hasTarget ? event.target.name : 'all') {
		case 'name':
			validateName()
			break
		case 'email':
			validateEmail()
			break
		case 'message':
			validateMessage()
			break
		default:
			validateAll()
	}
}

function validateName() {
	const nameResult = schema.validate({
		...passing,
		name: name.value || ''
	})
	setFieldError('name', nameResult.error)
}

function validateEmail() {
	const emailResult = schema.validate({
		...passing,
		email: email.value || ''
	})
	setFieldError('email', emailResult.error)
}

function validateMessage() {
	const messageResult = schema.validate({
		...passing,
		message: message.value || ''
	})
	setFieldError('message', messageResult.error)
}

function validateAll() {
	const result = schema.validate(
		{
			name: name.value || '',
			email: email.value || '',
			message: message.value || ''
		},
		{ abortEarly: false }
	)
	for (const field of ['name', 'email', 'message']) {
		const error = result.error?.details.find(d => d.path[0] === field)
		if (!error) continue
		setFieldError(field, error.message)
	}
}

function setFieldError(id, error) {
	const field = document.getElementById(id)

	if (!error) {
		field.classList.remove('error')
		field.setAttribute('aria-invalid', 'false')
		field.parentElement.lastElementChild.style.display = 'none'
		field.parentElement.lastElementChild.style.transform =
			'translate(0, -2rem)'
		field.parentElement.lastElementChild.innerHTML = ''
		return
	}

	const prettyError = error.toString().replace('ValidationError:', '')

	field.classList.add('error')
	field.setAttribute('aria-invalid', 'true')
	field.parentElement.lastElementChild.style.display = 'block'
	field.parentElement.lastElementChild.style.transform = 'translate(0, 0rem)'
	field.parentElement.lastElementChild.innerHTML = prettyError
}

function showNotification(error, message) {
	notification.classList.remove('error')
	notificationEmblem.classList.remove('error')
	notification.style.display = 'grid'

	if (error) {
		notification.classList.add('error')
		notificationEmblem.classList.add('error')
	}

	notificationMessage.innerText = message
}

function hideNotification() {
	notification.style.display = 'none'
}

function showErrorState() {
	setButtonState('Send message', false, false)
	showNotification(
		true,
		'Please check your connection and try again. If this persists: chrisdenais@gmail.com'
	)
}

function showSuccessState() {
	setButtonState('Message sent', false, true)
	setFieldError('name', null)
	setFieldError('email', null)
	setFieldError('message', null)
	showNotification(
		false,
		'Your message has been sent. We’ll get back to you shortly.'
	)
}

function setButtonState(text, sending, shouldDisable) {
	submit.innerText = text

	submit.disabled = shouldDisable

	submit.setAttribute('aria-busy', sending)
	submit.setAttribute('aria-disabled', shouldDisable)
	submit.setAttribute('data-sending', sending)
}

name.addEventListener('change', onChange)
email.addEventListener('change', onChange)
message.addEventListener('change', onChange)
submit.addEventListener('click', onSubmit)
