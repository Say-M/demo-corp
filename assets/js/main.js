let idQrcode = new QRCode('id-qrcode', {
  width: 200,
  height: 200,
  colorDark: '#000000',
  colorLight: '#ffffff',
  correctLevel: QRCode.CorrectLevel.H,
})
let customerQrcode = new QRCode('customer-qrcode', {
  width: 200,
  height: 200,
  colorDark: '#000000',
  colorLight: '#ffffff',
  correctLevel: QRCode.CorrectLevel.H,
})
// ! api call
const generateQR = async (id) => {
  const random = Math.floor(Math.random() * 500) + 1
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`)
  const data = await response.json()
  id === 'id-qrcode'
    ? idQrcode.makeCode(data?.abilities?.[0]?.ability?.name)
    : customerQrcode.makeCode(data?.abilities?.[0]?.ability?.name)
}

// ! timer functionalities
const timerElement = document.querySelector('#timer')
let interval = null

const startTimer = (duration, ele) => {
  let timer = duration,
    minutes,
    seconds
  interval = setInterval(() => {
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10)

    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds

    ele.textContent = minutes + ':' + seconds

    if (--timer < 0) {
      generateQR('id-qrcode')
      timer = duration
    }
  }, 1000)
}
let first = false
if (!first) {
  generateQR('id-qrcode')
  startTimer(3, timerElement)
  first = true
}

// ! tab functionalities
const tabItems = document.querySelectorAll('.tab-item')
const tabContents = document.querySelectorAll('.tab-content > div')

tabItems.forEach((item) => {
  item.addEventListener('click', () => {
    tabItems.forEach((item) => {
      item.classList.remove('active')
    })
    item.classList.add('active')
    tabContents.forEach((content) => {
      content.classList.remove('active')
    })
    const target = item.getAttribute('data-target')
    document.querySelector(`#${target}`)?.classList.add('active')
    if (target === 'id') {
      startTimer(60 * 2, timerElement)
    } else {
      clearInterval(interval)
    }
    if (target !== 'credentials') {
      generateQR(target === 'id' ? 'id-qrcode' : 'customer-qrcode')
    }
  })
})
