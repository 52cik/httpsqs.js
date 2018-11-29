# httpsqs.js

> The node client for HTTPSQS.

> [Docker HTTPSQS image](https://hub.docker.com/r/toomee/httpsqs/)

## Usage

```sh
$ yarn add httpsqs.js
```

```js
import HTTPSQS from 'httpsqs.js';
// const HTTPSQS = require('httpsqs.js');

const queue = new HTTPSQS({
  // host: '127.0.0.1',
  name: 'queue-name',
});

(async () => {
  await queue.put('23333');
  console.log(await queue.get());
  console.log(await queue.status());
})();
```
