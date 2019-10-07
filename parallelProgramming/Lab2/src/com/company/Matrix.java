package com.company;

import java.util.Arrays;
import java.util.Random;

/**
 * Created by Andrew on 18-Sep-16.
 */
public class Matrix {

    private int[][] data;

    private int n;

    public Matrix(int n, boolean fill) {
        this.n = n;
        this.data = new int[n][n];
        if (fill) {
            Random rnd = new Random();
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    this.data[i][j] = rnd.nextInt(10);
                }
            }
            rnd = null;
        }
    }

    public Matrix add(Matrix that) {
        if (this.n != that.n)
            throw new IllegalArgumentException("Operands have different dimensions!");
        Matrix result = new Matrix(this.n, false);
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                result.data[i][j] = this.data[i][j] + that.data[i][j];
            }
        }
        return result;
    }

    public Matrix subtract(Matrix that) {
        if (this.n != that.n)
            throw new IllegalArgumentException("Operands have different dimensions!");
        Matrix result = new Matrix(this.n, false);
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                result.data[i][j] = this.data[i][j] - that.data[i][j];
            }
        }
        return result;
    }

    public Matrix multiply(Matrix that) {
        if (this.n != that.n)
            throw new IllegalArgumentException("Operands have different dimensions");
        Matrix result = new Matrix(this.n, false);
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                for (int k = 0; k < n; k++) {
                    result.data[i][j] += this.data[i][k] * that.data[k][j];
                }
            }
        }
        return result;
    }

    public Vector multiply(Vector that) {
        if (this.n != that.n)
            throw new IllegalArgumentException("Operands have different dimensions");
        Vector result = new Vector(this.n, false);

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                result.data[i] += this.data[i][j] * that.data[i];
            }
        }
        return result;
    }

    public Matrix transpose() {
        int tmp;
        for (int i = 0; i < this.n; i++) {
            for (int j = 0; j < this.n; j++) {
                if (j < i) {
                    tmp = this.data[i][j];
                    this.data[i][j] = this.data[j][i];
                    this.data[j][i] = tmp;
                }
            }
        }
        return this;
    }

    public Matrix sort() {
        for (int i = 0; i < this.n; i++) {
            Arrays.sort(this.data[i]);
        }
        Arrays.sort(this.data, (o1, o2) -> o1[0] - o2[0]);
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
            return "Output is too cumbersome.";
        }
    }

    public void print() {
        System.out.println(this);
    }
}
