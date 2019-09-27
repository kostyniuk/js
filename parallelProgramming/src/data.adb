-----------Package Data, body-----------
with Text_IO, Ada.Integer_Text_IO;
use Text_IO, Ada.Integer_Text_IO;
package body Data is

   --Read Vector
   procedure Vector_Input(A: out Vector) is
   begin
      for i in 1..n loop
         Get(A(i));
      end loop;
   end Vector_Input;

   --Write vector on screen
   procedure Vector_Output(A: in Vector) is
   begin
      for i in 1..n loop
         Put(A(i));
         Put(" ");
      end loop;
   end Vector_Output;

   --Read matrix
   procedure Matrix_Input(A: out Matrix) is
   begin
      for i in 1..n loop
         for j in 1..n loop
            Get(A(i)(j));
         end loop;
      end loop;
   end Matrix_Input;

   --Write matrix on screen
   procedure Matrix_Output (A: in Matrix) is
   begin
      for i in 1..n loop
         for j in 1..n loop
            Put(A(i)(j));
            Put(" ");
         end loop;
         Put_Line(" ");
      end loop;
   end Matrix_Output;

   --Max value of vector
   function Max_vector_value(A: in Vector) return Integer is
      k: Integer;
   begin
      k := A(1);
      for i in 2..n loop
         if A(i) > k then
            k := A(i);
         end if;
      end loop;
   return k;
   end Max_vector_value;

   --Min value of vector
   function Min_vector_value(A: in Vector) return Integer is
      k: Integer;
   begin
      k := A(1);
      for i in 2..n loop
         if A(i) < k then
            k := A(i);
         end if;
      end loop;
   return k;
   end Min_vector_value;

   --Multiplication of matrics
   function Matrix_Multiplication(A, B: in Matrix) return Matrix is
      P: Matrix;
      S: Integer;
   begin
      for k in 1..n loop
         for i in 1..n loop
            S := 0;
            for j in 1..n loop
               S := S + A(k)(j)*B(j)(i);
               P(k)(i) := S;
            end loop;
         end loop;
      end loop;
      return P;
   end Matrix_Multiplication;

   --Multiplication of a vector and a matrix
   function Vector_Matrix_Multiplication(A: in Vector; B: in Matrix) return Vector is
      P: Vector;
      S: Integer;
   begin
      for i in 1..n loop
         S := 0;
         for j in 1..n loop
            S := S + A(j)*B(j)(i);
         end loop;
         P(i) := S;
      end loop;
      return P;
   end Vector_Matrix_Multiplication;

   --Sum of vectors
   function Vector_Sum(A, B: in Vector) return Vector is
      S: Vector;
   begin
      for i in 1..n loop
         S(i) := A(i)+B(i);
      end loop;
      return S;
   end Vector_Sum;

   --Transposition of a Matrix
   procedure Matrix_Transposition(A: in out Matrix) is
      S: Integer;
   begin
      for i in 1..n loop
         for j in i..n loop
            S:=A(j)(i);
            A(j)(i):=A(i)(j);
            A(i)(j):=S;
         end loop;
      end loop;
   end Matrix_Transposition;

   --Multiplication vectors
   function Vectors_Multiplication(A, B: in Vector) return Integer is
     r: Integer := 0;
   begin
      for i in 1..n loop
         r:= r + A(i) * B(i);
      end loop;
      return r;
   end Vectors_Multiplication;

   --Multiplication of a matrix and a Number
   function Matrix_Int_Muliplication(MA: in out Matrix; s: Integer) return Matrix is
   begin
      for i in 1..n loop
         for j in 1..n loop
           MA(i)(j) := MA(i)(j) * s;
         end loop;
      end loop;
      return MA;
   end Matrix_Int_Muliplication;


   --Sorting of vector
   function Vector_Sorting(A: in out Vector) return Vector is
      S: Integer;
   begin
      for i in 1..n loop
         for j in i..n loop
            if A(i)>A(j) then
               S:=A(j);
               A(j):=A(i);
               A(i):=S;
            end if;
         end loop;
      end loop;
      return A;
   end Vector_Sorting;

   --Max value of matrix
   function Max_matrix_value(MA: in Matrix) return Integer is
      k: Integer;
   begin
      k := MA(1)(1);
      for i in 1..n loop
         for j in 1..n loop
            if MA(i)(j) > k then
               k := MA(i)(j);
            end if;
         end loop;
      end loop;
      return k;
   end Max_matrix_value;

   --Sum of matrix
   function Matrix_Sum(MA, MB: in Matrix) return Matrix is
      MC: Matrix;
   begin
      for i in 1..n loop
         for j in 1..n loop
            MC(i)(j) := MA(i)(j) + MB(i)(j);
         end loop;
      end loop;
      return MC;
   end Matrix_Sum;


   procedure Matrix_Filling_Ones(A: out Matrix) is
   begin
      for i in 1..n loop
         for j in 1..n loop
            A(i)(j) := 1;
         end loop;
      end loop;
   end Matrix_Filling_Ones;

   procedure Matrix_Filling_Number(A: out Matrix; i,j,number:Integer) is
   begin
      A(i)(j) := number;
   end Matrix_Filling_Number;


    procedure Vector_Filling_Ones (A: out vector) is
   begin
      for i in 1..n loop
         A(i) := 1;
      end loop;
   end Vector_Filling_Ones;

   procedure Vector_Filling_Number(A: out Vector; i,number:integer) is
   begin
      A(i) := number;
   end Vector_Filling_Number;


   --Calculation function 1
   function Func1 (A, B: in Vector; MA, MB: in Matrix) return Integer is
      d, g, e: Integer;
      MR: Matrix;
   begin
      MR := Matrix_Multiplication(MA, MB);
      d := Max_matrix_value(MR);
      g := Vectors_Multiplication(A, B);
      e := d * g;
      return e;
   end Func1;

   --Calculation function 2
   function Func2 (MG, MH, MK: in Matrix) return Matrix is
      k: Integer;
      MR, MA: Matrix;
   begin
      MR := Matrix_Multiplication(MH, MK);
      k := Max_matrix_value(MG);
      MA := Matrix_Int_Muliplication(MR, k);
      return MA;
   end Func2;

   --Calculation function 3
   function Func3 (O, P: in Vector; MR, MS: in Matrix) return Vector is
      MA: Matrix;
      A, B, C: Vector;
   begin
      A := Vector_Sum(O, P);
      B := Vector_Sorting(A);
      MA := Matrix_Multiplication(MR, MS);
      C := Vector_Matrix_Multiplication(B, MA);
      return C;
   end Func3;
end Data;
