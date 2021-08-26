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
            \`set:time:N\` to get notification after N minutes (Default 55 min)
            \`stop:notif\` to stop notifications.
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
    text = text.substr(text.indexOf(" ") + 1);
    if(text.startsWith('set:time')) {
        adjustSetIntervalTiming(text);
    } else if(text === 'stop:notif') {
        console.log("Stopped timer");
        clearInterval(reminder);
        postToChannel(":OK:", "You won't get notifications anymore!");
    }
}

function adjustSetIntervalTiming(text) {
    clearInterval(reminder);
    let [set, time, timerVal] = text.split(":");
    newTimer = parseFloat(timerVal);
    if(isNaN(newTimer)) {
        return;
    }
    console.log('New time ' + newTimer);
    setIntervalTime = newTimer * 60 * 1000;
    console.log('Setted time to ' + setIntervalTime + ' min');
    reminder = setInterval(reminderFunction, setIntervalTime);
    postToChannel(':OK:', 'Successfully set the reminder interval to ' + newTimer + ' min!');
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
