import { transform } from "reproducible-tar";

/**
 *
 * @param prepend should be "" or end with "/". For example: `"package/"`
 */
export const prependPath = (prepend = "") =>
  transform({
    onEntry(entry) {
      this.push({
        ...entry,
        headers: this.util.headersWithNewName(
          entry.headers,
          prepend + entry.headers.name,
        ),
      });
    },
  });
