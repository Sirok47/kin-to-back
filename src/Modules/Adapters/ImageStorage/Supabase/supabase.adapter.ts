import { ImageStorage } from '../image-storage.interface';
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../../../../Settings/config';

@Injectable()
export class SupabaseStorage implements ImageStorage {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient<any, 'public', 'public'>(
      config.SUPABASE_URL,
      config.SUPABASE_KEY,
    );
  }

  async upload(path: string, image: Buffer): Promise<string> {
    const { error } = await this.supabase.storage
      .from(config.SUPABASE_BUCKET)
      .upload(path, image, {
        contentType: 'image/png',
      });

    if (error) {
      console.error(error);
      throw Error('Error during upload');
    }

    return path;
  }

  async delete(path: string): Promise<boolean> {
    const { error } = await this.supabase.storage
      .from(config.SUPABASE_BUCKET)
      .remove([path]);

    return !error;
  }

  async deleteAll(): Promise<boolean> {
    const { data, error: listError } = await this.supabase.storage
      .from(config.SUPABASE_BUCKET)
      .list('', {
        limit: 1000,
      });
    if (listError) {
      console.error(listError);
      return false;
    }
    if (!data || data.length === 0) return true;

    const paths = data.map((item) => item.name);
    const { error: removeError } = await this.supabase.storage
      .from(config.SUPABASE_BUCKET)
      .remove(paths);

    if (removeError) {
      console.error(removeError);
      return false;
    }
    return true;
  }

  getLink(path: string): string {
    return this.supabase.storage.from(config.SUPABASE_BUCKET).getPublicUrl(path)
      .data.publicUrl;
  }
}
