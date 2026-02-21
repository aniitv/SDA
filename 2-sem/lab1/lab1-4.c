#include <stdio.h>

double loop(unsigned int n, double arg) {
  double current = arg;
  double result = current;

  for (int i = 1; i < n; i++) {
    double mult = - arg * arg / (4 * i * i + 2 * i);

    current = current * mult;
    result += current;
  }

  return result;
}

int main() {
  double arg;
  unsigned int count;

  printf("input argument: ");
  scanf("%lf", &arg);

  printf("input count of iterations: ");
  scanf("%d", &count);
  
if (count < 1) {
printf("count must be >= 1\n");
return 1;}


  double result = loop(count, arg);

  printf("%lf\n", result);

  return 0;
}