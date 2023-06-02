# chatroom-node.js-server
This is a project i have made so people can chat using a bookmarklet.
# Hosting it
You can host it using node.js here: [render.com](https://render.com)
Or you can host it using your own server/computer with node.js: [node.js](https://nodejs.org)
# Bookmarklet
Code: 
```
javascript:fetch("").then(t=>t.text()).then(t=>{var e=document.createElement("script");e.textContent=t,document.head.appendChild(e)});
```
