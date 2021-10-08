const socket = io();
// socket.on('updatedCount', (count) => {
//     console.log('We Have a new notification! Count:' + count);
// });

// document.querySelector('#push').addEventListener('click', () => {
//     console.log('This one is sent by you!');
//     socket.emit('notify');
// });

const $input = document.querySelector('#message');
const $locButton = document.querySelector('#send-location');
const $msgButton = document.querySelector('#push');
const $chat = document.querySelector('#chat');

const $msgchattemp = document.querySelector('#message-template').innerHTML;
const $locchattemp = document.querySelector('#location-template').innerHTML;
const $alerttemp = document.querySelector('#alert-template').innerHTML;
const $sidebartemp = document.querySelector('#sidebar-template').innerHTML;

const autoScroll = () => {
    const $lastmsg = $chat.lastElementChild;

    const $marginsHieght =
        parseInt(getComputedStyle($lastmsg).marginBottom) +
        parseInt(getComputedStyle($lastmsg).marginTop);

    const $lastmsgHieght = $lastmsg.offsetHeight + $marginsHieght;

    // console.log($lastmsgHieght);

    const $visibleHieght = $chat.offsetHeight;

    const $containerHieght = $chat.scrollHeight;

    const $scrollOffset = $chat.scrollTop + $visibleHieght;

    if (
        $containerHieght - $lastmsgHieght <=
        $scrollOffset + $scrollOffset * 0.1
    ) {
        $chat.scrollTop = $chat.scrollHeight;
    }
};

const { username, roomname } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

socket.on('message', (msg, color) => {
    const htmllink = Mustache.render($alerttemp, {
        msg,
        color,
    });
    $chat.insertAdjacentHTML('beforeend', htmllink);
    autoScroll();
    return;
});

const sendMessages = () => {
    const val = $input.value;
    if (val.trim() === '') {
        return;
    }
    $locButton.setAttribute('disabled', 'disabled');
    $msgButton.setAttribute('disabled', 'disabled');
    socket.emit('sendMessage', val, false, Date.now(), (error) => {
        $locButton.removeAttribute('disabled');
        $msgButton.removeAttribute('disabled');
        $input.focus();
        if (error) {
            return console.log('The mesage violates the language rules!');
        }
        $input.value = '';
        console.log('Message Delivered!');
    });
};

$msgButton.addEventListener('click', () => {
    sendMessages();
});

$input.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        sendMessages();
    }
});

socket.on('chatMessage', (username, msg, isLocation, createdAt) => {
    // const m = document.createElement('p');
    // m.textContent = msg;
    // $chat.appendChild(m);
    // if (isLocation) {
    //     const a = document.createElement('a');
    //     a.href = isLocation;
    //     a.textContent = 'Visit';
    //     a.target = '_blank';
    //     m.appendChild(a);
    // }
    if (isLocation) {
        const htmllink = Mustache.render($locchattemp, {
            msg: msg,
            link: isLocation,
            createdAt,
            username,
        });
        $chat.insertAdjacentHTML('beforeend', htmllink);
        autoScroll();
        return;
    }
    const htmlmsg = Mustache.render($msgchattemp, {
        msg,
        createdAt,
        username,
    });
    $chat.insertAdjacentHTML('beforeend', htmlmsg);
    autoScroll();
});

$locButton.addEventListener('click', () => {
    $locButton.setAttribute('disabled', 'disabled');
    $msgButton.setAttribute('disabled', 'disabled');
    const loc = navigator.geolocation;
    if (!loc) {
        alert(
            'You Are using a older version of browser geolocation is not supported!'
        );
        return;
    }
    loc.getCurrentPosition((position) => {
        socket.emit(
            'sendMessage',
            `My location is longitude: { ${position.coords.longitude} } || latitude: { ${position.coords.latitude} }.`,
            `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
            Date.now(),
            (error) => {
                $locButton.removeAttribute('disabled');
                $msgButton.removeAttribute('disabled');
                $input.focus();
                if (error) {
                    return console.log(
                        'The mesage violates the language rules!'
                    );
                }
                console.log('Message Delivered!');
            }
        );
    });
});

socket.emit('join', { username, roomname });

socket.on('error', (error) => {
    alert(error);
    location.href = '/';
});

socket.on('updateList', (roomname, users) => {
    const findMe = users.findIndex(
        (ele) => ele.username === username.trim().toLowerCase()
    );
    if (findMe !== -1)
        users[findMe].username = `${users[findMe].username} (YOU)`;
    // console.log(users);
    const html = Mustache.render($sidebartemp, {
        roomname,
        users,
    });

    document.querySelector('#sidebar').innerHTML = html;
});
