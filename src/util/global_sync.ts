import { REST, Routes } from "discord.js";
import * as fs from "fs/promises";
import * as path from "path";
const commands: any[] = []
const entries = await fs.readdir(path.join(process.cwd(), "src", "commands"), { withFileTypes: true, recursive: true });
for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".ts")) {
        //use named destructuring (i hate JS) to get the default export from the file
        const {default: command} = await import(path.join(process.cwd(), entry.parentPath, entry.name));            
        //and add it to the commands collection
        commands.push(command.data.toJSON());
    }
}


const rest = new REST().setToken(process.env.DISCORD_TOKEN ?? "");

try {
    console.log("[SYNC] Started sending commands")
    const data = await rest.put(
        // Routes.applicationGuildCommands(process.env.CLIENT_ID ?? "", process.env.GUILD_ID ?? ""), {body: commands}
        Routes.applicationCommands(process.env.CLIENT_ID ?? ""), {body: commands}
    )
    //@ts-expect-error will be array-like
    console.log(`[SYNC] Discord registered ${data.length} / ${commands.length} commands`)
} catch (error) {
    console.error(error)
}
