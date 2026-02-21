#include <stdio.h>

double recursive_mixed(unsigned int n, double arg, unsigned int i, double current)
{if (i == n)
return current;

double mult = - arg * arg / (4 * i * i + 2 * i);
double next = current * mult;

return current + recursive_mixed(n, arg, i + 1, next);}

int main() {
double arg;
unsigned int count;

printf("input argument: ");
scanf("%lf", &arg);

printf("input count of iterations: ");
scanf("%u", &count);

if (count < 1) {
printf("count must be >= 1\n");
return 1;}

double result = recursive_mixed(count, arg, 1, arg);

printf("%lf\n", result);

return 0;
}