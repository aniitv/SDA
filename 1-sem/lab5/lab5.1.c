#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define M 7
#define N 8

void fillRandom(int A[M][N]) {
	for (int i = 0; i < M; i++) {
		for (int j = 0; j < N; j++) {
			A[i][j] = rand() % 100 + 1;
		}
	}
}

void fillSorted(int A[M][N]) {
	int x = 0;
	for (int i = 0; i < M; i++) {
		for (int j = 0; j < N; j++) {
			A[i][j] = x;
			x++;
		}
	}
}

void fillReverseSorted(int A[M][N]) {
	int x = M * N;
	for (int i = 0; i < M; i++) {
		for (int j = 0; j < N; j++) {
			A[i][j] = x;
			x--;
		}
	}
}

void copyMatrix(int rows, int cols, int A[rows][cols], const int B[rows][cols]) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            A[i][j] = B[i][j];
        }
    }
}

void sortLastRowEvenAscending(int rows, int cols, int A[rows][cols]) {
    int lastRow = rows - 1;

    for (int i = 0; i < cols - 1; i += 2) {
        int min = i;

        for (int j = i + 2; j < cols; j += 2) {
            if (A[lastRow][j] < A[lastRow][min]) {
                min = j;
            }
        }

        if (min != i) {
            int temp = A[lastRow][i];
            A[lastRow][i] = A[lastRow][min];
            A[lastRow][min] = temp;
        }
    }
}

void printMatrix(int rows, int cols, int A[rows][cols]) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            printf("%4d", A[i][j]);
        }
        printf("\n");
    }
}

int main() {
    srand(time(NULL));
    int A[M][N];
    int B[M][N];

fillSorted(B);
    copyMatrix(M, N, A, B);

    printMatrix(M, N, A);

    printf("\n");
    sortLastRowEvenAscending(M, N, A);
    printMatrix(M, N, A);
    printf("\n\n\n");

    fillReverseSorted(B);
    copyMatrix(M, N, A, B);

    printMatrix(M, N, A);

    printf("\n");
    sortLastRowEvenAscending(M, N, A);
    printMatrix(M, N, A);
    printf("\n\n\n");

    fillRandom(B);
    copyMatrix(M, N, A, B);

    printMatrix(M, N, A);

    printf("\n");
    sortLastRowEvenAscending(M, N, A);
    printMatrix(M, N, A);
    return 0;
}
