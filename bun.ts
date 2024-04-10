import { $ } from "bun";

await $`seq 0 1`;
await $`basename $1`;
await $`dirname $1`;

await $`basename $1`;
