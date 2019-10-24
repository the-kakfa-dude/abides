package com.kakfa.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;


/**
 * This is a Singleton Utilities class for doing Database stuff.
 *
 * The pattern used here is the Singleton Holder pattern, which
 * ensures that only one instance of this class ever exists, and
 * that it is constructed lazily.
 *
 * By "lazily" we mean that the singleton object is created the
 * first time some other running code tries to access it.
 *
 * This kind of trick is great for things like your initialization
 * possibly crashing, which you don't want to do during jvm startup,
 * because you get zero debugging info when you crash the loader.
 *
 * However, you need to be careful with deferred initialization because
 * if the singleton's constructor runs for too long, you can get weird
 * timeout problems, often in seemingly unrelated parts of the code.
 * These often look like (or can cause) a stop-the-world garbage
 * collection pause, and have lead to many a wild goose chase.
 *
 * A fix for that situation is to have a startup initializer, that runs
 * through a dependency tree of your resources, and initializes each
 * in turn. You then make sure the resource being set up is not placed
 * into the resource pool, or otherwise announced as available, until
 * _after_ the startup initializer has completed successfully.
 *
 * @author damon.berry
 * @since  October 2019
 */
public class DBUtils {

    public static final int PORT = 5433;
    public static final String DRIVER_CLASS_NAME = "org.postgresql.Driver";
    public static final String DRIVER_PROTOCOL = "jdbc:postgresql";
    public static final String SERVER = "127.0.0.1";
    public static final String DATABASE = "java_db_sonar";
    public static final String POSTGRES_URL = DRIVER_PROTOCOL + "://" + SERVER + ":" + PORT + "/" + DATABASE;

    public static final String USER = "java_db_sonar_user";
    
    // tell sonar it's okay i'm calling this "password".
    //
    // comment this out this suppression if you want to see a build
    // fail the quality gate due to a security violation.
    //
    @SuppressWarnings("squid:S2068")
    public static final String PASSWORD = "java_db_sonar_pass";

    public static final String CREATE_BIKES_TABLE =
            "CREATE TABLE bikes ( "
          + "  id    SERIAL PRIMARY KEY,"
          + "  name  TEXT,"
          + "  bmx   BOOLEAN"
          + ")";

    public static final String DROP_BIKES_TABLE =
            "DROP TABLE bikes";

    public static final String INSERT_BIKE =
            "INSERT INTO bikes (name, bmx) VALUES (?,?)";

    public static final String SELECT_BIKES_BY_NAME =
            " SELECT id, name, bmx "
          + " FROM bikes b"
          + " WHERE b.name = ?"
          + " ORDER BY id";

    public static final String SELECT_BIKES_BY_BMX =
            " SELECT id, name, bmx "
          + " FROM bikes b"
          + " WHERE b.bmx = ?"
          + " ORDER BY id";

    public static final String UPDATE_BIKE_BMX_BY_NAME =
            " UPDATE bikes "
          + " SET bmx = ?"
          + " WHERE name = ?";

    protected static final Logger LOGGER = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

    /**
     * This constructor is invoked lazily, the first time someone calls
     * getInstance(), and creates the "singleton" in "Singleton Holder".
     */
    private DBUtils() {
        // do nothing
    }

    /**
     * This is the "holder" in the Singleton Holder pattern.
     *
     * The reason that this trick works is because the class loader
     * in the JVM defers the loading of member classes.
     *
     * When that holder class eventually is loaded, its members are
     * initialized, one of which is the DBUtils "INSTANCE".
     *
     * However, the holder class is only referenced from the
     * getInstance() method, which means the deferred class loading
     * only ends when some other running code calls DBUtils.getInstance().
     */
    private static class SingletonHolder {
        private SingletonHolder() {
            // do nothing
        }

        protected static final DBUtils INSTANCE = new DBUtils();
    }

    public static DBUtils getInstance() {

        return SingletonHolder.INSTANCE;
    }


    /**
     * Access to a database connection.
     *
     * Don't forget to close() it when you're done.
     *
     * @return A {@link java.sqlConnection} instance, or null if something goes wrong.
     */
    // tell sonar it's okay that we're using a hard-coded password.
    //
    // comment this out this suppression if you want to see a build
    // fail the quality gate due to a security violation.
    //
    @SuppressWarnings("squid:S2068")
    public Connection getConnection() {

        try {
            return DriverManager.getConnection(POSTGRES_URL, USER, PASSWORD);
        }
        catch (SQLException sqle) {
            LOGGER.log(Level.SEVERE, "Problem establishing database connection, URL: " + POSTGRES_URL, sqle);
            return null;
        }
    }

    /**
     * Closes a database connection.
     *
     * Doesn't complain.
     *
     * The utility of safeX() methods is that you can fire them, and forget,
     * without having to worry about parsing return values, or catching exceptions,
     * or trying to clean up resource allocation/deallocation failures.
     *
     * Sometimes you need to actually do those things, but even then, when you've
     * exhausted all the attempts you're willing to make, and you still keep failing,
     * you're going to want to "just be done" with something.
     *
     * In those cases, a safeX() method is your friend.
     *
     * @param conn A {@link java.sql.Connection} object.
     *
     * @returns false If the connection is already closed, if closing it throws,
     *                or if checking if it's closed throws.
     *                We return true when passed null.
     */
    public boolean safeClose(Connection conn) {

        if (conn == null) {
            return true; // there are arguments on both sides
        }

        try {
            if (conn.isClosed()) {
                return false;
            }
            else {
                conn.close();
                return true;
            }
        }
        catch (SQLException sqle) {
            LOGGER.log(Level.SEVERE, "Problem closing jdbc connection, URL: " + POSTGRES_URL, sqle);
            return false;
        }
    }

    public boolean createBikesTable(Connection conn) {

        // auto-closing a statement set is safe, even though auto-closing a connection is not.\
        try(Statement statement = conn.createStatement()) {
            
            statement.executeUpdate(CREATE_BIKES_TABLE);
            return true;
        }
        catch (SQLException sqle) {
            LOGGER.log(Level.SEVERE, "Exception when creating table", sqle);
            return false;
        }
    }

    public boolean dropBikesTable(Connection conn) {

        // auto-closing a «statement set is safe, even though auto-closing a connection is not.\
        try(Statement statement = conn.createStatement()) {
            
            statement.executeUpdate(DROP_BIKES_TABLE);
            return true;
        }
        catch (SQLException sqle) {
            LOGGER.log(Level.SEVERE, "Exception when dropping table", sqle);
            return false;
        }
    }

    public boolean insertBike(Connection conn, Bike bike) {

        // auto-closing a prepared statement set is safe, even though auto-closing a connection is not.\
        try(PreparedStatement ps = conn.prepareStatement(INSERT_BIKE)) {
            ps.setString(1, bike.getName());
            ps.setBoolean(2, bike.isBmx());
            ps.executeUpdate();

            return true;
        }
        catch (SQLException sqle) {
            LOGGER.log(Level.SEVERE, "Exception when adding bike: " + bike.toString() , sqle);
            return false;
        }
    }

    public List<DbBike> selectBikesByName(Connection conn, String bikeName) {

        List<DbBike> results = new ArrayList<>();

        // auto-closing a prepared statement set is safe, even though auto-closing a connection is not.
        try(PreparedStatement ps = conn.prepareStatement(SELECT_BIKES_BY_NAME)) {
            
            ps.setString(1, bikeName);

            // auto-closing a result set is safe, even though auto-closing a connection is not.
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    int     id   = rs.getInt("id");
                    String  name = rs.getString("name");
                    boolean bmx  = rs.getBoolean("bmx");

                    DbBike bike = new DbBike(id, name, bmx);
                    results.add(bike);
                }                
            }
        }
        catch (SQLException sqle) {
            LOGGER.log(Level.SEVERE, "Exception when selecting bikes by name: " + bikeName , sqle);
            return Collections.emptyList();
        }
        return results;
    }

    public List<DbBike> selectBikesByBmx(Connection conn, boolean isBmx) {

        List<DbBike> results = new ArrayList<>();

        // auto-closing a prepared statement set is safe, even though auto-closing a connection is not.
        try(PreparedStatement ps = conn.prepareStatement(SELECT_BIKES_BY_BMX);){
            
            ps.setBoolean(1, isBmx);

            // auto-closing a result set is safe, even though auto-closing a connection is not.
            try(ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    int     id   = rs.getInt("id");
                    String  name = rs.getString("name");
                    boolean bmx  = rs.getBoolean("bmx");

                    DbBike bike = new DbBike(id, name, bmx);
                    results.add(bike);
                }
            }
        }
        catch (SQLException sqle) {
            LOGGER.log(Level.SEVERE, "Exception when selecting bikes by bmx: " + isBmx , sqle);
            return Collections.emptyList();
        }
        return results;
    }

    public int updateBikeBmxByName(Connection conn, String name, boolean isBmx) {

        // auto-closing a prepared statement set is safe, even though auto-closing a connection is not.
        try(PreparedStatement ps = conn.prepareStatement(UPDATE_BIKE_BMX_BY_NAME)) {
            
            ps.setBoolean(1, isBmx);
            ps.setString(2, name);

            return ps.executeUpdate();
        }
        catch (SQLException sqle) {
            LOGGER.log(Level.SEVERE, "Exception when updating bike bmx by bike name: " + isBmx , sqle);
            return -1;
        }
    }
}
