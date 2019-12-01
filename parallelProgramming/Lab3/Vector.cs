using System;

namespace CsharpThreads
{

    public class Vector
    {
        public int[] data;
        public int n;

        public Vector(int n, bool fill)
        {
            this.n = n;
            data = new int[n];

            if (fill)
            {
                Random rnd = new Random();
                for (int i = 0; i < this.n; i++)
                {
                    //this.data[i] = rnd.Next(10);
                    this.data[i] = 1;

                }
            }
        }

        public static Vector operator +(Vector v1, Vector v2)
        {
            Vector result = new Vector(v1.n, false);
            for (int i = 0; i < result.n; i++)
            {
                result.data[i] = v1.data[i] + v2.data[i];
            }
            return result;
        }

        public static int operator *(Vector v1, Vector v2)
        {
            int res = 0;
            for (int i = 0; i < v1.n; i++)
            {
                res += v1.data[i] * v2.data[i];
            }
            return res;
        }

        public int Max()
        {
            int max = Int32.MinValue;
            for (int i = 0; i < n; i++)
            {
                if (this.data[i] > max) max = this.data[i];
            }
            return max;
        }


        public void Print()
        {
            if (n < 6)
            {
                Console.Write("[");
                for (int i = 0; i < n - 1; i++)
                {
                    Console.Write(data[i] + ", ");
                }
                Console.Write(data[n - 1] + "]" + "\n") ;
            } else
            {
                Console.WriteLine("Output is to cumbersome!");
            }
        }
    }
}