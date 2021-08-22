const SlackBot = require('slackbots')
const axios = require('axios')
var setIntervalTime = 3300000;     // 55 min in ms
var channelToPost = 'test-integration'
const bot = new SlackBot({
    token: 'xoxb-1280586292499-2406328397330-agLuXxuPoMIE0zyQjBEpsk2G',
    name: 'thisisabot'
})

bot.on('start', () => {
    postToChannel(':tada', `
        Successfully started the app!
        Commands:
            Type words like quote, motivate, inspire etc to get an inspiring quote immediately.
                E.g. give me a motivational quote!
            Type time in minutes after which you want to be notified, followed by ' set time' or ' set reminder'.
            Default timer is every 55 min.
                E.g. 5 set time will set next reminders at 5 min intervals
    `);
})

var reminder = setInterval(reminderFunction, setIntervalTime);

function reminderFunction() {
        postToChannel(':basketball:','Time to get up!');
        getInspiration();
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
    if(text.includes('inspire') || text.includes('inspiration') || text.includes('motivate') || text.includes('motivation') || text.includes('quote')) {
        getInspiration();
    } else if(text.includes('set time') || text.includes('set reminder')) {
        adjustSetIntervalTiming(text);
    }
}

function adjustSetIntervalTiming(text) {
    clearInterval(reminder);
    console.log('Text is ' + text);
    let [botTag, newTimer, ...doesNotMatter] = text.split(" ");
    newTimer = parseFloat(newTimer);
    console.log('New time ' + newTimer);
    setIntervalTime = newTimer * 60 * 1000;
    console.log('Setted time to ' + setIntervalTime);
    reminder = setInterval(reminderFunction, setIntervalTime);
    postToChannel(':OK:', 'Successfully set the reminder');
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
        channelToPost,
        messageToChannel,
        params
    )
}
