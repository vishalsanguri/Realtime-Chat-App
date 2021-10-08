let users = [];

const addUser = ({ id, username, roomname }) => {
    const user = username.trim().toLowerCase();
    const room = roomname.trim().toLowerCase();
    if (!user || !room) {
        // console.log({
        //     error: 'Please send valid field!',
        // });
        return {
            error: 'Please send valid field!',
        };
    }
    const doOccupied = users.some(
        (ele) =>
            ele.username === username.trim().toLowerCase() &&
            ele.roomname === roomname.trim().toLowerCase()
    );
    // console.log(doOccupied);
    if (doOccupied) {
        // console.log({
        //     error: 'User name already taken!',
        // });
        return {
            error: 'User name already taken!',
        };
    }
    users.push({
        username: username.trim().toLowerCase(),
        roomname: roomname.trim().toLowerCase(),
        id,
    });
    // console.log(users);
    return {
        error: null,
    };
};

const removeUser = ({ id }) => {
    const user = users.findIndex((ele) => ele.id === id);
    if (user === -1) {
        // console.log({
        //     rror: 'No user exists!',
        // });
        return {
            error: 'No user exists!',
        };
    }
    users.splice(user, 1);
    return {
        error: null,
    };
};

const getUser = ({ id }) => {
    const user = users.find((ele) => ele.id === id);
    if (!user) {
        // console.log({
        //     error: 'No user exists!',
        // });
        return {
            error: 'No user exists!',
        };
    }

    return user;
};

const getAllUserInRoom = ({ roomname }) => {
    const usersRoom = users.filter((ele) => ele.roomname === roomname);

    // console.log(usersRoom);
    return usersRoom;
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getAllUserInRoom,
};

// addUser({ id: 1, username: 'a', roomname: 'aa' });
// console.log(users);
// addUser({ id: 2, username: 'b', roomname: 'aa' });
// console.log(users);
// addUser({ id: 3, username: 'b', roomname: 'bb' });
// console.log(users);
// removeUser({ id: 4 });
// console.log(users);
// removeUser({ id: 3 });
// console.log(users);
// getUser({ id: 3 });
// console.log(users);
// getUser({ id: 2 });
// console.log(users);
// addUser({ id: 3, username: 'b', roomname: 'bb' });
// console.log(users);
// getAllUserInRoom({ roomname: 'aa' });
