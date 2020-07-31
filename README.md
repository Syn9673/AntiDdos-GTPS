# AntiDdos-GTPS
Super simple anti ddos for gtps. This anti-ddos is only for the http server.

## How to bypass?
Basically, the protection happens per registered url. By default, the only url registered is `/growtopia/server_data.php`  
So, you can't really take it down unless you have a few machines or just different ips. You can use proxies to bypass the protection.  
By using proxies, you can get different ips on a single machine. In other terms, you're fooling the http server that you're on different machines. You can then send a `POST` request to `/growtopia/server_data.php` per proxy every `xx` seconds.
