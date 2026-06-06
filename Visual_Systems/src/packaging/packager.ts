import * as fs from "fs";
import * as path from "path";
import archiver from "archiver";

export interface PackageRequest {
  dropName: string;

  sourceDirectory: string;

  outputDirectory: string;
}

export async function buildPackage(
  request: PackageRequest
) {

  const zipPath = path.join(
    request.outputDirectory,
    `${request.dropName}.zip`
  );

  const output = fs.createWriteStream(zipPath);

  const archive = archiver("zip", {
    zlib: { level: 9 }
  });

  archive.pipe(output);

  archive.directory(
    request.sourceDirectory,
    false
  );

  await archive.finalize();

  return zipPath;
}