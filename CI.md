getAllPkgDigest

get all local packages' digest info, return an array of IPkgDigest

```bash
export async function getAllPkgDigest (needPrivate = true, searchKwd = ''): IPkgDigest[]
```

```bash
export interface IPkgDigest {
  /** package name */
  name: string
  /** package version */
  version: string
  /** whether package is private */
  private: boolean
  /** package folder full path */
  location: string
}
```

getLatestPkgVersFromGit

get local packages' latest version info from git tag. This requires you publish monorepo's packages via lerna publish

```bash
export async function getLatestPkgVersFromGit (): IPkgVersions
```

```bash
export interface IPkgVersions {
  /** package name: package version no.(without `v`) */
  [k: string]: string
}
```


