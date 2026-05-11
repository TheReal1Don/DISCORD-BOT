console.clear();

process.title = "Sleepyy AFK Bot";

console.log(`
███████╗██╗░░░░░███████╗███████╗██████╗░██╗░░░██╗
██╔════╝██║░░░░░██╔════╝██╔════╝██╔══██╗╚██╗░██╔╝
██████╗░██║░░░░░█████╗░░█████╗░░██████╔╝░╚████╔╝░
╚════██╗██║░░░░░██╔══╝░░██╔══╝░░██╔═══╝░░░╚██╔╝░░
██████╔╝███████╗███████╗███████╗██║░░░░░░░░██║░░░
╚═════╝░╚══════╝╚══════╝╚══════╝╚═╝░░░░░░░░╚═╝░░░

        Sleepyy AFK Bot
        Made By Sleepyy
`);

const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const {
    joinVoiceChannel,
    VoiceConnectionStatus,
    entersState
} = require('@discordjs/voice');

const TOKEN = process.env.TOKEN;
const GUILD_ID = '1483642534587793450';
const CHANNEL_ID = '1483642535627985079';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

let connection = null;

async function connectVoice() {
    try {
        const guild = client.guilds.cache.get(GUILD_ID);

        if (!guild) {
            console.log('السيرفر مو موجود');
            return;
        }

        connection = joinVoiceChannel({
            channelId: CHANNEL_ID,
            guildId: GUILD_ID,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        });

        console.log('دخل الروم الصوتي');

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            console.log('انفصل... يحاول يرجع');

            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5000),
                ]);

                console.log('رجع الاتصال');
            } catch (err) {
                console.log('يعيد الدخول للروم...');
                setTimeout(connectVoice, 5000);
            }
        });

    } catch (err) {
        console.log('خطأ:', err);
        setTimeout(connectVoice, 10000);
    }
}

client.once('ready', async () => {
    console.log(`${client.user.tag} شغال 24/7`);

    connectVoice();

    setInterval(() => {
        if (!connection) {
            console.log('الاتصال مفقود، إعادة تشغيل...');
            connectVoice();
        }
    }, 30000);
});

client.on('error', console.error);
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

client.login(TOKEN);
