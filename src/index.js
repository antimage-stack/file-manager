import { changeDir, getHomeDir, showCurrentPath } from "./helpers.js";
import { cliCommandsHandler } from "./cli/handler.js";
import { cwd } from "process";
import { osCommandsHandler } from "./os/handler.js";
import path from "path";

const getUserName = () => {
  const arg = process.argv.slice(2);

  if (arg[0].includes("--username")) {
    return arg[0].split("=")[1];
  }
};

const onStartProgram = () => {
  const userName = getUserName();
  const initialDir = getHomeDir();

  console.log(`Welcome to the File Manager, ${userName}!`);
  changeDir(path.join(initialDir, "Documents/NodeJs/RS/FileManager"));
  showCurrentPath(cwd());

  process.stdin.on("data", async (chunk) => {
    try {
      const data = chunk.toString().replace("\n", "").split(" ");

      data[0] === "os"
        ? osCommandsHandler(data.slice(1))
        : await cliCommandsHandler(data[0], data.slice(1));
    } catch (e) {
      console.log(e);
      console.log("Operation Failed");
    } finally {
      showCurrentPath(cwd());
    }
  });

  process.on("SIGINT", () => {
    process.exit();
  });

  process.on("exit", () => {
    console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
  });
};

await onStartProgram();
