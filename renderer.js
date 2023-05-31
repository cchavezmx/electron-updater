function getDeviceDetails(device) {
  return grantedDevice.productName || `Unknown device ${grantedDevice.deviceId}`
}

async function testIt() {
  const noDevicesFoundMsg = 'No devices found'
  const grantedDevices = await navigator.usb.getDevices()
  let grantedDeviceList = ''
  if (grantedDevices.length > 0) {    
    grantedDevices.forEach(device => {
      grantedDeviceList += `<hr>${getDeviceDetails(device)}</hr>`
    })    
  } else {
    grantedDeviceList = noDevicesFoundMsg
  }
  document.getElementById('granted-devices').innerHTML = grantedDeviceList

  grantedDeviceList = ''
  try {
    const grantedDevice = await navigator.usb.requestDevice({
      filters: []
    })
    grantedDeviceList += `<hr>${getDeviceDetails(device)}</hr>`
    
  } catch (ex) {
    if (ex.name === 'NotFoundError') {
      grantedDeviceList = noDevicesFoundMsg
    }
  }
  document.getElementById('granted-devices2').innerHTML = grantedDeviceList
}

document.getElementById('clickme').addEventListener('click',testIt)

const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');


ipcRenderer.on('update_available', () => {
  ipcRenderer.removeAllListeners('update_available');
  message.innerText = 'A new update is available. Downloading now...';
  notification.classList.remove('hidden');
});


ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.removeAllListeners('update_downloaded');
  message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
  restartButton.classList.remove('hidden');
  notification.classList.remove('hidden');
});

function closeNotification() {
  notification.classList.add('hidden');
}
function restartApp() {
  ipcRenderer.send('restart_app');
}