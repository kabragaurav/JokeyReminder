const SlackBot = require('slackbots')
const axios = require('axios')
var setIntervalTime = 3300000;      // 55 min in ms
const bot = new SlackBot({
    token: 'xoxb-1280586292499-2386853503015-uSbeK2Tc5l34SqXNVHZaPhH3',
    name: 'jokeyreminder'
})

bot.on('start', () => {
    postToChannel(':cat', 'JokeyReminder has started!');
})

var reminder = setInterval(reminderFunction, setIntervalTime);

function reminderFunction() {
        postToChannel(':orange_heart:','Time to get up!');
        var funcs = [tellYoMommaJoke, tellChuckNorrisJoke, getInspiration];
        funcs[Math.floor(Math.random() * funcs.length)]();
}

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
    } else if(text.includes('inspiration') || text.includes('motivate') || text.includes('motivation')) {
        getInspiration();
    } else if(text.includes('set time')) {
        adjustSetIntervalTiming(text);
    }
}

function adjustSetIntervalTiming(text) {
    clearInterval(reminder);
    setIntervalTime = parseInt(text.substring(text.lastIndexOf(' ') + 1, text.length)) * 60 * 1000;
    setInterval(reminderFunction, setIntervalTime);
    postToChannel(':OK:', 'Successfully set the reminder');
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
    axios.get('https://type.fit/api/quotes')           // 10 api calls/hr
    .then(res => {
        var msg = res.data;
        var len = msg.length;
        var quote = msg[Math.floor(Math.random() * len)];
        postToChannel(':muscle:',quote.text + " - " + quote.author);
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
