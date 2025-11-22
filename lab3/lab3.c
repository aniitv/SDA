#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

#define MAX_X 80
#define MAX_Y 24
#define SYMBOL '*'

#define DELAY_MS 50

void gotoxy(int x, int y) {
    COORD c;
    c.X = x - 1;
    c.Y = y - 1;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), c);

}

void my_sleep_ms(unsigned int msec) {
    Sleep(msec);
}

void spiral_traversal() {

int top = 1;
int bottom = MAX_Y;
int left = 1;
int right = MAX_X;

int current_x;
int current_y;

    while (top <= bottom && left <= right) {


        if (left <= right) {
            for (current_y = top; current_y <= bottom; current_y++) {
                gotoxy(right, current_y);
                printf("%c", SYMBOL);
                my_sleep_ms(DELAY_MS);
            }
            right--;
        } else break;


        if (top <= bottom) {
            for (current_x = right; current_x >= left; current_x--) {
                gotoxy(current_x, bottom);
                printf("%c", SYMBOL);
                my_sleep_ms(DELAY_MS);
            }
            bottom--;
        } else break;


        if (left <= right) {
            for (current_y = bottom; current_y >= top; current_y--) {
                gotoxy(left, current_y);
                printf("%c", SYMBOL);
                my_sleep_ms(DELAY_MS);
            }
            left++;
        } else break;


        if (top <= bottom) {
            for (current_x = left; current_x <= right; current_x++) {
                gotoxy(current_x, top);
                printf("%c", SYMBOL);
                my_sleep_ms(DELAY_MS);
            }
            top++;
        } else break;
    }
}

int main() {

    spiral_traversal();
    gotoxy(1, MAX_Y + 1);

    return 0;
}
