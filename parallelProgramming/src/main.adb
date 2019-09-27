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

   procedure tasks is
      task T1 is
         pragma Priority(1);
         pragma Storage_Size(100000);
         pragma CPU(1);
      end;

      task body T1 is
         A, B: Vector;
         MA, MB: Matrix;
         e: Integer;
      begin
         Put_Line("T1 started");
         Vector_Filling_Ones(A);
         Vector_Filling_Ones(B);
         Matrix_Filling_Ones(MA);
         Matrix_Filling_Ones(MB);
         e := Func1(A, B, MA, MB);
         delay(1.0);
         New_Line;
         Put_Line("Func1:");
         Put(e);
         New_Line;
         Put_Line("T1 finished");

      end T1;

      task T2 is
         pragma Priority(2);
         pragma Storage_Size(100000);
         pragma CPU(2);
      end;
      task body T2 is
         MH, MG, MK, MF: Matrix;

         A: Vector;
      begin
         Put_Line("T2 started");
         Vector_Filling_Ones(A);
         Matrix_Filling_Ones(MG);
         Matrix_Filling_Ones(MH);
         Matrix_Filling_Ones(MK);
         MF := Func2(MG, MH, MK);
         delay(2.0);
         New_Line;
         Put_Line("Func2:");
         Matrix_Output(MF);
         New_Line;
         New_Line;Put_Line("T2 finished");

      end T2;

      task T3 is
         pragma Priority(3);
         pragma Storage_Size(100000);
         pragma CPU(3);
      end;
      task body T3 is
         MR, MS : Matrix;
         O, P, S: Vector;
      begin
         Put_Line("T3 started");
         Vector_Filling_Ones(O);
         Vector_Filling_Ones(P);
         Matrix_Filling_Ones(MR);
         Matrix_Filling_Ones(MS);
         S := Func3(O, P, MR, MS);
         delay(3.0);
         Put_Line("Func3:");
         Vector_Output(S);
         New_Line;
         Put_Line("T3 finished");

      end T3;

   begin
      null;
   end tasks;

begin
   tasks;

End main;
