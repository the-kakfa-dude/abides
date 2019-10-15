package com.kakfa.db;

import org.junit.Test;
import static org.junit.Assert.*;

import org.junit.Ignore;

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

}
