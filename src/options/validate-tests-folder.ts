import path from 'path';
import * as fs from 'fs';

export default function ensureTestsFolderValid (testsFolder: string, root: string): void {
    if (!testsFolder)
        throw new Error(`Invalid tests folder path: "${ testsFolder }"`);

    const testsFolderPath = path.join(root, testsFolder);

    if (!fs.existsSync(testsFolderPath))
        return;

    if (!fs.statSync(testsFolderPath).isDirectory())
        throw new Error(`The specified tests path is not a folder: ${ testsFolderPath }`);

    if (fs.readdirSync(testsFolderPath).length !== 0)
        throw new Error(`Folder with name tests contains files inside`);
}
