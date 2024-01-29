import Widget from './Widget';

const url = 'https://server-polling.onrender.com/messages/unread';
const root = document.querySelector('.list');
const widget = new Widget(url, root);

widget.start();
