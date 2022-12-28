import fs from 'fs';
import path from 'path';

export const pathExists = async (p: string): Promise<boolean> => !!await fs.promises.stat(p).catch(() => false);

export const readDir = async (dirPath: string): Promise<string[]> => {
    const dirents = await fs.promises.readdir(dirPath, { withFileTypes: true });
    const files   = await Promise.all(dirents.map((dirent) => {
        const res = path.join(dirPath, dirent.name);

        return dirent.isDirectory() ? readDir(res) : res;
    }));

    return files.flat();
};
