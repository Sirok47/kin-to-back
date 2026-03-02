export interface ImageStorage {
  getLink(path: string): string;
  upload(name: string, image: Buffer): Promise<string>;
  delete(path: string): Promise<boolean>;
  deleteAll(): Promise<boolean>;
}

export const IMAGE_STORAGE = Symbol('ImageStorage');
