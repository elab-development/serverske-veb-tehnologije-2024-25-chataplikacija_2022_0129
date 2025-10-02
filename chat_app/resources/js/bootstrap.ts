 
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axios from "axios";

 
axios.defaults.baseURL = "http://127.0.0.1:8000";;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

 
window.axios = axios;

 
window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",  
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST ?? "127.0.0.1",
  wsPort: Number(import.meta.env.VITE_REVERB_PORT ),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT),
  forceTLS: false,
  enabledTransports: ["ws", "wss"],
});

 
window.Echo = echo;

export default echo;
