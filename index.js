const SlackBot = require('slackbots')
const axios = require('axios')

const bot = new SlackBot({
    token: 'xoxb-1280586292499-2386853503015-uSbeK2Tc5l34SqXNVHZaPhH3',
    name: 'jokeyreminder'
})

bot.on('start', () => {
    postToChannel(':cat', 'JokeyReminder has started!');
})


bot.on('error', (err) => {
    console.log(err)
})


bot.on('message', (data) => {
    if(data.type === 'message') {
        handleMessage(data.text);
    }
})


function handleMessage(text) {
    if(text.includes('yomomma')) {
        tellYoMommaJoke();
    } else if(text.includes('chucknorris')) {
        tellChuckNorrisJoke();
    } else if(text.includes('inspire')) {
        getInspiration();
    }
}


function tellYoMommaJoke() {
    axios.get('https://api.yomomma.info/')
    .then(res => {
        postToChannel(':laughing:', res.data.joke);
    });
}

function tellChuckNorrisJoke() {
    axios.get('http://api.icndb.com/jokes/random')
    .then(res => {
        postToChannel(':laughing:', res.data.value.joke);
    });
}

function getInspiration() {
    axios.get('http://quotes.rest/qod.json?category=inspire')           // 10 api calls/hr
    .then(res => {
        var msg = res.data.contents.quotes[0];
        postToChannel(':muscle:',msg.quote + " - " + msg.author);
    })
}

function postToChannel(emoji, messageToChannel) {
    const params = {
        icon_emoji: emoji
    }
    bot.postMessageToChannel(
        'general',
        messageToChannel,
        params
    )
}
