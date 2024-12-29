import { Client, Collection, GatewayIntentBits } from "discord.js";
import * as path from "path"
import * as fs from "fs/promises"

export class FlagClient extends Client {
    public commands: Collection<any, any>;
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildPresences, 
                GatewayIntentBits.GuildMessages, 
                GatewayIntentBits.GuildVoiceStates
            ]
        });
        this.commands = new Collection();
    }

    async loadCommands() {
        const entries = await fs.readdir("./src/commands", { withFileTypes: true, recursive: true });
        for (const entry of entries) {
            if (entry.isFile() && entry.name.endsWith(".ts")) {
                //use named destructuring (i hate JS) to get the default export from the file
                const {default: command} = await import(path.join(process.cwd(), entry.parentPath, entry.name));            
                //and add it to the commands collection
                this.commands.set(command.data.name, command);
            }
        }
    }

}