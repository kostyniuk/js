package com.company;

/**
 *
 *    F1 = (A * ((B + C)*(MA*ME)) 1.17
 *    F2 = MA*(MA*MZ) + TRANS(MB) 2.10
 *    F3 = (P+R)*(MS*MT) 3.7
 *
 */

public class Main {

    public static final int N = 5;

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new F1("T1", Thread.MIN_PRIORITY, N);
        Thread t2 = new F2("T2", Thread.MAX_PRIORITY, N);
        Thread t3 = new Thread(new F3(N));
        t3.setName("T3");
        t3.setPriority(Thread.NORM_PRIORITY);

        t1.start();
        t2.start();
        t3.start();

        t1.join();
        t2.join();
        t3.join();

        System.out.println("End");

    }

}
