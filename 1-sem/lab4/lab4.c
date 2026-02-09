#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <stdbool.h>
#include <windows.h>

#define M 7
#define N 8
#define DELAY 100

int sorter(const void *a, const void *b) {
    return (*(int*)a - *(int*)b);
}

void generateMatrix(int matrix[M][N], int min, int max) {
    for (int i = 0; i < M; i++) {
        for (int j = 0; j < N; j++) {
            matrix[i][j] = rand() % (max - min + 1) + min;
        }
    }
    for (int j = 0; j < N; j++) {
        int column[M];
        for (int i = 0; i < M; i++) {
            column[i] = matrix[i][j];
        }
        qsort(column, M, sizeof(int), sorter);
        for (int i = 0; i < M; i++) {
            matrix[i][j] = column[i];
        }
    }
}

void printMatrix(int matrix[M][N]) {
    for (int i = 0; i < M; i++) {
        for (int j = 0; j < N; j++) {
            printf(" %4d ", matrix[i][j]);
        }
        printf("\n");
    }
}

int binarySearch(int column[M], int x, int colNum) {
    int L = 0;
    int R = M - 1;

    printf("\nsearching in column %d:\n", colNum);
    for(int k = 0; k < M; k++) {
        printf("%d ", column[k]);
    }

    while (L <= R) {
        int i = (L + R) / 2;

        printf("\nL=%d, R=%d, i=%d, A[%d][%d]=%d ", L, R, i, i, colNum, column[i]);
        Sleep(DELAY);

        if (column[i] == x) {
            Sleep(DELAY);
            return i;
        }

        if (x < column[i]) {
            printf("x < A[i], search in left half");
            R = i - 1;
        } else {
            printf("x > A[i], search in right half");
            L = i + 1;
        }
        Sleep(DELAY);
    }

    printf("\nelement not found in this column\n");
    Sleep(DELAY);
    return -1;
}

void searchInMatrix(int matrix[M][N], int x) {
    bool found = false;
    int foundCount = 0;
    int coordinates[M * N][2];

    for (int j = 0; j < N; j++) {
        Sleep(DELAY);
        int column[M];
        for (int i = 0; i < M; i++) {
            column[i] = matrix[i][j];
        }

        int rowIndex = binarySearch(column, x, j);

     if (rowIndex != -1) {
       printf("\nfound: A[%d][%d] = %d\n", rowIndex, j, x);
      coordinates[foundCount][0] = rowIndex;
       coordinates[foundCount][1] = j;
         foundCount++;
         found = true;
          Sleep(DELAY);
        }
    }

    if (found) {
        printf("element %d found\n", x);
     printf("coordinates of found elements:\n");
        for (int k = 0; k < foundCount; k++) {
            printf("  %d) A[%d][%d]\n",
                   k + 1, coordinates[k][0], coordinates[k][1]);
        }
    } else {
        printf("element %d not found\n", x);
    }
    printf("\n");
}

int main() {
    srand(time(NULL));
    int matrix[M][N];

    generateMatrix(matrix, 0, 20);
    printMatrix(matrix);

    int x;
    printf("enter number to search: ");
    scanf("%d", &x);

    searchInMatrix(matrix, x);
    return 0;
}
