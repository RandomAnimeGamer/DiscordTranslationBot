// #region Imports
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Discord = require('discord.js');
const bot = new Discord.Client({ intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.MessageContent,
]});
// #endregion

// #region Bot Vars
var refresh = true;
var serverid = '458969795681976353';
var bot_id = '1180304300505825350';
var allowed_channels = [
    '952839887218937856',
    '830885345875853353',
];
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

bot.on('messageCreate', (message) => {
    if (message.author.bot) return;
    let channel = message.channel;
    let channel_id = message.channelId;
    let message_str = message.content;
    
    // #region Prevent commands out-of-server
    var guild = message.guild.id;
    var guild_null = IsNullOrUndef(message.guild.id);
    if (guild_null || (guild && !guild_null && message.guild.id !== serverid) ) {
        return;
    }
    if(!allowed_channels.includes(channel_id)) {
        return;
    }
    // #endregion

    // #region Different language requests
    let repliedUser = null;
    if(message.type === 19 && !IsNullOrUndef(message.mentions) && !IsNullOrUndef(message.mentions.repliedUser)) {
        repliedUser = message.mentions.repliedUser;
    }

    if(!IsNullOrUndef(repliedUser) && repliedUser.id === bot_id && !IsNullOrUndef(message.reference)) {
        channel.messages.fetch(message.reference.messageId).then((replied_msg) => {
            let splice_all = replied_msg.content.split('```');
            
            let original_msg = splice_all[1].replace('\n', '');
            
            let force_from = splice_all[0].split('(')[1].split(')')[0];
            let force_to = 'both';
            if(splice_all.length < 7) {
                force_to = splice_all[2].split('(')[1].split(')')[0];
            }
    
            let split_cmd = message_str.split(' ');
            if(split_cmd.length === 2) {
                let spl1 = split_cmd[0].split(':');
                let spl2 = split_cmd[1].split(':');
    
                force_from = (spl1[0].toLowerCase() === 'from') ? spl1[1] : spl2[1];
                force_to = (spl1[0].toLowerCase() === 'to') ? spl1[1] : spl2[1];
            }
            else {
                let check_splice = message_str.split(':');
                if(check_splice.length === 2) {
                    if(check_splice[0].toLowerCase() === 'from') {
                        force_from = check_splice[1];
                    }
                    if(check_splice[0].toLowerCase() === 'to') {
                        force_to = check_splice[1];
                    }
                }
            }
    
            if(force_to === 'both') {
                let en = TranslateMessage(force_from, 'en', original_msg);
                let ja = TranslateMessage(force_from, 'ja', original_msg);
                Promise.all([en, ja]).then((values) => {
                    SendMsg(channel, FormatResponse(original_msg, values[0], values[1], force_from, 'en', 'ja'));
                    return;
                });
            }
            else {
                TranslateMessage(force_from, force_to, original_msg).then((res) => {
                    SendMsg(channel, FormatResponse(original_msg, res, null, force_from, force_to, null));
                    return;
                });
            }
        }).catch((err) => {
            console.log(err);
            SendMsg(
                channel,
                (
                    'There was an error while re-translating your message.' + '\n' +
                    'Please refer to the official Google Translate language codes: https://cloud.google.com/translate/docs/languages'
                )
            );
            return;
        });

    }
    // #endregion

    // #region Default Translation
    else {
        CheckFromLanguage(message_str).then((from) => {
            let to = SetToLanguage(from);
    
            if(from === 'DETECT_ERR') {
                SendMsg(channel, 'There was an error while detecting the language of your message.');
                return;
            }
    
    
            if(to === 'both') {
                let en = TranslateMessage(from, 'en', message_str);
                let ja = TranslateMessage(from, 'ja', message_str);
                Promise.all([en, ja]).then((values) => {
                    SendMsg(channel, FormatResponse(message_str, values[0], values[1], from, 'en', 'ja'));
                    return;
                });
            }
            else {
                TranslateMessage(from, to, message_str).then((res) => {
                    SendMsg(channel, FormatResponse(message_str, res, null, from, to, null));
                    return;
                });
            }
        });
    }
    // #endregion
});

function IsNullOrUndef(data) {
    return (data === null || data === undefined || typeof data === 'undefined');
}

function SendMsg(channel, text) {
    if (channel && channel !== undefined) {
        channel.send(text);
    }
}

async function CheckFromLanguage(text) {
    // https://api.datpmt.com/api/v1/dictionary/detection?string=
    // => [language, confidence]
    // eg => ["en", 0.93254006]
    const res = await fetch(
        'https://api.datpmt.com/api/v1/dictionary/detection' + 
        '?string=' + text
    );
    const response = await res.json();

    return new Promise((resolve) => {
        if(response.length > 0) {
            resolve(response[0]);
        }
        resolve('DETECT_ERR');
    });
}

function SetToLanguage(from_lang) {
    switch(from_lang) {
        case 'en': return 'ja';
        case 'ja': return 'en';
        default:   return 'both';
    }
}

async function TranslateMessage(from_lang, to_lang, msg) {
    // https://cloud.google.com/translate/docs/languages
    // => string
    // => 'hello'
    const res = await fetch(
        'https://api.datpmt.com/api/v1/dictionary/translate' +
        '?string=' + msg +
        '&from_lang=' + from_lang +
        '&to_lang=' + to_lang
    );
    const response = await res.json();

    return new Promise((resolve) => {
        if(typeof(response) === 'object') {
            resolve(
                'There was an error translating this text. ' + 
                'Please request R.A.G (randomanimegamer) to check the logs.' + '\n' + 
                response.error
            );
        }
        else {
            resolve(response);
        }
    });
}

function FormatResponse(orig, tran1, tran2, from, to1, to2) {
    let output = (
        'Original Message (' + from + '):\n' +
        '```\n' + orig + '```\n' +
        'Translated Message (' + to1 + '):\n' +
        '```\n' + tran1 + '```'
    );
    if(!IsNullOrUndef(tran2)) {
        output += (
            '\n' +
            'Translated Message (' + to2 + '):\n' +
            '```\n' + tran2 + '```'
        );
    }
    return output;
}
