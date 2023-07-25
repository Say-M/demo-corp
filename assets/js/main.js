var socket = io('http://18.140.65.175:3000');
let idQrcode = document.querySelector('#id-qrcode'),
  customerQrcode = document.querySelector('#customer-qrcode'),
  paymentQrcode = document.querySelector('#payment-qrcode');
if (idQrcode)
  idQrcode = new QRCode('id-qrcode', {
    width: 300,
    height: 300,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
  });
if (customerQrcode)
  customerQrcode = new QRCode('customer-qrcode', {
    width: 200,
    height: 200,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
  });
if (paymentQrcode)
  paymentQrcode = new QRCode('payment-qrcode', {
    width: 200,
    height: 200,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
  });

// ! api call
const generateQR = async (id) => {
  //const random = Math.floor(Math.random() * 500) + 1
  let response;
  if (id === 'id-qrcode')
    response = await fetch('http://18.140.65.175:3000/verificationQR');
  else if (id === 'customer-qrcode')
    response = await fetch('http://18.142.230.84:3000/becomeMemberQR');
  else if (id === 'payment-qrcode')
    response = await fetch('http://18.142.230.84:3000/verificationQR');

  const data = await response.json();
  customerQrcode?.clear();
  idQrcode?.clear();
  paymentQrcode?.clear();
  if (id === 'id-qrcode') idQrcode?.makeCode(data?.qrCodeString);
  else if (id === 'customer-qrcode')
    customerQrcode?.makeCode(data?.qrCodeString);
  else if (id === 'payment-qrcode') paymentQrcode?.makeCode(data?.qrCodeString);

  //socket.on('connect', function () {
  //    console.log(data);
  socket.emit('qrLoaded', { requestId: data.requestId });
  //});
};

socket.on('connect', function () {
  console.log('Socket connected');
});

socket.on('connect_error', function (data) {
  console.log(data);
});

socket.on('qrScannedOnServer', function (data) {
  //change the state of the page after this message is received
  console.log('QR Scanned');
});

socket.on('verificationResult', function (data) {
  //change the state of the page after this message is received
  if (/(\/|index.html)$/.test(window.location.pathname)) {
    if (data.message === 'Accepted') window.location = '/payment.html';
    else window.alert('Verification Failed');
  } else if (/payment.html$/.test(window.location.pathname)) {
    document.querySelector('#paymentModal').classList.remove('active');
    const paymentAlert = document.querySelector('#payment-alert');
    paymentAlert.style = 'display: block';
    if (data.message === 'Accepted') {
      paymentAlert.classList.add('success');
      paymentAlert.insertAdjacentElement(
        'afterbegin',
        (document.createElement('p').innerHTML =
          '<strong>Success!</strong> Your payment is successful.')
      );
    } else {
      paymentAlert.classList.add('error');
      paymentAlert.insertAdjacentElement(
        'afterbegin',
        (document.createElement('p').innerHTML =
          '<strong>Error!</strong> Your payment is unsuccessful.')
      );
    }
  }
  console.log('Verification Result:', data);
  // {message: 'Accepted'}
});
//qrScannedOnServer

// ! timer functionalities
const timerIdQrcodeElement = document.querySelector('#timer-id-qrcode');
const timerCustomerQrcodeElement = document.querySelector(
  '#timer-customer-qrcode'
);
const timerPaymentQrcodeElement = document.querySelector(
  '#timer-payment-qrcode'
);
let interval = null;

const startTimer = (duration, ele) => {
  let timer = duration,
    minutes,
    seconds;
  interval = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    ele.textContent = minutes + ':' + seconds;

    if (--timer < 0) {
      generateQR('id-qrcode');
      timer = duration;
    }
  }, 1000);
};
let first = false;
// ! if first time on index.html page
if (!first && /(\/|index.html)$/.test(window.location.pathname)) {
  generateQR('id-qrcode');
  startTimer(120, timerIdQrcodeElement);
  first = true;
}

// ! tab functionalities
const tabItems = document.querySelectorAll('.tab-item');
const tabContents = document.querySelectorAll('.tab-content > div');

tabItems.forEach((item) => {
  item.addEventListener('click', () => {
    tabItems.forEach((item) => {
      item.classList.remove('active');
    });
    item.classList.add('active');
    tabContents.forEach((content) => {
      content.classList.remove('active');
    });
    const target = item.getAttribute('data-target');
    document.querySelector(`#${target}`)?.classList.add('active');
    if (target === 'id') {
      clearInterval(interval);
      timerIdQrcodeElement.textContent = '02:00';
      startTimer(60 * 2, timerIdQrcodeElement);
    } else if (target === 'customer') {
      clearInterval(interval);
      timerCustomerQrcodeElement.textContent = '02:00';
      startTimer(60 * 2, timerCustomerQrcodeElement);
    } else {
      clearInterval(interval);
    }
    if (target !== 'credentials') {
      generateQR(target === 'id' ? 'id-qrcode' : 'customer-qrcode');
    }
  });
});

// ! modal open functionalities
const modals = document.querySelectorAll('[data-toggle="modal"]');
modals.forEach((modal) => {
  modal.addEventListener('click', () => {
    const target = modal.getAttribute('data-target');
    document.querySelector(target)?.classList.add('active');

    // ! if modal is payment modal
    if (target === '#paymentModal') {
      clearInterval(interval);
      timerPaymentQrcodeElement.textContent = '02:00';
      startTimer(60 * 2, timerPaymentQrcodeElement);
      generateQR('payment-qrcode');
    }
  });
});

// ! modal close functionalities
const modalCloseBtns = document.querySelectorAll('[data-dismiss="modal"]');
modalCloseBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    document.querySelector(target)?.classList.remove('active');
  });
});

window.onclick = function (event) {
  if (event.target.classList.contains('modal'))
    event.target.classList.remove('active');
};
