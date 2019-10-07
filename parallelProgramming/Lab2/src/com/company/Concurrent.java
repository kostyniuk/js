package com.company;

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
        return ma.multiply(me).multiply(b.add(c)).dotProduct(a);
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

        Matrix MA = new Matrix(n, true);
        Matrix MB = new Matrix(n, true);
        Matrix MK = new Matrix(n, true);
        Matrix MZ = new Matrix(n, true);

        System.out.println("F2 results in: ");
        second(MK, MA, MZ, MB).print();
        System.out.println("Thread " + this.getName() + " has finished execution!");
    }

    private Matrix second(Matrix mk, Matrix ma, Matrix mz, Matrix mb) {
        return ma.multiply(ma.multiply(mz)).add(mb.sort());
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

        Vector P = new Vector(n, true);
        Vector R = new Vector(n, true);

        Matrix MS = new Matrix(n, true);
        Matrix MT = new Matrix(n, true);

        System.out.println("F3 results in \n");
        third(MS, MT, P, R).print();
        System.out.println("Thread T3 has finished execution!");

    }

    private Vector third(Matrix ms, Matrix mt, Vector p, Vector r) {
        return ms.multiply(mt).multiply(p.add(r));
    }

}