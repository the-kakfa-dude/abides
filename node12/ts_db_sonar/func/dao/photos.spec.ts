import { Connection, DeleteResult } from 'typeorm';

import { Photo } from '../../src/entity/Photo';
import { PhotoDao } from '../../src/dao/clients';
import { getDbConnection, safeClose } from '../../src/dao/utils';

describe('CRUD tests for the Photo table', () => {
  const testPhoto1 = new Photo();
  testPhoto1.name = 'crud test photo 1';
  testPhoto1.isPublished = true;

  const testPhoto2 = new Photo();
  testPhoto2.name = 'crud test photo 2';
  testPhoto2.isPublished = true;

  const testPhoto3 = new Photo();
  testPhoto3.name = 'crud test photo 3';
  testPhoto3.isPublished = false;

  const assertPhotoEqual = (actual: Photo, expected: Photo) => {
    expect(actual.name).toEqual(expected.name);
    expect(actual.isPublished).toEqual(expected.isPublished);
  };

  const assertPhotosEqual = (actual: Photo[], expected: Photo[]) => {
    expect(actual.length).toEqual(expected.length);
    for (let i = 0; i < actual.length; i++) {
      assertPhotoEqual(actual[i], expected[i]);
    }
  };

  const cleanSlate = async () => {
    let conn: Connection | null = null;
    try {
      conn = await getDbConnection();
      if (conn) {
        const photos: PhotoDao = new PhotoDao(conn);

        // remove all the photos
        const result: DeleteResult = await photos.removeAll();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();

        // make sure they're gone
        const results: Photo[] = await photos.findAll();
        expect(results.length).toEqual(0);
      }
    } finally {
      await safeClose(conn);
    }
  };

  describe('Remove all', () => {
    it('should remove all photos', async () => {
      await cleanSlate();
    });
  });

  describe('Insert and Select - photo 1', () => {
    it('should create photo 1, and then find it', async () => {
      let conn: Connection | null = null;
      try {
        conn = await getDbConnection();
        if (conn) {
          const photos: PhotoDao = new PhotoDao(conn);

          // add photo 1
          const actualUpsert: Photo = await photos.upsert(testPhoto1);
          assertPhotoEqual(actualUpsert, testPhoto1);

          // find photo 1, which should be the only one there,
          // since we run the functional tests in sequence
          // and not in parallel.
          const actualSelect: Photo[] = await photos.findOne();
          assertPhotosEqual(actualSelect, [testPhoto1]);
        }
      } finally {
        await safeClose(conn);
      }
    });
  });

  describe('Insert and Select - photo 2', () => {
    it('should create photo 2, and then find it', async () => {
      // If the database freaks out when we try to connect to it,
      // our helper method will return null. By telling the type
      // system that now, it saves us from a lot of "hey, that might
      // be null" complaints further on down the line.
      let conn: Connection | null = null;
      try {
        conn = await getDbConnection();
        if (conn) {
          const photos: PhotoDao = new PhotoDao(conn);

          const actualUpsert: Photo = await photos.upsert(testPhoto2);
          assertPhotoEqual(actualUpsert, testPhoto2);

          const actualSelect: Photo[] = await photos.lookup(actualUpsert.id);
          assertPhotosEqual(actualSelect, [testPhoto2]);
        }
      } finally {
        await safeClose(conn);
      }
    });
  });

  describe('Multi Select', () => {
    it('should find both photos', async () => {
      let conn: Connection | null = null;
      try {
        conn = await getDbConnection();
        if (conn) {
          const photos: PhotoDao = new PhotoDao(conn);

          const actual: Photo[] = await photos.findAll();
          expect(actual.length).toEqual(2);
          expect(actual[0].name).not.toEqual(actual[1].name);
          expect(
            actual[0].name === testPhoto1.name ||
              actual[0].name === testPhoto2.name
          ).toBeTruthy();
          expect(
            actual[1].name === testPhoto1.name ||
              actual[1].name === testPhoto2.name
          ).toBeTruthy();
          expect(
            actual[0].isPublished === testPhoto1.isPublished ||
              actual[0].isPublished === testPhoto2.isPublished
          ).toBeTruthy();
          expect(
            actual[1].isPublished === testPhoto1.isPublished ||
              actual[1].isPublished === testPhoto2.isPublished
          ).toBeTruthy();
        }
      } finally {
        await safeClose(conn);
      }
    });
  });

  describe('Remove one', () => {
    it('should remove one of the photos', async () => {
      let conn: Connection | null = null;
      try {
        conn = await getDbConnection();
        if (conn) {
          const photos: PhotoDao = new PhotoDao(conn);

          const removeMe: Photo[] = await photos.findOne();
          expect(removeMe.length).toEqual(1);

          const result: DeleteResult = await photos.remove(removeMe[0].id);
          expect(result.affected).toEqual(1);

          const whatsLeft: Photo[] = await photos.findAll();
          expect(whatsLeft.length).toEqual(1);
        }
      } finally {
        await safeClose(conn);
      }
    });
  });

  describe('Update', () => {
    it('should update a photo', async () => {
      let conn: Connection | null = null;
      try {
        conn = await getDbConnection();
        if (conn) {
          const photos: PhotoDao = new PhotoDao(conn);

          const updateMe: Photo[] = await photos.findAll();
          expect(updateMe.length).toEqual(1);

          const photo: Photo = updateMe[0];
          photo.name = testPhoto3.name;
          photo.isPublished = testPhoto3.isPublished;

          const actual = await photos.upsert(photo);
          expect(actual).toEqual(photo);

          const selected: Photo[] = await photos.findAll();
          expect(selected.length).toEqual(1);

          const changed: Photo = selected[0];
          assertPhotoEqual(changed, testPhoto3);
        }
      } finally {
        await safeClose(conn);
      }
    });
  });

  describe('Remove All (again)', () => {
    it('should clean up on the way out', async () => {
      await cleanSlate();
    });
  });
});
