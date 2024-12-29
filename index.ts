import { Events } from "discord.js";
import { FlagClient } from "./src/types/client";

const client = new FlagClient();

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return await interaction.reply({ content: 'Command somehow doesnt exist', ephemeral: true });

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error executing!', ephemeral: true });
    }
})

client.on(Events.ClientReady, async (_client) => {
    console.log(`Bot is ready! We are ${_client.user.tag}`)
    await client.loadCommands();
})

client.login(process.env.DISCORD_TOKEN)