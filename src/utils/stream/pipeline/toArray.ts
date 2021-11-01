/**
 * @example
 * import util from 'util';
 * import stream from 'stream';
 * import csvParse from 'csv-parse';
 *
 * const pipelineAsync = util.promisify(stream.pipeline);
 *
 * const rows = await pipelineAsync(
 *   fs.createReadStream('file.csv'),
 *   csvParse({ ... }),
 *   toArray(),
 * );
 */
export default function toArray() {
  return async (source: AsyncIterable<unknown>) => {
    const items: unknown[] = [];

    // NOTE: there is not other way to iterate through
    // eslint-disable-next-line no-restricted-syntax
    for await (const item of source) {
      items.push(item);
    }

    return items;
  };
}
