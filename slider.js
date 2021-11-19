const items = [
  "assets/images/pic1.jpeg",
  "assets/images/pic2.jpeg",
  "assets/images/pic3.jpeg",
  "assets/images/pic4.jpeg",
  "assets/images/pic5.jpeg",
  "assets/images/pic6.jpeg",
  "assets/images/pic7.jpeg",
  "assets/images/pic8.jpeg",
  "assets/images/pic9.jpeg",
  "assets/images/pic10.jpeg"
]

// helpers
const isNumber = (value) => {
  return typeof value === "number"
}

class Slider {
  constructor({ containerID, items, transition, autoplay = false, delay = 5 }) {
    this.items = items
    this.index = 0
    this.currentImage = null

    this.isButtonBlocked = false
    this.transition = transition

    this.generateDOM(containerID)
    this.generateDots()

    this.autoplay = autoplay
    this.delay = delay
  }

  setupSlider() {
    this.currentImage = this.generateImage(this.items, this.index)
    this.currentImage.classList.add("current-image")
    this.sliderImage.append(this.currentImage)

    this.nextButton.addEventListener("click", () => this.handleNextImage())
    this.prevButton.addEventListener("click", () => this.handlePrevImage())

    if (this.autoplay) {
      setInterval(() => {
        this.handleNextImage()
      }, this.delay * 1000)
    }
  }

  handleNextImage(index = null) {
    this.handleSwitchImage("next-image", "prev-image", this.getNextIndex, index)
  }

  handlePrevImage(index = null) {
    this.handleSwitchImage("prev-image", "next-image", this.getPrevIndex, index)
  }

  generateImage(items, index) {
    const image = document.createElement("div")
    image.classList.add("image")
    image.style.backgroundImage = `url("${items[index]}")`
    image.style.transition = `${this.transition}s ease-out`

    return image
  }

  getNextIndex(index, items) {
    if (index === items.length - 1) {
      index = 0
    } else {
      index++
    }
    return index
  }

  getPrevIndex(index, items) {
    if (index === 0) {
      index = items.length - 1
    } else {
      index--
    }
    return index
  }

  handleSwitchImage(nextClass, prevClass, getIndexCallback, index) {
    if (this.isButtonBlocked) return

    this.isButtonBlocked = true
    this.index = isNumber(index) ? index : getIndexCallback(this.index, this.items)

    const nextImage = this.generateImage(this.items, this.index)
    nextImage.classList.add(nextClass)
    this.sliderImage.append(nextImage)

    this.regenerateDots()

    setTimeout(() => {
      this.currentImage.classList.add(prevClass)
      nextImage.classList.add("current-image")
      nextImage.classList.remove(nextClass)
    }, 1)
    clearTimeout()

    setTimeout(() => {
      const prevImage = this.currentImage
      this.currentImage = nextImage

      prevImage.remove()
      this.isButtonBlocked = false
    }, this.transition * 1000)
    clearTimeout()
  }

  generateDOM(containerID) {
    const sliderWrapper = document.createElement("div")
    sliderWrapper.classList.add("slider-wrapper")

    // inside sliderWrapper
    const slider = document.createElement("div")
    slider.classList.add("slider")

    this.sliderDots = document.createElement("div")
    this.sliderDots.classList.add("slider-dots")

    // inside slider
    this.prevButton = document.createElement("div")
    this.prevButton.classList.add("prev-button")

    this.sliderImage = document.createElement("div")
    this.sliderImage.classList.add("slider-image")

    this.nextButton = document.createElement("div")
    this.nextButton.classList.add("next-button")

    // DOM tree looks like:
    // div.slider-wrapper
    //   div.slider
    //     div.prev-button
    //     div.slider-image
    //     div.next-button
    //   div.slider-dots
    sliderWrapper.append(slider)
    sliderWrapper.append(this.sliderDots)
    slider.append(this.prevButton)
    slider.append(this.sliderImage)
    slider.append(this.nextButton)

    document.querySelector(`#${containerID}`).append(sliderWrapper)
  }

  regenerateDots() {
    this.sliderDots.innerHTML = ""
    this.generateDots()
  }

  generateDots() {
    this.items.forEach((_item, index) => {
      const dot = document.createElement("div")
      dot.classList.add("dot")

      if (index === this.index) {
        dot.classList.add("active")
      }

      dot.addEventListener("click", () => {
        if (this.index > index) {
          this.handlePrevImage(index)
        } else {
          this.handleNextImage(index)
        }
      })
      this.sliderDots.append(dot)
    })
  }
}

new Slider({
  items,
  containerID: "app",
  transition: 1
}).setupSlider()
