const testimonials = (
	await (await fetch('/content/testimonials.json')).json()
).all

let currentSlideIndex = 0
const quote = document.getElementById('quote')
const author = document.getElementById('author')
const title = document.getElementById('title')
const headshot = document.getElementById('headshot')
const testimonialContainer = document.getElementById('testimonial-container')

const longestQuote = document.getElementById('longest-quote')
const longestAuthor = document.getElementById('longest-author')
const longestTitle = document.getElementById('longest-title')
const longestTestimonialContainer = document.getElementById(
	'longest-testimonial-container'
)

let gaussianBlur = document.getElementById('gaussianBlur')
let controlIndicatorDiv = document.getElementById('control-indicator-div')
let leftArrow = document.getElementById('controls__left')
let rightArrow = document.getElementById('controls__right')

let maxBlur = 7
let blurIndex = 1
let blurIntensity = 0
let blurDirection = 0.02
let transitionDone = false
let swappedStates = false
let blurIncreasing = true
let onMobile = false
let autoslideCooldown = 5000
let autoslideTimeoutID = 0

const longestSlide = 2

longestQuote.innerText = testimonials[longestSlide].quote
longestAuthor.innerText = testimonials[longestSlide].author
longestTitle.innerText = testimonials[longestSlide].title

leftArrow.addEventListener('click', goPrevious)
rightArrow.addEventListener('click', goNext)

currentSlideIndex = testimonials.length - 1

quote.innerText = testimonials[currentSlideIndex].quote
author.innerText = testimonials[currentSlideIndex].author
title.innerText = testimonials[currentSlideIndex].title
headshot.src = testimonials[currentSlideIndex].headshot

for (let i = 0; i < testimonials.length; i++) {
	let indicator = document.createElement('div')

	indicator.className =
		'control-indicator' +
		(i == testimonials.length - 1 ? ' last-indicator' : '')
	indicator.id = 'indicator-' + i
	controlIndicatorDiv.appendChild(indicator)
}

setActiveIndicatorColor('white')
tryAutoslide()
startAnimation()

function goNext(fromAutoslide) {
	setActiveIndicatorColor('#3A3645')

	if (currentSlideIndex >= testimonials.length - 1) currentSlideIndex = 0
	else currentSlideIndex++

	setActiveIndicatorColor('white')

	if (fromAutoslide) {
		tryAutoslide(1)
	} else {
		cancelAutoslide()
	}

	startAnimation()
}

function goPrevious() {
	setActiveIndicatorColor('#3A3645')

	if (currentSlideIndex <= 0) currentSlideIndex = testimonials.length - 1
	else currentSlideIndex--

	setActiveIndicatorColor('white')

	cancelAutoslide()

	startAnimation()
}

function startAnimation() {
	transitionDone = false
	blurIntensity = 0
	blurDirection = 0.02
	swappedStates = false

	if (!onMobile) testimonialContainer.classList.add('desktop-filter')

	animate()
}

function animate() {
	if (!transitionDone) {
		requestAnimationFrame(animate)

		//gaussianBlur.setAttribute('stdDeviation', "" + easeInOutQuad(blurIntensity / maxBlur) * maxBlur);
		//gaussianBlur.setAttribute('stdDeviation', "" + easeInOutQuad(0.7 / maxBlur) * maxBlur);
		blurIndex += 1.25

		//blurIntensity = easeInQuart(Math.sin(blurIndex) / 100);
		blurIntensity = easeInQuart(Math.sin(blurIndex / 35))

		if (!swappedStates && blurIntensity >= 0.99) {
			swapState()
		}

		if (swappedStates && blurIntensity <= 0.016) {
			stopTransition()
			blurIndex = 1
		}

		if (!onMobile) {
			gaussianBlur.setAttribute(
				'stdDeviation',
				String(blurIntensity * maxBlur)
			)
		} else
			testimonialContainer.style.opacity =
				(-blurIntensity + 1) * 100 + '%'
		headshot.style.opacity = (-blurIntensity + 1) * 100 + '%'
	}
}

function swapState() {
	swappedStates = true

	quote.innerText = testimonials[currentSlideIndex].quote
	author.innerText = testimonials[currentSlideIndex].author
	title.innerText = testimonials[currentSlideIndex].title
	headshot.src = testimonials[currentSlideIndex].headshot
}

function tryAutoslide(multiplier) {
	cancelAutoslide(true)
	autoslideTimeoutID = setTimeout(() => {
		goNext(true)
	}, autoslideCooldown * multiplier)
}

function cancelAutoslide(breakSlide) {
	if (autoslideTimeoutID != -1) {
		clearTimeout(autoslideTimeoutID)
	}

	!breakSlide && tryAutoslide(1)
}

function stopTransition() {
	transitionDone = true

	if (!onMobile) testimonialContainer.classList.remove('desktop-filter')
}

function easeInOutQuint(x) {
	return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2
}

function easeInQuart(x) {
	return x * x * x * x
}

function easeInOutCubic(x) {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

function easeOutCirc(x) {
	return Math.sqrt(1 - Math.pow(x - 1, 2))
}

function setActiveIndicatorColor(color) {
	document.getElementById(
		'indicator-' + currentSlideIndex
	).style.backgroundColor = color
}
