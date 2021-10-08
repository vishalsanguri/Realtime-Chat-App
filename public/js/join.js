const socket = io();

const $errorText = document.querySelector('#error');

socket.on('error', (error) => {
    console.log('received');
    $errorText.textContent = error;
    setTimeout(() => {
        $errorText.textContent = '';
    }, 1000);
});
