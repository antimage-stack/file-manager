import { cat, compressHandler, cp, hash, ls, up } from "./commands.js";
import path from "path";
import { cwd } from "process";
import { changeDir, getHomeDir, showInvalidInp } from "../helpers.js";
import { rename, unlink, writeFile } from "fs/promises";

export const cliCommandsHandler = async (command, args) => {
  const source = args[0] && path.resolve(cwd(), args[0]);
  const destination = args[1] && path.resolve(cwd(), args[1]);

  const isTwoArgsRequired = args.length === 2 && source && destination;
  const isOneArgRequired = args.length === 1 && source;

  if (command === "ls" && !args.length) {
    await ls();
  } else if (command === "up" && !args.length) {
    if (getHomeDir() === cwd()) {
      return;
    }
    await changeDir(path.resolve(cwd(), ".."));
  } else if (command === "cd" && isOneArgRequired) {
    await changeDir(source);
  } else if (command === ".exit" && !args.length) {
    await process.exit();
  } else if (command === "cat" && isOneArgRequired) {
    await cat(source);
  } else if (command === "add" && isOneArgRequired) {
    await writeFile(source, "");
  } else if (command === "rn" && isTwoArgsRequired) {
    const destinationPath = path.join(path.dirname(source), args[1]);
    await rename(source, destinationPath);
  } else if (command === "cp" && isTwoArgsRequired) {
    await cp(source, destination);
  } else if (command === "rm" && isOneArgRequired) {
    await unlink(source);
  } else if (command === "mv" && isTwoArgsRequired) {
    await cp(source, destination);
    await unlink(source);
  } else if (command === "hash" && isOneArgRequired) {
    await hash(source);
  } else if (command.includes("compress") && isTwoArgsRequired) {
    const isUnzip = command.includes("de");
    await compressHandler(source, destination, isUnzip);
  } else {
    showInvalidInp();
  }
};
