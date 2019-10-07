package com.company;

import java.util.Arrays;
import java.util.Random;

/**
 * Created by Andrew on 18-Sep-16.
 */
public class Vector {

    int[] data;

    int n;

    public Vector(int n, boolean fill) {
        this.n = n;
        this.data = new int[n];
        if (fill) {
            Random rnd = new Random();
            for (int i = 0; i < n; i++) {
                this.data[i] = rnd.nextInt(10);
            }
            rnd = null;
        }
    }

    public Vector add(Vector that) {
        if (this.n != that.n)
            throw new IllegalArgumentException("Operands have different dimensions!");
        Vector result = new Vector(this.n, false);
        for (int i = 0; i < n; i++) {
            result.data[i] = this.data[i] + that.data[i];
        }
        return result;
    }

    public Vector subtract(Vector that) {
        if (this.n != that.n)
            throw new IllegalArgumentException("Operands have different dimensions!");
        Vector result = new Vector(n, false);
        for (int i = 0; i < n; i++) {
            result.data[i] = this.data[i] - that.data[i];
        }
        return result;
    }

    public long dotProduct(Vector that) {
        if (this.n != that.n)
            throw new IllegalArgumentException("Operands have different dimensions!");
        int result = 0;
        for (int i = 0; i < n; i++) {
            result += this.data[i] * that.data[i];
        }
        return result;
    }

    public void sort() {
        Arrays.sort(this.data);
    }

    public int max() {
        int max = Integer.MIN_VALUE;
        for (int i : this.data) {
            if (i > max) {
                max = i;
            }
        }
        return max;
    }

    public void print() {
        System.out.println(this);
    }

    @Override
    public String toString() {
        return this.n < 6 ? Arrays.toString(this.data) : "Output is too cumbersome.";
    }

}
