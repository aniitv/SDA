#include <stdio.h>

double recursive_descent (unsigned int i,unsigned int n, double arg, double current, double result)

{if (i>n)
return result;

result+=current;

  double mult = - arg * arg / (4 * i * i + 2* i);
  double next = current * mult;

  return recursive_descent(i+1, n, arg, next, result);
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
        return 1;
    }
    
  double result = recursive_descent(1, count, arg, arg, 0);

  printf("%lf\n", result);

  return 0;
}


