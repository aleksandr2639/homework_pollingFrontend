import {
  catchError, of, interval, mergeMap,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

export default class Widget {
  constructor(url, root) {
    if (!(root instanceof HTMLElement)) {
      throw new Error('root is not HTMLElement');
    }
    this.root = root;
    this.url = url;
    this.container = this.root.querySelector('.list-items');
    this.quantity = document.querySelector('.quantity');
    this.count = 0;
    this.correctedMessage = '';
    this.data = null;
  }

  start() {
    this.stream$ = interval(3000)
      .pipe(
        mergeMap(() => ajax.getJSON(this.url)
          .pipe(
            catchError(() => of({ messages: [] })),
          )),
      )
      .subscribe((response) => {
        this.render(response);
      });
  }

  render(data) {
    if (data.status === 'ok' && data.messages.length > 0) {
      data.messages.forEach((message) => {
        this.container.insertAdjacentHTML('afterbegin', Widget.markUp(
          message.from,
          this.getLengthSubject(message.subject),
          this.getData(message.received),
        ));
        this.count += 1;
        this.quantity.textContent = this.count;
      });
    }
  }

  static markUp(from, subject, received) {
    return `
    <li class="list-item">
      <div class="name">${from}</div>
      <div class="message">${subject}</div>
      <div>${received}</div>
    </li>
    `;
  }

  getData(date) {
    this.data = `${new Date(date).toLocaleTimeString()} ${new Date(date).toLocaleDateString()}`;
    return this.data;
  }

  getLengthSubject(element) {
    if (element.length > 15) {
      this.correctedMessage = `${element.slice(0, 15)}...`;
      return this.correctedMessage;
    }
    this.correctedMessage = element;
    return this.correctedMessage;
  }
}
