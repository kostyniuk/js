"\nmov eax, 1097859072\nmov dword ptr[a+0], eax  // a[0] = 15\n  \nmov eax, 1077936128\nmov dword ptr[a+4], eax  // a[1] = 3\n  \nmov eax, 1084856729\nmov dword ptr[a+12], eax  // a[3] = 5.3\n  \nmov n, 1077936128 //n = 3\nmov d, 1101004800 //d = 20\nmov CONSTANT_1, 1073741824 //CONSTANT_1 = 2movups xmm0, b\nmovups xmm1, d\nmovups xmm2, CONSTANT_1\nmov esi, 3\nmovups xmm3, [4 * esi] + a\nmulss xmm2, xmm3\nmovups b, xmm2"