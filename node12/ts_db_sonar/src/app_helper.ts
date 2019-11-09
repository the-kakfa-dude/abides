import 'reflect-metadata';

import { Connection } from 'typeorm';
import { Photo } from './entity/Photo';
import { PhotoDao } from './dao/clients';
import { getDbConnection, safeClose } from './dao/utils';

export const appRunner = async () => {
  let conn: Connection | null = null;
  try {
    conn = await getDbConnection();
    if (conn) {
      // get a access to the photo database table
      const photoDao: PhotoDao = new PhotoDao(conn);

      // create a photo
      const photo = new Photo();
      photo.name = 'the real photo';
      photo.isPublished = true;

      // remove the photos, add one back, see what we find.
      await photoDao.removeAll();
      await photoDao.upsert(photo);
      const photos: Photo[] = await photoDao.findAll();

      // report what we found
      console.log(JSON.stringify(photos));
    }
  } catch (error) {
    console.error('Problem running application', error);
    return -1;
  } finally {
    safeClose(conn);
  }
  return 0;
};
