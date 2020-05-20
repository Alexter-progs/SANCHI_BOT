import {Client, GuildMember, Guild, VoiceState, TextChannel} from 'discord.js';

const bot = new Client();

let TEXT_CHANNELS = {};

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`);    
});

bot.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
    if (msg.content === '!channel') {
        console.log(`Setting channel ${msg.channel.id} of guild ${msg.guild.id}`);
        TEXT_CHANNELS[msg.guild.id] = msg.channel.id;
        console.log(JSON.stringify(TEXT_CHANNELS));

    }
});

bot.on('guildMemberAdd', () => {
    console.log('member add');
});

bot.on('voiceStateUpdate', (prevState: VoiceState, newState: VoiceState): void => {
    console.log(prevState.channelID);
    console.log(newState.channelID);
    if (!prevState.channelID && !!newState.channelID) {
        console.log('User joined channel');
        const textChannel = getChannelByGuildId(newState.guild.id);
        textChannel.send(`@${newState.member.user.username} 'joined ${newState.channel.name}'`);
    } else if (!newState.channelID) {
        console.log('User left channel');
        const textChannel = getChannelByGuildId(newState.guild.id);
        textChannel.send(`@${prevState.member.user.username} left ${prevState.channel.name}`);
    }
});

function getChannelByGuildId(guildId: string) {
    const channelId = TEXT_CHANNELS[guildId];
    return bot.channels.cache.get(channelId) as TextChannel;
}

const botToken = process.env.BOT_TOKEN;

bot.login(botToken);