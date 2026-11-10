import { Platform } from 'react-native';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Directory, File, Paths } from 'expo-file-system';
import type { CapturedPhoto } from '@/domain/models';
export const captureId = () => `capture-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
export async function preparePhoto(photo: CapturedPhoto): Promise<CapturedPhoto> {
  const context = ImageManipulator.manipulate(photo.uri);
  const side = Math.min(photo.width, photo.height);
  context.crop({
    originX: Math.floor((photo.width - side) / 2),
    originY: Math.floor((photo.height - side) / 2),
    width: side,
    height: side,
  });
  if (side > 1080) context.resize({ width: 1080, height: 1080 });
  const image = await context.renderAsync();
  const result = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.75 });
  let uri = result.uri;
  if (Platform.OS !== 'web') {
    const directory = new Directory(Paths.document, 'captures');
    directory.create({ idempotent: true, intermediates: true });
    const destination = new File(directory, `${captureId()}.jpg`);
    new File(uri).copy(destination);
    uri = destination.uri;
  }
  return { uri, width: result.width, height: result.height };
}
