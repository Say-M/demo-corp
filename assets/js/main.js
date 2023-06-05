// ! generate qr code
new QRCode(document.getElementById('id-qrcode'), {
  text: 'Hello world',
  width: 200,
  height: 200,
  colorDark: '#000000',
  colorLight: '#ffffff',
  correctLevel: QRCode.CorrectLevel.H,
})
new QRCode(document.getElementById('customer-qrcode'), {
  text: 'Hello world',
  width: 200,
  height: 200,
  colorDark: '#000000',
  colorLight: '#ffffff',
  correctLevel: QRCode.CorrectLevel.H,
})

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
      timer = duration
    }
  }, 1000)
}
startTimer(59.5 * 2, timerElement)

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
  })
})
