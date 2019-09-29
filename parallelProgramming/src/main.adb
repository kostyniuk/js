--Lab. 1. Ada.
--Kostyniuk Oleksandr
--IO-71 group
--Number 11 in a group list


with Data, Text_IO, Ada.Integer_Text_IO, System.Multiprocessors;
use Text_IO, Ada.Integer_Text_IO, System.Multiprocessors;

procedure main is
   n: Integer := 3 ;
   package data1 is new data (n);
   use data1;
   res1: Integer;
   res2: Matrix;
   res3: Vector;

   procedure tasks is

      CPU_1 : CPU_Range:=0;
      CPU_2 : CPU_Range:=1;
      CPU_3 : CPU_Range:=2;

      task T1 is
         pragma Priority(1);
         pragma Storage_Size(100000);
         pragma CPU(CPU_1);
      end;

      task body T1 is
         A, B: Vector;
         MA, MB: Matrix;
      begin
         Put_Line("T1 started");
         Vector_Filling_Ones(A);
         Vector_Filling_Ones(B);
         Matrix_Filling_Ones(MA);
         Matrix_Filling_Ones(MB);
         res1 := Func1(A, B, MA, MB);
         delay(1.0);
         New_Line;
         Put_Line("T1 finished");

      end T1;

      task T2 is
         pragma Priority(2);
         pragma Storage_Size(100000);
         pragma CPU(CPU_2);
      end;
      task body T2 is
         MH, MG, MK: Matrix;

         A: Vector;
      begin
         Put_Line("T2 started");
         Vector_Filling_Ones(A);
         Matrix_Filling_Ones(MG);
         Matrix_Filling_Ones(MH);
         Matrix_Filling_Ones(MK);
         res2 := Func2(MG, MH, MK);
         delay(1.0);
         New_Line;
         New_Line;Put_Line("T2 finished");

      end T2;

      task T3 is
         pragma Priority(3);
         pragma Storage_Size(100000);
         pragma CPU(CPU_3);
      end;
      task body T3 is
         MR, MS : Matrix;
         O, P: Vector;
      begin
         Put_Line("T3 started");
         Vector_Filling_Ones(O);
         Vector_Filling_Ones(P);
         Matrix_Filling_Ones(MR);
         Matrix_Filling_Ones(MS);
         res3 := Func3(O, P, MR, MS);
         delay(1.0);
         New_Line;
         Put_Line("T3 finished");

      end T3;

   begin
      null;
   end tasks;

begin
   tasks;
   Put("Function1 result");
   Put(res1);
   New_Line;
   Put("Function2 result");
   New_Line;
   Matrix_Output(res2);
   New_Line;
   Put("Function3 result");
   Vector_Output(res3);
   New_Line;

End main;
