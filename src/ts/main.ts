// Thanks https://medium.com/@broncha/waiting-till-facebook-sdk-or-any-other-async-sdk-has-loaded-6682839b9538
function Deferred() {
    var self = this;
    this.promise = new Promise(function (resolve, reject) {
        self.reject = reject
        self.resolve = resolve
    })
}
let fbLoaded = (new Deferred());

let userdata = { name: '', img: '' };

let choices = [
    { title: "angery", desc: "you are angery meme man. nothing soothes the eternal rage" },
    { title: "cold", desc: "you are the cold meme man. there is only cold and the  c u b e s" },
    { title: "cool and nice", desc: "the meme man you are is cool and nice. cool and nice" },
    { title: "enslave", desc: "you are the controlling meme man. all you see becomes enslaved" },
    { title: "orang", desc: "you are not meme man. you are orang. you cannot be  t r u s t e d" },
    { title: "roblox", desc: "you are roblox meme man. creative yet socially  i n e p t" },
    { title: "stonks down", desc: "you are bad stonks meme man. investments are not what you work well with" },
    { title: "stonks", desc: "you are the wealth creating meme man. the stonks rise at your whim" },
    { title: "the answer", desc: "you know the answer to the riddle of the rocks. you are a powerful meme man" },
    { title: "not good", desc: "you are not quite angery but not happy meme man either" },
    { title: "smoek", desc: "you smooeked too much itS Goi)NG wROmg n()w" },
    { title: "knowledge", desc: "the meme man that knows all. nothing escapes him" },
];

let usedResults = [];

function chooseResult() {
    return Math.floor(Math.random() * choices.length) + 1;
}

function getNewResult(choice?) {
    let title = document.querySelector("#result h3");
    let desc = document.querySelector('#result p');
    let img = document.querySelector('#result img');

    let res = chooseResult();

    if (usedResults.length > choices.length) {
        usedResults = [];
    } else {
        while (usedResults.indexOf(res) !== -1) {
            res = chooseResult();
        }
    }

    if (choice > 0 && choice <= choices.length) res = choice;

    title.textContent = `you are ${choices[res - 1].title}!`;
    desc.textContent = choices[res - 1].desc;
    img.setAttribute('src', `./img/results/${choices[res - 1].title}.png`);

    location.hash = `${res}`;

    // modifyShareButton(document.querySelector('#result').querySelector('.fb-share-button'), choices[res - 1].title);

    usedResults.push(res);

    return res;
}

// <div 
// class="fb-share-button" 
// data-href="https://developers.facebook.com/docs/plugins/" 
// data-layout="button" 
// data-size="large">
//  <a 
//    target="_blank" 
//    href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse"
//    class="fb-xfbml-parse-ignore">
//      Share
//  </a>
// </div>

function createShareButton(result?) {
    let linkedUrl = result?new URL(`${location.origin}/share_results/${result}.html`):new URL(location.origin);
    linkedUrl.search = `?n=${userdata.name}`;

    let sharerURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(linkedUrl.href)}&amp;src=sdkpreparse`


    let shareBtn = document.createElement('div');
    shareBtn.classList.add('fb-share-button');

    shareBtn.setAttribute('data-href', linkedUrl.href);
    shareBtn.setAttribute('data-layout', 'button');
    shareBtn.setAttribute('data-size', 'large');

    let shareAnchor = document.createElement('a');
    shareAnchor.classList.add('fb-xfbml-parse-ignore');

    shareAnchor.setAttribute('target', '_blank');
    shareAnchor.setAttribute('href', sharerURL);
    shareAnchor.setAttribute('target', '_blank');

    shareBtn.appendChild(shareAnchor);

    return shareBtn;
}

// function modifyShareButton(button: HTMLElement, result) {
//     let parent = button.parentElement;
//     parent.removeChild(button);
//     parent.appendChild(createShareButton(result));
// }

function fbLoggedIn() {
    let resultDiv = (<HTMLElement>document.querySelector('#result'));
    resultDiv.style.display = 'block';
    (<HTMLElement>document.querySelector('#splash')).style.display = 'none';

    (<HTMLElement>document.querySelector('#share-button-here')).appendChild(createShareButton(location.href));

    setTimeout(() => {
        (<HTMLElement>document.querySelector('#result img')).classList.remove('loading');
        getNewResult();
        (<HTMLElement>document.querySelector('#result a')).style.display = 'unset';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', e => {
    let tryAgainLink = (<HTMLElement>document.querySelector('#result a'));
    tryAgainLink.style.display = 'none';
    tryAgainLink.addEventListener('click', getNewResult);

    let search = (new URL(location.href)).searchParams;

    // if viewing
    if (search.get('n')) {
        (<HTMLElement>document.querySelector('#splash')).style.display = 'none';
        (<HTMLElement>document.querySelector('#result')).style.display = 'block';

        let tryLink = document.querySelector('#try-it') as HTMLElement;

        tryLink.addEventListener('click', ()=>{
            location.href = location.origin;
        });

        tryLink.style.display = 'block';

        userdata.name = search.get('n');
        getNewResult(location.hash.replace('#',''));

    } else {
        // if using
        fbLoaded.promise.then(() => {
            //@ts-ignore
            FB.getLoginStatus(res => {
                if (res.status === 'connected') {
                    fbLoggedIn();
                }
            })
        })
    }
})

window.addEventListener('hashchange', e => {
    getNewResult(location.hash.replace('#', ''));
})