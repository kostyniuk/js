package com.company;

import java.util.Arrays;
import java.util.Random;

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
        }
    }

    public Vector add(Vector another) {
        if (this.n != another.n)
            throw new IllegalArgumentException("Vectors have different dimensions!");
        Vector result = new Vector(this.n, false);
        for (int i = 0; i < n; i++) {
            result.data[i] = this.data[i] + another.data[i];
        }
        return result;
    }

    public long dotProduct(Vector another) {
        if (this.n != another.n)
            throw new IllegalArgumentException("Vectors have different dimensions!");
        int result = 0;
        for (int i = 0; i < n; i++) {
            result += this.data[i] * another.data[i];
        }
        return result;
    }

    public void print() {
        System.out.println(this);
    }

    @Override
    public String toString() {
        return this.n < 6 ? Arrays.toString(this.data) : "Output is too huge.";
    }

}
