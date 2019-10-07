package com.company;

/**
 * Created by Andrew on 19-Sep-16.
 */
class F1 extends Thread {

    private int n;

    public F1(String name, int priority, int n) {
        super(name);
        this.n = n;
        this.setPriority(priority);
    }

    @Override
    public void run() {
        System.out.println("Thread " + this.getName() + " started!");

        Vector A = new Vector(n, true);
        Vector B = new Vector(n, true);
        Vector C = new Vector(n, true);

        Matrix MA = new Matrix(n, true);
        Matrix ME = new Matrix(n, true);

        System.out.printf("F1 results in %d\n", first(A, B, C, MA, ME));
        System.out.println("Thread " + this.getName() + " has finished execution!");
    }

    private long first(Vector a, Vector b, Vector c, Matrix ma, Matrix me) {
        return ma.multiply(me).multiply(c).dotProduct(a.add(b));
    }

}

class F2 extends Thread {

    private int n;

    public F2(String name, int priority, int n) {
        super(name);
        this.n = n;
        this.setPriority(priority);
    }

    @Override
    public void run() {
        System.out.println("Thread " + this.getName() + " started!");

        Matrix MF = new Matrix(n, true);
        Matrix MK = new Matrix(n, true);

        System.out.println("F2 results in: ");
        second(MF, MK).print();
        System.out.println("Thread " + this.getName() + " has finished execution!");
    }

    private Matrix second(Matrix mf, Matrix mk) {
        return mf.transpose().multiply(mk).sort();
    }

}

class F3 implements Runnable {

    private int n;

    public F3(int n) {
        this.n = n;
    }

    @Override
    public void run() {
        System.out.println("Thread T3 started!");
        Vector R = new Vector(n, true);
        Vector S = new Vector(n, true);

        Matrix MO = new Matrix(n, true);
        Matrix MP = new Matrix(n, true);
        Matrix MS = new Matrix(n, true);

        System.out.printf("F3 results in %d\n", third(MO, MP, MS, R, S));
        System.out.println("Thread T3 has finished execution!");

    }

    long third(Matrix mo, Matrix mp, Matrix ms, Vector r, Vector s) {
        return mo.multiply(mp).multiply(r).add(ms.multiply(s)).max();
    }

}