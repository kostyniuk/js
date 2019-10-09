﻿﻿using System;
using System.Threading;
     
//    1.13 C = A*(MA*ME) + B + D
//    2.22 MF = (MG *MH)*(MK + ML)
//    3.23 s = MAX((MO*MP)(R + T))

namespace CsharpThreads
{ 
    class Program
    {
        const int N = 5;
        public static int counter = 0;
        public static int s;
        public static Vector C;
        public static Matrix MF;

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

        }

        static void F1()
        {
            Console.WriteLine("Thread T1 started!");
           
            Matrix MA = new Matrix(N, true);
            Matrix ME = new Matrix(N, true);

            Vector A = new Vector(N, true);
            Vector B = new Vector(N, true);
            Vector D = new Vector(N, true);

            Thread.Sleep(1000);
            
            C = (MA * ME) * A + B + D;
            
            Console.WriteLine("Thread T1 finished!");
            
            logging();
            
        }

        static void F2()
        {
            Console.WriteLine("Thread T2 started!");

            Matrix MK = new Matrix(N, true);
            Matrix MG = new Matrix(N, true);
            Matrix MH = new Matrix(N, true);
            Matrix ML = new Matrix(N, true);

            Thread.Sleep(500);

            MF = (Matrix)((MG * MH) * (MK + ML));

            Console.WriteLine("Thread T2 finished!");
            
            logging();

        }

        static void F3()
        {
            Console.WriteLine("Thread T3 started!");

            Matrix MO = new Matrix(N, true);
            Matrix MP = new Matrix(N, true);
            Vector R = new Vector(N, true);
            Vector T = new Vector(N, true);

            Thread.Sleep(1500);

            s = ((MO * MP) * (R + T)).Max();
            
            Console.WriteLine("Thread T3 finished!");
            
            logging();

        }

        static public void logging () {
            counter++;
            if(counter == 3) {
            Console.Write("F1 = ");
            C.Print();
            Console.WriteLine("F2 = ");
            MF.Print();
            Console.Write("F3 = " + s);
            }
        } 
    }
}