﻿using System;
using System.Threading;
//          Assignment #3
//    Student: Andrew Logvinchuk
//    Group:   IO-41
//    Date:    28/09/2016
//
//    F1 = ((A + B)*(C*(MA*ME)))
//    F2 = SORT(TRANS(MF)*MK)
//    F3 = MAX((MO*MP)*R + MS*S)
namespace CsharpThreads
{ 
    class Program
    {

        const int N = 5;

        static void Main(string[] args)
        {
            Thread t1 = new Thread(new ThreadStart(F1));
            Thread t2 = new Thread(new ThreadStart(F2));
            Thread t3 = new Thread(new ThreadStart(F3));

            t1.Priority = ThreadPriority.BelowNormal;
            t2.Priority = ThreadPriority.Highest;
            t3.Priority = ThreadPriority.Normal;

            t1.Start();
            t2.Start();
            t3.Start();

            //Console.ReadKey();
        }

        static void F1()
        {
            Console.WriteLine("Thread T1 started!");
            Matrix MA = new Matrix(N, true);
            Matrix ME = new Matrix(N, true);
            Vector A = new Vector(N, true);
            Vector B = new Vector(N, true);
            Vector C = new Vector(N, true);

            Thread.Sleep(1000);

            Console.WriteLine("F1 = " + ((A + B) * ((MA * ME) * C)));
            Console.WriteLine("Thread T1 finished!");
        }

        static void F2()
        {
            Console.WriteLine("Thread T2 started!");

            Matrix MF = new Matrix(N, true);
            Matrix MK = new Matrix(N, true);

            Thread.Sleep(500);

            Matrix F2 = (MF.Transpose() * MK).Sort();

            Console.WriteLine("F2 = " + F2);
            Console.WriteLine("Thread T2 finished!");
        }

        static void F3()
        {
            Console.WriteLine("Thread T3 started!");

            Matrix MO = new Matrix(N, true);
            Matrix MP = new Matrix(N, true);
            Matrix MS = new Matrix(N, true);
            Vector R = new Vector(N, true);
            Vector S = new Vector(N, true);

            Thread.Sleep(1500);

            Console.WriteLine("F3 = " + ((MO * MP) * R + MS * S).Max());
            Console.WriteLine("Thread T3 finished!");
        }
    }
}