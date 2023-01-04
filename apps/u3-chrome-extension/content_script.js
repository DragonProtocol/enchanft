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
    const oldU3 = document.getElementById('u3-container');
    if (oldU3) {
      oldU3.style.display = 'block';
      document.body.children[0].classList.add('toHide');

      return;
    }
    const u3Container = document.createElement('div');
    u3Container.id = 'u3-container';

    const closeBtn = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    closeBtn.classList.add('u3-close-btn');
    closeBtn.setAttribute('width', 20);
    closeBtn.setAttribute('height', 20);
    closeBtn.setAttribute('viewBox', '0 0 20 20');
    closeBtn.innerHTML = `<path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 2.5C10.5 2.22386 10.2761 2 10 2C9.72386 2 9.5 2.22386 9.5 2.5V10L2 10C1.72386 10 1.5 10.2239 1.5 10.5C1.5 10.7761 1.72386 11 2 11H9.5V18.5C9.5 18.7761 9.72386 19 10 19C10.2761 19 10.5 18.7761 10.5 18.5V11H18C18.2761 11 18.5 10.7761 18.5 10.5C18.5 10.2239 18.2761 10 18 10L10.5 10V2.5Z" fill="#718096"></path>`;
    closeBtn.onclick = () => {
      u3Container.style.display = 'none';

      document.body.children[0].classList.remove('toHide');
    };
    u3Container.appendChild(closeBtn);

    const iframe = document.createElement('iframe');

    u3Container.appendChild(iframe);
    document.body.children[0].append(loading);

    iframe.src = `https://dev.u3.xyz/contents/create?url=${request?.tab?.url}`;
    iframe.style = `width: 100vw;height: 100vh;border: 0;`;
    document.body.append(u3Container);
    console.log(iframe, iframe?.contentWindow?.document?.body);

    iframe.onload = () => {
      setTimeout(() => {
        document.body.children[0].removeChild(loading);
        document.body.children[0].classList.add('toHide');
      }, 2800);
    };
  }
});
