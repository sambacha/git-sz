# reproducible-tar

[![npm package reproducible-tar](https://img.shields.io/npm/v/reproducible-tar?style=flat-square)](http://npm.im/reproducible-tar)
[![GitHub package.json dependency version (dev dep on branch)](https://img.shields.io/github/package-json/dependency-version/EqualMa/reproducible-tar/dev/typescript?style=flat-square)]()
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

a Node.js library to extract, transform and re-pack tarball entries in form of stream

## Install

```shell
npm install reproducible-tar
yarn add reproducible-tar
```

## Usage

### :telescope: extract (gzipped) tarball as a stream of tar entries

[![Try reproducible-tar extract in RunKit](https://img.shields.io/badge/%F0%9F%94%AD%20try%20in-RunKit-f55fa6.svg?labelColor=green&style=for-the-badge)](https://runkit.com/equalma/reproducible-tar-extract)

```js
const tt = require("reproducible-tar");
const fetch = require("node-fetch");

const extractStream = tt.extract({
  // boolean | "auto". default is "auto".
  // indicates whether a gzipped tarball file stream is written to this stream
  gzip: true,
});

const resp = await fetch(
  "https://codeload.github.com/EqualMa/reproducible-tar/tar.gz/master",
);
resp.body.pipe(extractStream);

const entries = [];

// `for await ... of ...` is an easy way to consume a stream
// this syntax is available on Node.js >= 10
for await (const entry of extractStream) {
  entries.push(entry.headers);
  // NOTE: remember to resume the current entry stream to continue
  entry.stream.resume();
}

console.log(entries);
```

### :package: Pack a stream of entries into a (gzipped) tarball

[![Try reproducible-tar pack in RunKit](https://img.shields.io/badge/%F0%9F%93%A6%20try%20in-RunKit-f55fa6.svg?labelColor=green&style=for-the-badge)](https://runkit.com/equalma/reproducible-tar-pack)

```js
const tt = require("reproducible-tar");
const fetch = require("node-fetch");
const { Readable } = require("stream");
const fs = require("fs");

const packStream = tt.pack({
  // boolean | zlib.ZlibOptions
  // indicates whether to gzip the tarball
  gzip: true,
});

const imageResp = await fetch("https://github.com/EqualMa.png");
const imageSize = parseInt(imageResp.headers.get("Content-Length"));

Readable.from([
  { headers: { name: "README.md" }, content: "# reproducible-tar" },
  { headers: { name: "hello/world.txt" }, content: "Hello World!" },
  { headers: { name: "emptyDir", type: "directory" } },
  {
    headers: { name: "author-avatar.png" },
    stream: imageResp.body,
  },
])
  .pipe(packStream)
  .pipe(fs.createWriteStream("reproducible-tar-pack-demo.tgz"));
```

### :scissors: transform, remove entries from, or add entries into a (gzipped) tarball

[![Try reproducible-tar transform in RunKit](https://img.shields.io/badge/%E2%9C%82%EF%B8%8Ftry%20in-RunKit-f55fa6.svg?labelColor=green&style=for-the-badge)](https://runkit.com/equalma/reproducible-tar)

#### Transform as is ( no-op )

```js
const tt = require("reproducible-tar");

const tgzStream = (
  await fetch(
    "https://runkit.io/equalma/reproducible-tar-pack/branches/master/tgz",
  )
).body;

// extract a stream of tar entries from a tarball
const extractStream = tt.extract();

// transform
const transformStream = tt.transform({
  onEntry(entry) {
    this.push(entry);
  },
});

// repack to tgz
const packStream = tt.pack({ gzip: true });

tgzStream
  .pipe(extractStream)
  .pipe(transformStream)
  .pipe(packStream)
  .pipe(require("fs").createWriteStream("reproducible-tar-demo.tgz"))
  .on("error", console.error);
```

#### Transform path for each entry

The following example prefixes the path of each entry with `my-root/`

```js
const transformStream = tt.transform({
  onEntry(entry) {
    const headers = this.util.headersWithNewName(
      entry.headers,
      "my-root/" + entry.headers.name,
    );

    this.push({ ...entry, headers });
  },
});
```

#### edit file content

The following example prefixes content of `*.txt` files with `HACKED BY reproducible-tar`

```js
const transformStream = tt.transform({
  async onEntry(entry) {
    if (entry.headers.name.endsWith(".txt")) {
      const oldContent = await this.util.stringContentOfTarEntry(entry);
      const newContent = "HACKED BY reproducible-tar\n" + oldContent;
      this.push({
        headers: entry.headers,
        content: newContent,
      });
    } else {
      this.push(entry);
    }
  },
});
```

#### remove files from tarball

The following example removes all `*.png` files

```js
const transformStream = tt.transform({
  onEntry(entry) {
    if (entry.headers.name.endsWith(".png")) {
      this.pass(entry);
    } else {
      this.push(entry);
    }
  },
});
```

#### add files to tarball

The following example adds a file named `file-structure.txt` containing the directory structure

```js
const transformStream = tt.transform({
  initCtx: [],
  onEntry(entry) {
    this.ctx.push([entry.headers.name, entry.headers.type]);
    this.push(entry);
  },
  onEnd() {
    this.push({
      headers: { name: "file-structure.txt" },
      content: this.ctx.map(([name, type]) => `[${type}]\t${name}`).join("\n"),
    });
  },
});
```
