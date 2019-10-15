package com.kakfa.db;

import org.junit.After;
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.OutputStream;
import java.io.PrintStream;

public class AppFuncTest {
    
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
    public void testAsProcess() {
        
        File directory = new File(WORKING_DIR);
        String[] commands = { "java", "-cp", "./build/libs/java_db_sonar.jar", "com.kakfa.db.App" };
        String[] results = FuncTestUtils.getInstance().executeCommands(commands, directory, TIMEOUT_SECONDS);
        
        assertEquals("We didn't get two strings back", 2, results.length);
        assertEquals("Standard Output should say hello world", App.HELLO_WORLD, results[0]);
        assertEquals("Standard Error should be empty", 0, results[1].length());        
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
        
            assertEquals("Standard Output should say hello world", App.HELLO_WORLD, output);
            assertEquals("Standard Error should be empty", 0, error.length());
        }
        catch (Exception e) {
            fail("Exception caught while running App.main" + e.getMessage());
        }
    }
}
