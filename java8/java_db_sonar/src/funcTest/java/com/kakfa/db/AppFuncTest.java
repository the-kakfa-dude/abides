package com.kakfa.db;

import org.junit.After;
import org.junit.Test;
import static org.junit.Assert.assertEquals;

import java.io.File;
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
        String[] results = FuncUtils.getInstance().executeCommands(commands, directory, TIMEOUT_SECONDS);

        assertEquals("We didn't get two strings back", 2, results.length);
        assertEquals("Standard Output should say hello world", App.HELLO_DATABASE, results[0]);
        assertEquals("Standard Error should be empty", 0, results[1].length());
    }

}
