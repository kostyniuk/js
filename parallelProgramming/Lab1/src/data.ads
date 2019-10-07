generic
   n: Integer;
package Data is

   type Vector is private;
   type Matrix is private;

   procedure Vector_Input(A: out Vector);

   procedure Vector_Output(A: in Vector);

   procedure Matrix_Input(A: out Matrix);

   procedure Matrix_Output(A: in Matrix);


   function Func1 (A, B: in Vector; MA, MB: in Matrix) return Integer;

   function Func2 (MG, MH, MK: in Matrix) return Matrix;

   function Func3 (O, P: in Vector; MR, MS: in Matrix) return Vector;

   procedure Matrix_Filling_Ones(A: out Matrix);

   procedure Matrix_Filling_Number(A: out Matrix; i,j,number:Integer);

   procedure Vector_Filling_Ones(A: out vector);

   procedure Vector_Filling_Number(A: out Vector; i,number:integer);


   private
   type Vector is array (1..n) of Integer;
   type Matrix is array (1..n) of Vector;

end Data;
