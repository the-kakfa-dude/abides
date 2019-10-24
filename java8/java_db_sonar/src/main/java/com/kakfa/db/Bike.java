package com.kakfa.db;

import java.util.Objects;

/**
 * A Bike has a name, and can either be/not-be a BMX.
 *
 * Aside from specifying the names and types of the
 * two members (name and bmx), this entire class
 * was auto-generated from my IDE.
 *
 * @author damon.berry
 * @since  October 2019
 */
public class Bike {

    public static final Bike SCHWINN     = new Bike("schwinn",     false);
    public static final Bike TREK        = new Bike("trek",        false);
    public static final Bike DIAMONDBACK = new Bike("diamondback", true);

    protected String name;

    protected boolean bmx;

    public Bike(String name, boolean bmx) {
        this.name = name;
        this.bmx = bmx;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isBmx() {
        return bmx;
    }

    public void setBmx(boolean bmx) {
        this.bmx = bmx;
    }

    @Override
    public int hashCode() {
        return Objects.hash(bmx, name);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }

        if (!(obj instanceof Bike)) {
            return false;
        }

        Bike other = (Bike) obj;
        return bmx == other.bmx && Objects.equals(name, other.name);
    }

    @Override
    public String toString() {
        return "Bike [name=" + name + ", bmx=" + bmx + "]";
    }
}
