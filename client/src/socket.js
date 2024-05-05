import { io } from 'socket.io-client';

const server_port = process.env.REACT_APP_SERVER_PORT || 8000;

export const socket = io(`${window.location.protocol}//${window.location.hostname}:${server_port}`, {
    autoConnect: false
});


socket.on('connect', () => {
    console.log('connected to socket')
});


