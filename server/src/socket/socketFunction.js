const { io } = require('../server.ts');

const sendNotification = (userid, notification) => {
    const socketid = '123' // to musi byc wyciagane z bazy danych na podstawie userid
    io.emit('notification', notification);
};

export default sendNotification;