import { chdir } from "process";
import os from "os";

export const showInvalidInp = () => console.log("Invalid input");

export const showCurrentPath = (path) =>
  console.log(`You are currently in ${path}`);

export const getHomeDir = () => os.homedir();

export const changeDir = (path) => chdir(path);
