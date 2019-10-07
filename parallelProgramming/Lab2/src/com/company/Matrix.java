package com.company;

import java.util.Arrays;
import java.util.Comparator;
import java.util.Random;

public class Matrix {

    private int[][] data;

    private int n;

    public Matrix(int n, boolean fill) {
        this.n = n;
        this.data = new int[n][n];
        if (fill) {
            Random rnd = new Random();
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++) {
                    this.data[i][j] = rnd.nextInt(10);
                }
        }
    }

    public Matrix add(Matrix another) {
        if (this.n != another.n)
            throw new IllegalArgumentException("Matrices have different dimensions!");
        Matrix result = new Matrix(this.n, false);
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                result.data[i][j] = this.data[i][j] + another.data[i][j];
            }
        }
        return result;
    }

    public Matrix multiply(Matrix another) {
        if (this.n != another.n)
            throw new IllegalArgumentException("Matrices have different dimensions");
        Matrix result = new Matrix(this.n, false);
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                for (int k = 0; k < n; k++) {
                    result.data[i][j] += this.data[i][k] * another.data[k][j];
                }
            }
        }
        return result;
    }

    public Vector multiply(Vector another) {
        if (this.n != another.n)
            throw new IllegalArgumentException("Matrices have different dimensions");
        Vector result = new Vector(this.n, false);

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                result.data[i] += this.data[i][j] * another.data[i];
            }
        }
        return result;
    }

    public Matrix sort() {
        for (int i = 0; i < this.n; i++) {
            Arrays.sort(this.data[i]);
        }
        Arrays.sort(this.data, Comparator.comparingInt(o -> o[0]));
        return this;
    }

    @Override
    public String toString() {
        if (this.n < 6) {
            StringBuilder str = new StringBuilder();
            for (int i = 0; i < n; i++) {
                str.append(Arrays.toString(data[i])).append("\n");
            }
            return str.toString();
        } else {
            return "Output is too huge.";
        }
    }

    public void print() {
        System.out.println(this);
    }
}
