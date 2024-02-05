import { showInvalidInp } from "../helpers.js";
import path from "path";
import { cwd } from "process";
import { createReadStream, createWriteStream } from "fs";
import { stat, readdir, unlink } from "fs/promises";
import { createHash } from "crypto";
import { pipeline } from "stream";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
export const ls = async () => {
  const prepareTableRow = async (item) => {
    const filePath = path.resolve(cwd(), item);
    const stats = await stat(filePath);
    const Type = stats.isFile() ? "file" : "directory";

    return { Name: item, Type };
  };

  const dirFiles = (await readdir(cwd())).map((item) => prepareTableRow(item));
  const tableData = await Promise.all(dirFiles);
  const directories = tableData
    .filter(({ Type }) => Type === "directory")
    .sort((a, b) => a.Name.localeCompare(b.Name));
  const files = tableData
    .filter(({ Type }) => Type === "file")
    .sort((a, b) => a.Name.localeCompare(b.Name));

  console.table([...directories, ...files]);
};

export const up = () => {};

export const cat = async (destination) => {
  const readStream = createReadStream(destination, { encoding: "utf-8" });

  await new Promise((res, rej) => {
    readStream
      .on("data", (chunk) => {
        console.log(chunk.toString());
        res();
      })
      .on("error", () => {
        rej();
      });
  });
};
export const cp = async (source, destination) => {
  const fileName = path.basename(source);

  const stats = await Promise.all([
    await stat(source),
    await stat(destination),
  ]);

  if (stats[0].isFile() && stats[1].isDirectory()) {
    const readStream = createReadStream(source);
    const writePath = path.join(destination, fileName);
    const writeStream = createWriteStream(writePath);

    await new Promise((res, rej) => {
      readStream
        .on("data", (chunk) => {
          writeStream.write(chunk);
          res();
        })
        .on("error", () => {
          rej();
        });
      writeStream.on("error", () => {
        rej();
      });
    });
  } else {
    showInvalidInp();
  }
};

export const hash = async (source) => {
  const readStream = createReadStream(sourcePath);

  const getHash = (data) => createHash("sha256").update(data).digest("hex");

  await new Promise((res, rej) => {
    readStream
      .on("data", (data) => {
        const hash = getHash(data);
        console.log(hash);
        res();
      })
      .on("error", () => {
        rej();
      });
  });
};

export const compressHandler = async (source, destination, isUnzip) => {
  const readStream = createReadStream(source);
  const writeStream = createWriteStream(destination);
  const gzip = isUnzip ? createBrotliDecompress() : createBrotliCompress();

  pipeline(readStream, gzip, writeStream, (err) => {
    if (!err) {
      unlink(source);
    }
  });
};
