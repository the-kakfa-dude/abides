package com.kakfa.db;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import java.util.StringJoiner;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * This is a Singleton Utilities class for Functional Test stuff.
 *
 * The pattern used here is the Singleton Holder pattern, which
 * ensures that only one instance of this class ever exists, and
 * that this single instance is constructed lazily.
 *
 * For a discussion of the pattern, with many in-code comments,
 * see: {@link com.kakfa.db.DBUtils}.
 *
 * @author damon.berry
 * @since  September 2019
 */
public class FuncUtils {

    private FuncUtils() {
        // do nothing
    }

    private static class SingletonHolder {
        private SingletonHolder() {
            // do nothing
        }

        protected static final FuncUtils INSTANCE = new FuncUtils();
    }

    public static FuncUtils getInstance() {

        return SingletonHolder.INSTANCE;
    }

    protected static final Logger LOGGER = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

    /**
     * Executes the presented command and command line args, found in the presented directory,
     * waiting for the results of the program execution for the specified number of seconds.
     * 
     * Captures the output from standard out and standard error, and returns that output as a
     * string array, where the first element is the output from stdout and the second is the
     * output from stderr.
     * 
     * @param commands The first element is the program you want executed the following elements
     *                 are the command line arguments to that program;
     * @param directory The working directory you wand the comamnd run from.
     * @param timeoutSeconds How long to wait for the program to complete (in seconds).
     * 
     * @return A two element array: first string is standard out contents, second string is
     *         standard error. Contents may be the empty string if now output was created 
     *         into the corresponding stream. 
     */
    public String[] executeCommands(String[] commands, File directory, long timeoutSeconds) {

        ProcessBuilder pb = new ProcessBuilder();

        pb.directory(directory);
        pb.command(commands);

        Process process = null;
        int exitValue = 0;

        try {
            process = pb.start();
            process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
            exitValue = process.exitValue();
        }
        catch (IOException ioe) {
            LOGGER.log(Level.SEVERE, "io exception while running process " + commands[0], ioe);
            return null;
        }
        catch (InterruptedException ie) {
            LOGGER.log(Level.SEVERE, "interrupted exception while running process " + commands[0], ie);
            return null;
        }

        if (exitValue != 0) {
            LOGGER.log(Level.SEVERE, "command " + commands[0] + " exited non-success code " + exitValue);
            return null;
        }

        String stdOut = streamToString(process.getInputStream());
        String stdErr = streamToString(process.getErrorStream());

        String[] results = { stdOut, stdErr };

        return results;
    }

    /**
     * Takes and input stream, reads it, and stored the output in a String.
     * 
     * @param inputStream The stream you want to read.
     * 
     * @return A string representation of the contents of the presented stream.
     *         Each line in the stream is represented as a separate line in the
     *         returned string.
     */
    protected String streamToString(InputStream inputStream) {

        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));

        StringJoiner joiner = new StringJoiner(System.getProperty("line.separator"));
        reader.lines().iterator().forEachRemaining(joiner::add);

        String result = joiner.toString();
        return result;
    }
}
