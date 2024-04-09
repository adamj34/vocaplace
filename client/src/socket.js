import { io } from 'socket.io-client';

export const socket = io(`${window.location.protocol}//${window.location.hostname}:8000`, {
    autoConnect: false
});

const notifications = {}

socket.on('connect', () => {
    console.log('connected to socket')
});

socket.on('notification', (notification) => {
    console.log('new notification: ' + notification);
});