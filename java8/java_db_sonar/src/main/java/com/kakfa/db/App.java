package com.kakfa.db;

import java.util.logging.Level;
import java.util.logging.Logger;

// if you wan to keep the system out, and tell sonar this one is okay, uncomment this:
//@SuppressWarnings("squid:S106")
public class App {

    protected static final Logger LOGGER = Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);

    public static final String HELLO_DATABASE = "Hello database.";

    public String getGreeting() {

        // debug logging
        LOGGER.log(Level.FINE, "DB Greeting Requested");

        return HELLO_DATABASE;
    }

    // Uncomment this if you want sonar to generate a Code Smell for using System.out.println()
    // @SuppressWarnings("squid:S106")
    public static void main(String[] args) {

        App instance = new App();
        String greeting = instance.getGreeting();
        System.out.println(greeting);
    }
}
