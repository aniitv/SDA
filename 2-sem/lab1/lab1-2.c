#include <stdio.h>
#include <math.h>

typedef struct {
    double current;      
    double sum;    
} Result;

Result recursive_ascent(unsigned int n, double arg, unsigned int i, double current) {
    Result res;
    
    if (i == n) {
        res.current = current;
        res.sum = current;
        return res;
    }
    
    
    double current_next = -current * arg * arg / (4.0 * i * i + 2.0 * i);
  
    Result next_res = recursive_ascent(n, arg, i + 1, current_next);
    
    res.current = current;
    res.sum = current + next_res.sum;
    
    return res; 
}

int main() {
    double arg;
    unsigned int count;
    
    printf("input argument: ");
    scanf("%lf", &arg);
    
    printf("input count of iterations: ");
    scanf("%u", &count); 
    
    if (count < 1) {
        printf("count must be >= 1\n");
        return 1;
    }
    
  
    Result result = recursive_ascent(count, arg, 1, arg);
    
    
    printf("%lf\n",  result.sum);
    
    return 0;
}