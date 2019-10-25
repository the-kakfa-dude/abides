package com.kakfa;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.fail;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import org.junit.After;
import org.junit.Ignore;

import com.kakfa.App;


/**
 * Simple test of our Hello World Application.
 * 
 * @author damon.berry
 * @since  September 2019
 */
public class AppTest {
    
    protected final static String USER_DIR_PROPERTY = "user.dir";
    protected final static String WORKING_DIR = System.getProperty(USER_DIR_PROPERTY);
    
    protected final static int TIMEOUT_SECONDS = 5;
    
    private final PrintStream originalStandardOut = System.out;
    private final PrintStream originalStandardError = System.err;
    
    @After
    public void thunkStdOutAndStdErr() {
        System.setOut(originalStandardOut);
        System.setErr(originalStandardError);
    }
    
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
    public void testMainMethod() {
                
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
        
            assertEquals("Standard Output should say hello world", App.HELLO_WORLD, output);
            assertEquals("Standard Error should be empty", 0, error.length());
        }
        catch (Exception e) {
            fail("Exception caught while running App.main" + e.getMessage());
        }
    }
}
