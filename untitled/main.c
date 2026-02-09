#include <stdio.h>
#include <math.h>

/**
 * Спосіб 1: Обчислення членів ряду і суми на рекурсивному спуску
 * F_1 = x
 * F_{i+1} = -F_i * x^2 / (4*i^2 + 2*i)
 * Сума = F_1 + F_2 + ... + F_n = sin(x)
 */

double calculate_sum_descent(int i, int n, double x, double Fi, double sum) {
    // Базовий випадок: досягли n-го члена
    if (i > n) {
        return sum;
    }

    // Додаємо поточний член до суми
    sum += Fi;

    // Обчислюємо наступний член ряду
    double Fi_next = -Fi * x * x / (4.0 * i * i + 2.0 * i);

    // Рекурсивний виклик для наступного члена
    return calculate_sum_descent(i + 1, n, x, Fi_next, sum);
}

double sum_series_method1(int n, double x) {
    if (n < 1) {
        return 0.0;
    }

    // F_1 = x
    double F1 = x;

    return calculate_sum_descent(1, n, x, F1, 0.0);
}

int main() {
    int n;
    double x;

    printf("Спосіб 1: Обчислення на рекурсивному спуску\n");
    printf("Введіть натуральне число n: ");
    scanf("%d", &n);

    printf("Введіть значення x: ");
    scanf("%lf", &x);

    if (n < 1) {
        printf("Помилка: n має бути натуральним числом (n >= 1)\n");
        return 1;
    }

    double result = sum_series_method1(n, x);
    double exact = sin(x);

    printf("\nРезультати:\n");
    printf("-----------\n");
    printf("Сума перших %d членів ряду: %.10f\n", n, result);
    printf("Точне значення sin(%.4f):   %.10f\n", x, exact);
    printf("Абсолютна похибка:           %.10e\n", fabs(result - exact));

    return 0;
}