import 'reflect-metadata';

import { Connection, Repository, DeepPartial, DeleteResult } from 'typeorm';

import { Album } from '../entity/Album';
import { Author } from '../entity/Author';
import { Photo } from '../entity/Photo';
import { PhotoInfo } from '../entity/PhotoInfo';

/**
 * This is a base clase for a Data Access Object to a typeorm Entity.
 *
 * It provides basic Create, Read, Update, Delete operations.
 *
 * The idea is that if you don't need to load any data from any of
 * the other tables it can join to, you use this Base class directly.
 *
 * You can do that like this:
 *
 *   const photoDao: Dao<Photo> = new Dao<Photo>(conn, 'photos');
 *
 * If you need more interesting access, you can create a class like this,
 * and add some more interesting methods to it:
 *
 *   public class PhotoDao extends Dao<Photo> {
 *
 *     public constructor(conn: Connection, tableName: string) {
 *       super(conn, tableName);
 *     }
 *   }
 *
 * Those kinds of classes are also below, one for each Entity.
 */
export class Dao<T> {
  /**
   * The database connection to use in this dao.
   *
   * We assume someone else is managing the
   * opening and closing of that connection.
   */
  protected readonly connection: Connection;

  /**
   * The name of the table.
   *
   * Used to get the proper table for T.
   */
  protected readonly table: string;

  constructor(conn: Connection, tableName: string) {
    this.connection = conn;
    this.table = tableName;
  }

  /**
   * Pulls an entity out of the database, referencing it by
   * its `id`. Presumably, `id` is a primary serial key.
   *
   * @param id The id of the T you want looked up.
   */
  async lookup(id: number): Promise<T[]> {
    const repo: Repository<T> = this.connection.getRepository(this.table);
    const result: T[] = await repo
      .createQueryBuilder(this.table)
      .where(`${this.table}.id = :id`, { id })
      .getMany();
    return result || [];
  }

  /**
   * Pulls an arbitrary T out of its table.
   */
  async findOne(): Promise<T[]> {
    const repo: Repository<T> = this.connection.getRepository(this.table);
    const result: T | undefined = await repo.findOne();
    return result ? [result] : [];
  }

  /**
   * Pulls all of the T entities out of its table.
   */
  async findAll(): Promise<T[]> {
    const repo: Repository<T> = this.connection.getRepository(this.table);
    const result: T[] = await repo.find();
    return result || [];
  }

  /**
   * Inserts a T into its table. If such a T is already there, it updates it.
   *
   * @param t The T you want to update im the db, or add.
   */
  async upsert(t: DeepPartial<T>): Promise<T> {
    const repo: Repository<T> = this.connection.getRepository(this.table);
    const result: T = await repo.save(t);
    return result;
  }

  /**
   * Removes an entity out of the database, referencing it by
   * its `id`. Presumably, `id` is a primary serial key.
   *
   * @param id The id of the T you want deleted.
   */
  async remove(id: number): Promise<DeleteResult> {
    return this.connection
      .createQueryBuilder()
      .delete()
      .from(this.table)
      .where(`${this.table}.id = :id`, { id })
      .execute();
  }

  /**
   * Removes all of the T entitites from its table.
   */
  async removeAll(): Promise<DeleteResult> {
    return this.connection
      .createQueryBuilder()
      .delete()
      .from(this.table)
      .execute();
  }
}

/**
 * Data Access Object for Albums.
 */
export class AlbumDao extends Dao<Album> {
  /**
   * Creates the Data Access Object by passing the super-class
   * the presented connection, and the name of the album info table.
   *
   * @param conn The database connection you want to use with this dao.
   */
  constructor(conn: Connection) {
    super(conn, 'album');
  }

  /**
   * Look up by ID for a album.
   *
   * Full means that we join to the tables referenced by this Entity,
   * those tables being:
   *  - photo
   *
   * @param id The id of the album you want to load.
   */
  async lookupFull(id: number): Promise<Album[]> {
    const repo: Repository<Album> = this.connection.getRepository(Album);
    const result: Album[] = await repo
      .createQueryBuilder('album')
      .innerJoinAndSelect('album.photos', 'photo')
      .where('album.id = :id', { id })
      .orderBy({
        'photo.id': 'ASC',
        'album.id': 'ASC',
      })
      .getMany();
    return result || [];
  }
}

/**
 * Data Access Object for Authors.
 */
export class AuthorDao extends Dao<Author> {
  /**
   * Creates the Data Access Object by passing the super-class
   * the presented connection, and the name of the author table.
   *
   * @param conn The database connection you want to use with this dao.
   */
  constructor(conn: Connection) {
    super(conn, 'author');
  }

  /**
   * Look up by ID for a author.
   *
   * Full means that we join to the tables referenced by this Entity,
   * those tables being:
   *  - photo
   *
   * @param id The id of the author you want to load.
   */
  async lookupFull(id: number): Promise<Author[]> {
    const repo: Repository<Author> = this.connection.getRepository(Author);
    const result: Author[] = await repo
      .createQueryBuilder('author')
      .innerJoinAndSelect('author.photos', 'photo')
      .where(`author.id = :id`, { id })
      .orderBy({
        'photo.id': 'ASC',
        'author.id': 'ASC',
      })
      .getMany();
    return result || [];
  }
}

/**
 * Data Access Object for photos.
 */
export class PhotoDao extends Dao<Photo> {
  /**
   * Creates the Data Access Object by passing the super-class
   * the presented connection, and the name of the photo table.
   *
   * @param conn The database connection you want to use with this dao.
   */
  constructor(conn: Connection) {
    super(conn, 'photo');
  }

  /**
   * Look up by ID for a photo.
   *
   * Full means that we join to the tables referenced by this Entity,
   * those tables being:
   *  - album
   *  - author
   *  - photo_info
   *
   * @param id The id of the photo you want to load.
   */
  async lookupFull(id: number): Promise<Photo[]> {
    const repo: Repository<Photo> = this.connection.getRepository(Photo);
    const result: Photo[] = await repo
      .createQueryBuilder('photo')
      .innerJoinAndSelect('photo.info', 'photo_info')
      .innerJoinAndSelect('photo.albums', 'album')
      .innerJoinAndSelect('photo.author', 'author')
      .where(`photo.id = :id`, { id })
      .orderBy({
        'photo.id': 'ASC',
        'photo_info.id': 'ASC',
        'author.id': 'ASC',
        'album.id': 'ASC',
      })
      .getMany();
    return result || [];
  }
}

/**
 * Data Access Object for PhotoInfo.
 */
export class PhotoInfoDao extends Dao<PhotoInfo> {
  /**
   * Creates the Data Access Object by passing the super-class
   * the presented connection, and the name of the photo info table.
   *
   * @param conn The database connection you want to use with this dao.
   */
  constructor(conn: Connection) {
    super(conn, 'photo_info');
  }

  /**
   * Look up by ID for a photo info.
   *
   * Full means that we join to the tables referenced by this Entity,
   * those tables being:
   *  - photo
   *
   * @param id The id of the photo info you want to load.
   */
  async lookupFull(id: number): Promise<PhotoInfo[]> {
    const repo: Repository<PhotoInfo> = this.connection.getRepository(
      PhotoInfo
    );
    const result: PhotoInfo[] = await repo
      .createQueryBuilder('photo_info')
      .innerJoinAndSelect('photo_info.photo', 'photo')
      .where(`photo_info.id = :id`, { id })
      .orderBy({
        'photo.id': 'ASC',
        'photo_info.id': 'ASC',
      })
      .getMany();
    return result || [];
  }
}
