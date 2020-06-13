
mov eax, 1097859072
mov dword ptr[a+4], eax  // a[1] = 15
  
mov eax, 3225419776
mov dword ptr[a+4], eax  // a[1] = -3
  
mov eax, 1084856729
mov dword ptr[a+12], eax  // a[3] = 5.3
  
mov eax, 3240099840
mov dword ptr[a+4], eax  // a[1] = -10
  
mov n, 1092616192 //n = 10
mov d, 3248488448 //d = -20
mov CONSTANT_1, 1073741824 //CONSTANT_1 = 2

movups xmm0, b
movups xmm1, d
movups xmm2, CONSTANT_1
mov esi, 10
movups xmm3, [4 * esi] + a
mulss xmm2, xmm3
movups b, xmm2
movups b, xmm1