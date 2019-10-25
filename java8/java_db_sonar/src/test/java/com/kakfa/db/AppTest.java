package com.kakfa.db;

import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.fail;


import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

/**
 * Simple unit tests of our application.
 *  
 * @author damon.berry
 * @since  September 2019
 */
public class AppTest {

    @Test
    public void testGreeting() {

        App classUnderTest = new App();

        assertNotNull("App should have a greeting", classUnderTest.getGreeting());
    }

    @Ignore("This test is turned off")
    @Test
    public void testBroken() {

        App classUnderTest = new App();

        assertNull("App should have a greeting", classUnderTest.getGreeting());
    }

    @Test
    public void testAsInMemory() {

        ByteArrayOutputStream osOut = new ByteArrayOutputStream();
        PrintStream psOut = new PrintStream(osOut);

        ByteArrayOutputStream osErr = new ByteArrayOutputStream();
        PrintStream psErr = new PrintStream(osErr);

        try {
            System.setOut(psOut);
            System.setErr(psErr);

            String[] args = { };

            App.main(args);

            String output = osOut.toString("UTF8").trim();
            String error = osErr.toString("UTF8").trim();

            assertEquals("Standard Output should say hello world", App.HELLO_DATABASE, output);
            assertEquals("Standard Error should be empty", 0, error.length());
        }
        catch (Exception e) {
            fail("Exception caught while running App.main" + e.getMessage());
        }
    }
}
