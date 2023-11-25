// #region Imports
const Discord = require('discord.js');
const bot = new Discord.Client();
// #endregion

// #region Bot Vars
var refresh = true;
var serverid = "458969795681976353";
// #endregion

// #region Initialize Discord Bot
bot.once('ready', () => {
    refresh = true;
    console.log('Ready!');
    console.log('Logged in as: ' + bot.user.username + ' - (' + bot.user.id + ')\n');
});

bot.login(process.env.BOT_TOKEN);

bot.on('disconnect', function(event) {
    console.log('----- Bot disconnected from Discord -----');
    if(refresh) {
        console.log('Attempting to reconnect...\n');
        setTimeout(bot.login(process.env.BOT_TOKEN), 1000);
    } else {
        console.log('No reconnect requested...\n');
    }
});
// #endregion

bot.on('message', message => {
    if (message.author.bot) return;
    var channel_id = message.channel;
    var message_str = message.content;

    // #region Prevent commands out-of-server
    var guild = message.guild.id;
    var guildNull = isNullOrUndef(message.guild.id);
    if (guildNull || (guild && !guildNull && message.guild.id !== serverid) ) {
        return;
    }
    // #endregion

    // #region Translation API goes here

    // TODO: Implement Google Translate API
    console.log(channel_id);
    console.log(message_str);

    // #endregion
});

function isNullOrUndef(data) {
    return (data === null || data === undefined || typeof data === 'undefined');
}

function sendEmbed(channel, imgurl) {
    if (channel && channel !== undefined) {
        var new_embed = new Discord.MessageEmbed().setImage(imgurl);
        channel.send(new_embed);
        console.log(imgurl);
    }
}
function sendMsg(channel, text) {
    if (channel && channel !== undefined) {
        channel.send(text);
    }
}

function sendDM(user, text) {
    user.send(text);
    console.log(text);
}
