// const app = document.createElement('div');
// app.id = "u3-extension-root";

// document.body.appendChild(app);

const loading = document.createElement('div');
loading.id = 'u3-loading';
loading.innerHTML = `<div class="rubiks-loader">
<div class="cube">
  <div class="face front piece row-top col-left yellow"></div>
  <div class="face front piece row-top col-center green"></div>
  <div class="face front piece row-top col-right white"></div>
  <div class="face front piece row-center col-left blue"></div>
  <div class="face front piece row-center col-center green"></div>
  <div class="face front piece row-center col-right blue"></div>
  <div class="face front piece row-bottom col-left green"></div>
  <div class="face front piece row-bottom col-center yellow"></div>
  <div class="face front piece row-bottom col-right red"></div>
  <div class="face down piece row-top col-center green"></div>
  <div class="face down piece row-center col-center red"></div>
  <div class="face down piece row-bottom col-center white"></div>
  <div class="face right piece row-center col-left yellow"></div>
  <div class="face right piece row-center col-center green"></div>
  <div class="face right piece row-center col-right blue"></div>
  <div class="face up piece row-top col-left yellow"></div>
  <div class="face up piece row-center col-left blue"></div>
  <div class="face up piece row-bottom col-left green"></div>
  <div class="face left piece row-bottom col-left green"></div>
  <div class="face left piece row-bottom col-center yellow"></div>
  <div class="face left piece row-bottom col-right red"></div>
</div>
</div>
content loading . . .`;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'clicked_browser_action') {
    const iframe = document.createElement('iframe');
    document.body.children[0].append(loading);

    iframe.src = `https://dev.u3.xyz/contents/create?url=${request?.tab?.url}`;
    iframe.style = `width: 100vw;height: 100vh;border: 0;`;
    iframe.onload = () => {
      setTimeout(() => {
        document.body.children[0].removeChild(loading);
        document.body.children[0].classList.add('toHide');
      }, 2800);
    };
    document.body.append(iframe);
  }
});
