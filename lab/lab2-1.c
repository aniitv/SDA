#include <stdio.h>
#include <math.h>

int main(){
    
int n, i, j, ct;
double S, P;

printf("Enter the value of n: ");
scanf("%d", &n);

ct=0;
S=0; 
ct++; // S=0

for (i=1; i<=n; i++){

    P=1;
    for (j=1; j<=i; j++){ //j=1
        P*=j-sin(j); 
        ct+=6; // <=, ++, *, -, sin, jump
    }
   
    S+=(i+cos(i))/P;
    ct+=9; //<=, ++, j=1, +=, +, cos, /, P=1 jump
}
ct++; // i=1

printf("S = %.7f\n", S);
printf("ct = %3d\n", ct);

    return 0;
}