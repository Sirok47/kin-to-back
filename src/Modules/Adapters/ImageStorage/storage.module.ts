import { Module } from '@nestjs/common';
import { SupabaseStorage } from './Supabase/supabase.adapter';
import { IMAGE_STORAGE } from './image-storage.interface';

@Module({
  providers: [
    {
      provide: IMAGE_STORAGE,
      useClass: SupabaseStorage,
    },
  ],
  exports: [IMAGE_STORAGE],
})
export class StorageModule {}
