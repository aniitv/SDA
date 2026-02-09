#include <stdio.h>
double approximate_cos(double x, int n) {
    double sum = 1.0;  // Перший член ряду (i=0): (-1)^0 * x^0 / 0! = 1
    double term = 1.0; // Поточний член ряду a_i
    
    for (int i = 1; i <= n; i++) {
        term *= -x * x / ((2 * i) * (2 * i - 1));
        sum += term;
    }
    
    return sum;
}

int main() {
    double x;
    int n;

    printf("Enter the value of x (in radians): ");
    if (scanf("%lf", &x) != 1) return 1;

    printf("Enter the number of iterations n: ");
    if (scanf("%d", &n) != 1) return 1;

    double result = approximate_cos(x, n);

    printf("\nResult: %.10f\n", result);
    
    return 0;
}