import fs from 'fs';
import path from 'path';

export class JsonReader {
  static read<T>(filePath: string): T {
    try {
      const absolutePath = path.resolve(filePath);
      const fileContent = fs.readFileSync(absolutePath, 'utf-8');
      return JSON.parse(fileContent) as T;
    } catch (error) {
      throw new Error(`Failed to read JSON file: ${filePath}`);
    }
  }

  static readAsync<T>(filePath: string): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        const absolutePath = path.resolve(filePath);
        fs.readFile(absolutePath, 'utf-8', (err, data) => {
          if (err) {
            reject(new Error(`Failed to read JSON file: ${filePath}`));
            return;
          }
          resolve(JSON.parse(data) as T);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static write(filePath: string, data: any): void {
    try {
      const absolutePath = path.resolve(filePath);
      const dirPath = path.dirname(absolutePath);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Failed to write JSON file: ${filePath}`);
    }
  }
}
