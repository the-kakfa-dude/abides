package com.kakfa.db;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/**
 * Pojo tests for a bike.
 * 
 * @author damon.berry
 * @since  October 2019
 */
public class BikeTest {

    @Test
    public void testGetters() {

        Bike superBike = new Bike("super", true);
        assertEquals("bike name not equal itself", "super", superBike.getName());
        assertEquals("bike isBmx not equal itself", true, superBike.isBmx());

        DbBike subDbBike = new DbBike(1234, "sub", false);
        assertEquals("db bike id not equal itself", 1234, subDbBike.getId());
        assertEquals("db bike name not equal itself", "sub", subDbBike.getName());
        assertEquals("db bike isBmx not equal itself", false, subDbBike.isBmx());
    }

    @Test
    public void testSetters() {

        Bike superBike   = new Bike("super", true);
        superBike.setName("not super");
        superBike.setBmx(false);

        assertEquals("set bike name is wrong", "not super", superBike.getName());
        assertEquals("set bike isBmx is wrong", false, superBike.isBmx());

        DbBike subDbBike = new DbBike(1234, "sub", false);
        subDbBike.id = 9876; // we buried the setter on purpse
        subDbBike.setName("not sub");
        subDbBike.setBmx(true);

        assertEquals("set db bike id is wrong", 9876, subDbBike.getId());
        assertEquals("set db bike name not equal itself", "not sub", subDbBike.getName());
        assertEquals("set db bike isBmx not equal itself", true, subDbBike.isBmx());
    }

    @Test
    public void testEquals() {

        Bike superBike = new Bike("super", true);
        DbBike subDbBike = new DbBike(88, "super", true);

        assertTrue("bike not equal itself", superBike.equals(superBike));
        assertTrue("db bike not equal itself", subDbBike.equals(subDbBike));
        assertFalse("bike equal null", superBike.equals(null));

        assertTrue("db bike not equal itself", subDbBike.equals(subDbBike));
        assertTrue("db bike not equal bike", subDbBike.equals(superBike));
        assertFalse("db bike equal null", subDbBike.equals(null));
        
        Bike otherSuperBike = new Bike("super", true);
        DbBike otherSubDbBike = new DbBike(88, "super", true);

        assertTrue("bike not equal other bike", superBike.equals(otherSuperBike));
        assertTrue("db bike not equal other db bike", subDbBike.equals(otherSubDbBike));
    }

    @Test
    public void testHashcode() {

        Bike superBike1 = new Bike("super", true);
        Bike superBike2 = new Bike("super", true);
        assertEquals("bike hashcode is different on equal bikes", superBike1.hashCode(), superBike2.hashCode());

        DbBike subDbBike1 = new DbBike(47, "sub", true);
        DbBike subDbBike2 = new DbBike(47, "sub", true);
        assertEquals("db bike hashcode is different on equal bikes", subDbBike1.hashCode(), subDbBike2.hashCode());
    }


    @Test
    public void testToString() {

        Bike bike = new Bike("super", true);
        String bikeString = bike.toString();
        assertTrue("bike string missing bike name", bikeString.contains(bike.getName()));
        assertTrue("bike string missing isBmx", bikeString.contains("" + bike.isBmx()));

        DbBike dbBike = new DbBike(2468, "sub", false);
        String dbBikeString = dbBike.toString();
        assertTrue("db bike string missing bike id", dbBikeString.contains("" + dbBike.getId()));
        assertTrue("db bike string missing bike name", dbBikeString.contains(dbBike.getName()));
        assertTrue("db bike string missing isBmx", dbBikeString.contains("" + dbBike.isBmx()));
    }
}
