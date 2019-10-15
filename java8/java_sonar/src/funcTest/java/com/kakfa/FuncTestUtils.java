package com.kakfa;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.StringJoiner;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level; 
import java.util.logging.Logger;

public class FuncTestUtils {
    
    private FuncTestUtils() {
        // do nothing
    }
    
    private static class SingletonHolder {
        private SingletonHolder() {
            // do nothing
        }
        
        protected static final FuncTestUtils INSTANCE = new FuncTestUtils();
    }
    
    public static FuncTestUtils getInstance() {

        return SingletonHolder.INSTANCE;
    }
    
    protected static final Logger LOGGER = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);
    
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

    protected String streamToString(InputStream inputStream) {
        
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        
        StringJoiner joiner = new StringJoiner(System.getProperty("line.separator"));
        reader.lines().iterator().forEachRemaining(joiner::add);
        
        String result = joiner.toString();
        return result;
    }
}
