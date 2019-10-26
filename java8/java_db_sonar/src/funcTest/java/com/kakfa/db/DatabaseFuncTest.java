package com.kakfa.db;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;

import java.sql.Connection;
import java.util.List;

import static com.kakfa.db.Bike.DIAMONDBACK;
import static com.kakfa.db.Bike.SCHWINN;
import static com.kakfa.db.Bike.TREK;

/**
 * We use fixed method ordering to ensure that we create the table first,
 * manipulate the table next, and drop the table at the end.
 * 
 * The method ordering is alphabetical.
 * 
 * @author damon.berry
 * @since  October 2019
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class DatabaseFuncTest {

    public Connection test_conn;

    @Before
    public void establishDatabaseConnection() {
        test_conn = DBUtils.getInstance().getConnection();
    }

    @After
    public void closeDatabaseConnection() {
        DBUtils.getInstance().safeClose(test_conn);
    }

    @Test
    public void test1CreateTable() {
        boolean created = DBUtils.getInstance().createBikesTable(test_conn);
        assertEquals("Failed to create bikes table", true, created );
    }

    @Test
    public void test2InsertBikes() {

        assertTrue("Problem inserting the schwinn bike",
                   DBUtils.getInstance().insertBike(test_conn, SCHWINN));

        assertTrue("Problem inserting the trek bike",
                   DBUtils.getInstance().insertBike(test_conn, TREK));

        assertTrue("Problem inserting the diamondback bike",
                   DBUtils.getInstance().insertBike(test_conn, DIAMONDBACK));
    }

    @Test
    public void test3SelectEachBike() {

        assertEquals("Problem selecting the schwinn bike by name",
                     SCHWINN,
                     DBUtils.getInstance().selectBikesByName(test_conn, SCHWINN.getName()).get(0));

        assertEquals("Problem selecting the trek bike by name",
                     TREK,
                     DBUtils.getInstance().selectBikesByName(test_conn, TREK.getName()).get(0));

        assertEquals("Problem selecting the diamondback bike by name",
                     DIAMONDBACK,
                     DBUtils.getInstance().selectBikesByName(test_conn, DIAMONDBACK.getName()).get(0));
    }

    @Test
    public void test4SelectBikesByBmx() {

        List<DbBike> notBmx = DBUtils.getInstance().selectBikesByBmx(test_conn, false);
        assertEquals("Problem selecting the schwinn bike by name",
                     SCHWINN,
                     notBmx.get(0));

        assertEquals("Problem selecting the trek bike by name",
                     TREK,
                     notBmx.get(1));

        assertEquals("Problem selecting the diamondback bike by name",
                     DIAMONDBACK,
                     DBUtils.getInstance().selectBikesByBmx(test_conn, true).get(0));
    }


    @Test
    public void test5Update() {


        assertEquals("Problem updated bmx field of the schwinn",
                    1,
                    DBUtils.getInstance().updateBikeBmxByName(test_conn, SCHWINN.getName(), true));


        List<DbBike> bmx = DBUtils.getInstance().selectBikesByBmx(test_conn, true);
        assertEquals("Problem selecting the schwinn bike by bmx",
                     new Bike(SCHWINN.getName(), true),
                     bmx.get(0));

        assertEquals("Problem selecting the diamondback bike by bmx",
                     DIAMONDBACK,
                     bmx.get(1));

        assertEquals("Problem selecting the trek bike by name",
                     TREK,
                     DBUtils.getInstance().selectBikesByBmx(test_conn, false).get(0));
    }

    @Test
    public void test6FailureCases() {
        
        Connection conn = null;
        assertTrue("safe close null connection wasn't happy", DBUtils.getInstance().safeClose(conn));
        
        conn = DBUtils.getInstance().getConnection();
        assertTrue("safe close actual connection wasn't happy", DBUtils.getInstance().safeClose(conn));
        assertFalse("safe close already closed connection was happy", DBUtils.getInstance().safeClose(conn));
    }

    
    @Test
    public void test99DropTable() {
        boolean dropped = DBUtils.getInstance().dropBikesTable(test_conn);
        assertEquals("Failed to drop bikes table", true, dropped);
    }
}
