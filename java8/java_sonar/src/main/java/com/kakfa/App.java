package com.kakfa;

import java.util.logging.Level; 
import java.util.logging.Logger; 

/**
 * Simple hello world application.
 * 
 * @author damon.berry
 * @since  September 2019
 */
// if you wan to keep the system out, and tell sonar this one is okay, uncomment this:
//@SuppressWarnings("squid:S106")
public class App {

    protected static final Logger LOGGER = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);
    
    public static final String HELLO_WORLD = "Hello world.";
    
    public String getGreeting() {

        // debug logging
        LOGGER.log(Level.FINE, "Greeting Requested");
        
        return HELLO_WORLD;
    }

    public static void main(String[] args) {
        
        App instance = new App();
        String greeting = instance.getGreeting();
        System.out.println(greeting);
    }
}
