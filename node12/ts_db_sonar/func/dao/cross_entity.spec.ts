import { Connection } from 'typeorm';

import {
  AlbumDao,
  AuthorDao,
  PhotoDao,
  PhotoInfoDao,
} from '../../src/dao/clients';
import { getDbConnection, safeClose } from '../../src/dao/utils';
import { Photo } from '../../src/entity/Photo';
import { PhotoInfo } from '../../src/entity/PhotoInfo';
import { Author } from '../../src/entity/Author';
import { Album } from '../../src/entity/Album';

describe('Cross-Table tests for photos, photo infos, authors and albums', () => {
  const makePhoto = (name: string, pub: boolean): Photo => {
    const result = new Photo();
    result.name = name;
    result.isPublished = pub;
    return result;
  };
  const momPhoto = makePhoto('mom skating', true);
  const dadPhoto = makePhoto('dad surfing', true);
  const bossPhoto = makePhoto('boss on the phone', false);

  const makePhotoInfo = (
    comment: string,
    height: number,
    width: number
  ): PhotoInfo => {
    const result = new PhotoInfo();
    result.comment = comment;
    result.height = height;
    result.width = width;
    return result;
  };
  const momInfo = makePhotoInfo('new skakes', 1, 2);
  const dadInfo = makePhotoInfo('old board', 3, 4);
  const bossInfo = makePhotoInfo('flip phone', 5, 6);

  const makeAuthor = (name: string): Author => {
    const result = new Author();
    result.name = name;
    return result;
  };
  const sister = makeAuthor('my sister');
  const me = makeAuthor('me');

  const makeAlbum = (name: string): Album => {
    const result = new Album();
    result.name = name;
    return result;
  };
  const familyAlbum = makeAlbum('family');
  const workAlbum = makeAlbum('work');

  const cleanSlate = async (conn: Connection | null) => {
    if (conn) {
      const photos: PhotoDao = new PhotoDao(conn);
      const photoInfos: PhotoInfoDao = new PhotoInfoDao(conn);
      const authors: AuthorDao = new AuthorDao(conn);
      const albums: AlbumDao = new AlbumDao(conn);

      // remove all the photos
      await photos.removeAll();
      await photoInfos.removeAll();
      await authors.removeAll();
      await albums.removeAll();

      // make sure they're gone
      expect((await photos.findAll()).length).toEqual(0);
      expect((await photoInfos.findAll()).length).toEqual(0);
      expect((await authors.findAll()).length).toEqual(0);
      expect((await albums.findAll()).length).toEqual(0);
    }
  };

  /**
   * Returns the albums that we save, which contain the photos,
   * the infos, and the authors.
   */
  const putUp = async (conn: Connection | null): Promise<Album[]> => {
    if (conn) {
      // create the Data Access Objects
      const photos: PhotoDao = new PhotoDao(conn);
      const photoInfos: PhotoInfoDao = new PhotoInfoDao(conn);
      const authors: AuthorDao = new AuthorDao(conn);
      const albums: AlbumDao = new AlbumDao(conn);

      // add the photos to the database
      const actualMomPhoto: Photo = await photos.upsert(momPhoto);
      const actualDadPhoto: Photo = await photos.upsert(dadPhoto);
      const actualBossPhoto: Photo = await photos.upsert(bossPhoto);

      // add the photos to the database
      const actualMomInfo: PhotoInfo = await photoInfos.upsert(momInfo);
      const actualDadInfo: PhotoInfo = await photoInfos.upsert(dadInfo);
      const actualBossInfo: PhotoInfo = await photoInfos.upsert(bossInfo);

      // add the infos to the photos
      actualMomPhoto.info = actualMomInfo;
      actualDadPhoto.info = actualDadInfo;
      actualBossPhoto.info = actualBossInfo;

      // add photo owners to the database
      const actualSister: Author = await authors.upsert(sister);
      const actualMe: Author = await authors.upsert(me);

      // assign the authors to the photos
      actualMomPhoto.author = actualSister;
      actualDadPhoto.author = actualSister;
      actualBossPhoto.author = actualMe;

      // save the photos.
      // we do not get this for free when we save albums later.
      await photos.upsert(actualMomPhoto);
      await photos.upsert(actualDadPhoto);
      await photos.upsert(actualBossPhoto);

      // add the albums to the database
      const actualFamilyAlbum: Album = await albums.upsert(familyAlbum);
      const actualWorkAlbum: Album = await albums.upsert(workAlbum);

      // put the photos in the albums
      actualFamilyAlbum.photos = [actualMomPhoto, actualDadPhoto];
      actualWorkAlbum.photos = [actualBossPhoto];

      // If the data depencies are correct, saving an album should
      // also update the data depencies in photos, infos and authors.
      await albums.upsert(actualFamilyAlbum);
      await albums.upsert(actualWorkAlbum);

      return [actualFamilyAlbum, actualWorkAlbum];
    }
    return [];
  };

  describe('Remove all', () => {
    it('should remove all photos', async () => {
      let conn: Connection | null = null;
      try {
        conn = await getDbConnection();
        await cleanSlate(conn);
      } finally {
        await safeClose(conn);
      }
    });
  });

  describe('Put up the canned entries and verify them', () => {
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

    const assertInfoEqual = (actual: PhotoInfo, expected: PhotoInfo) => {
      expect(actual.comment).toEqual(expected.comment);
      expect(actual.height).toEqual(expected.height);
      expect(actual.width).toEqual(expected.width);
    };

    const assertAuthorEqual = (actual: Author, expected: Author) => {
      expect(actual.name).toEqual(expected.name);
    };

    const assertAlbumEqual = (actual: Album, expected: Album) => {
      expect(actual.name).toEqual(expected.name);
    };

    const expectAlbums = async (
      albums: AlbumDao,
      expectFamily: Album,
      expectWork: Album
    ) => {
      const family: Album = (await albums.lookupFull(expectFamily.id))[0];
      assertAlbumEqual(family, expectFamily);
      expect(family.photos.length).toEqual(2);
      assertPhotosEqual(family.photos, expectFamily.photos);

      const work: Album = (await albums.lookupFull(expectWork.id))[0];
      assertAlbumEqual(work, expectWork);
      expect(work.photos.length).toEqual(1);
      assertPhotosEqual(work.photos, expectWork.photos);
    };

    const expectPhotos = async (
      photos: PhotoDao,
      expectFamily: Album,
      expectWork: Album
    ) => {
      const savedMomPhoto: Photo = expectFamily.photos[0];
      const savedDadPhoto: Photo = expectFamily.photos[1];
      const savedBossPhoto: Photo = expectWork.photos[0];

      const momPhoto: Photo = (await photos.lookupFull(savedMomPhoto.id))[0];
      assertPhotoEqual(momPhoto, savedMomPhoto);

      const dadPhoto: Photo = (await photos.lookupFull(savedDadPhoto.id))[0];
      assertPhotoEqual(dadPhoto, savedDadPhoto);

      const bossPhoto: Photo = (await photos.lookupFull(savedBossPhoto.id))[0];
      assertPhotoEqual(bossPhoto, savedBossPhoto);
    };

    const expectPhotoInfos = async (
      infos: PhotoInfoDao,
      expectFamily: Album,
      expectWork: Album
    ) => {
      const savedMomInfo: PhotoInfo = expectFamily.photos[0].info;
      const savedDadInfo: PhotoInfo = expectFamily.photos[1].info;
      const savedBossInfo: PhotoInfo = expectWork.photos[0].info;

      const momInfo: PhotoInfo = (await infos.lookupFull(savedMomInfo.id))[0];
      assertInfoEqual(momInfo, savedMomInfo);

      const dadPhoto: PhotoInfo = (await infos.lookupFull(savedDadInfo.id))[0];
      assertInfoEqual(dadPhoto, savedDadInfo);

      const bossPhoto: PhotoInfo = (await infos.lookupFull(
        savedBossInfo.id
      ))[0];
      assertInfoEqual(bossPhoto, savedBossInfo);
    };

    const expectAuthors = async (
      authors: AuthorDao,
      expectFamily: Album,
      expectWork: Album
    ) => {
      const savedSister: Author = expectFamily.photos[0].author;
      const sister: Author = (await authors.lookupFull(savedSister.id))[0];
      assertAuthorEqual(sister, savedSister);

      const savedMe: Author = expectWork.photos[0].author;
      const me: Author = (await authors.lookupFull(savedMe.id))[0];
      assertAuthorEqual(me, savedMe);
    };

    it('should add the data and select them back', async () => {
      let conn: Connection | null = null;
      try {
        conn = await getDbConnection();
        if (conn) {
          // create the Data Access Objects
          const photos: PhotoDao = new PhotoDao(conn);
          const infos: PhotoInfoDao = new PhotoInfoDao(conn);
          const authors: AuthorDao = new AuthorDao(conn);
          const albums: AlbumDao = new AlbumDao(conn);

          const albumsPutUp: Album[] = await putUp(conn);
          expect(albumsPutUp.length).toEqual(2);

          const savedFamilyAlbum: Album = albumsPutUp[0];
          const savedWorkAlbum: Album = albumsPutUp[1];

          expectAlbums(albums, savedFamilyAlbum, savedWorkAlbum);
          expectPhotos(photos, savedFamilyAlbum, savedWorkAlbum);
          expectPhotoInfos(infos, savedFamilyAlbum, savedWorkAlbum);
          expectAuthors(authors, savedFamilyAlbum, savedWorkAlbum);
        }
      } finally {
        await safeClose(conn);
      }
    });
  });

  describe('Remove All (again)', () => {
    it('should remove all photos', async () => {
      let conn: Connection | null = null;
      try {
        conn = await getDbConnection();
        await cleanSlate(conn);
      } finally {
        await safeClose(conn);
      }
    });
  });
});
