#include <stdio.h>
int main()
{
    int x;
    int y;

    printf("Enter the value of x:");
    scanf("%d", &x);

    if (x >= -49)
    {
        if (x < -10)
        {
            y = 10 * (x * x * x) + (7 * x) / 5 + 2;
            printf("y=%d", y);
        }
        else if (x > 0)
        {
            if (x <= 10)
            {
                y = 10 * (x * x * x) + (7 * x) / 5 + 2;
                printf("y=%d", y);
            }
            else if (x > 20)
            {
                y = -x + 9;
                printf("y=%d", y);
            }
            else
            {
                printf("error");
            }
        }
        else
        {
            printf("error");
        }
    }
    else
    {
        printf("error");
    }
    return 0;
}
