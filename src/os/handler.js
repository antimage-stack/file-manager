import os from "os";
import { getHomeDir, showInvalidInp } from "../helpers.js";

export const osCommandsHandler = (args) => {
  if (!args.length || args.length > 1) {
    showInvalidInp();
    return;
  }

  const command = args[0];

  const parsedValue = command.replace("--", "");

  const getValue = () => {
    if (parsedValue === "EOL") {
      return JSON.stringify(os.EOL);
    } else if (parsedValue === "cpus") {
      return os.cpus();
    } else if (parsedValue === "homedir") {
      return getHomeDir();
    } else if (parsedValue === "username") {
      return os.userInfo().username;
    } else if (parsedValue === "architecture") {
      return os.arch();
    }
  };

  console.log(getValue());
};
