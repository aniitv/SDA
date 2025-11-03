#include <stdio.h>
#include <math.h>

int main(){
    
int n, i, ct;
double S, P;

printf("Enter the value of n: ");
scanf("%d", &n);

ct=0;

S=0; 
P=1;
ct+=2; // S=0, P=1

for (i=1; i<=n; i++){
        P*=i-sin(i); 
        S+=(i+cos(i))/P;
    ct+=10; //<=, ++, =*, -, sin, +=, +, cos, /, jump
}
ct++; // i=1

printf("S = %.7f\n", S);
printf("ct = %3d\n", ct);

    return 0;
}