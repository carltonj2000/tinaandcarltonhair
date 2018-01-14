#!/usr/bin/env node

// image optimizations from
// https://developers.google.com/speed/docs/insights/OptimizeImages

const path = require("path");
const { exec } = require("child_process");
const { images, srcs, dsts } = require("./images");

const lnDst = dsts[0].name;

images.forEach(fileInfo => {
  const file = fileInfo.name;
  const srcNoOpt = srcs.find(src => src.tag === fileInfo.srctag).name;
  const optDst = path.join(srcNoOpt, "optimized");
  console.log(file);
  const fin = path.join(srcNoOpt, file);
  const fopt = path.join(optDst, file);
  const fln = path.join(lnDst, file);
  let cmd1 = file.toLowerCase().includes("png")
    ? `convert ${fin} -strip -resize 1600x1200 -alpha Remove ${fopt}`
    : `convert ${fin} -sampling-factor 4:2:0 -strip -resize 1600x1200 -quality 85 -interlace JPEG -colorspace sRGB ${fopt}`;
  const cmd2 = `ln -s ${fopt} ${fln}`;
  // run cmd1 to optimize images, then cmd2 to link them, or chain them in array
  [cmd1].forEach(cmd => {
    console.log(cmd);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      stdout && console.log(`stdout: ${stdout}`);
      stderr && console.log(`stderr: ${stderr}`);
    });
  });
});
