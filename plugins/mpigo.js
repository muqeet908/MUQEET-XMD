const settingsManager = require('../lib/settingsmanager'); // Path to your settings manager
const { cmd } = require('../command'); // Adjust path as needed to your command registration

cmd({
    pattern: "anticall",
    alias: ["callblock", "togglecall"],
    desc: "Manages the anti-call feature. Use: .anticall [on/off]", // Updated description
    category: "owner",
    react: "📞",
    filename: __filename,
    fromMe: true // Only accessible by the bot's own number
},
async (conn, mek, m, { isOwner, reply, from, sender, args, prefix }) => { // Added 'prefix' to destructured parameters
    try {
        if (!isOwner) {
            return reply("🚫 This command is for the bot owner only.");
        }

        let currentStatus = settingsManager.getSetting('ANTICALL');
        const arg = args[0] ? args[0].toLowerCase() : ''; // Get the first argument

        let replyText;
        let finalReactionEmoji = '📞'; // Default reaction for help/status display

        if (arg === 'on') {
            if (currentStatus) {
                replyText = `📞 Anti-call feature is already *enabled*.`;
                finalReactionEmoji = 'ℹ️'; // Info reaction
            } else {
                settingsManager.setSetting('ANTICALL', true);
                replyText = `📞 Anti-call feature has been *enabled*!`;
                finalReactionEmoji = '✅'; // Enabled reaction
            }
        } else if (arg === 'off') {
            if (!currentStatus) {
                replyText = `📞 Anti-call feature is already *disabled*.`;
                finalReactionEmoji = 'ℹ️'; // Info reaction
            } else {
                settingsManager.setSetting('ANTICALL', false);
                replyText = `📞 Anti-call feature has been *disabled*!`;
                finalReactionEmoji = '❌'; // Disabled reaction
            }
        } else if (arg === '') {
            // No argument provided, show help menu
            const statusEmoji = currentStatus ? '✅ ON' : '❌ OFF';
            replyText = `
*📞 Anti-Call Feature Manager*

Current Status: *${statusEmoji}*

To turn On:
  \`\`\`${prefix}anticall on\`\`\`
To turn Off:
  \`\`\`${prefix}anticall off\`\`\`
            `.trim(); // .trim() removes leading/trailing whitespace
            finalReactionEmoji = '❓'; // Question mark reaction for help
        } else {
            // Invalid argument
            replyText = `❌ Invalid argument. Please use \`${prefix}anticall on\`, \`${prefix}anticall off\`, or just \`${prefix}anticall\` for help.`;
            finalReactionEmoji = '❓'; // Question mark reaction for error/help
        }

        // Send reaction to the command message itself
        await conn.sendMessage(from, {
            react: { text: finalReactionEmoji, key: mek.key }
        });

        // Send the formatted reply message
        await conn.sendMessage(from, {
            text: replyText,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999, // You can adjust or remove this
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter', // Ensure this JID is valid
                    newsletterName: "muqeet-xmd",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in anticall command:", e);
        reply(`An error occurred while managing anti-call: ${e.message}`);
    }
});
