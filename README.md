# AntiDdos-GTPS
Super simple anti ddos for gtps. This anti-ddos is only for the http server.

## How to bypass?
Basically, the protection happens per url. For example, if i enter url `/test`, i won't be able to access it for `xx` seconds. But i will be able to access other urls.  
So basically, you can do is something like this:  
```ts
function sendRandom(): void {
  const possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"; // possible strings
  let url: string = "";

  for (let i: number = 0; i < 16; i++) {
    url += possible[Math.floor(Math.random() * possible.length)]; // select a single char from possible strings randomly
  }

  sendRequest(`target_url/${url}`); // this function should be replaced by the http client that you are using
}
```
