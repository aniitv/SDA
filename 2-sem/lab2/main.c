#include <stdio.h>
#include <time.h>
#include <stdlib.h>

typedef struct List {
    char data; 
    struct List* next;
    struct List* prev;
} List;

void InputNumberOfLetters(int* n) {
    printf("Enter the number of letters: ");
    if (scanf("%d", n) != 1 || *n <= 0) {
        printf("\nInvalid input\n");
        exit(EXIT_FAILURE);
    }
}


void Append(List** head, const char value) {
    List* newNode = (List*)malloc(sizeof(List));
    if (!newNode) {
        printf("Memory allocation failed\n");
        exit(EXIT_FAILURE);
    }

    newNode->data = value;

    if (!*head) {
        newNode->next = newNode->prev = newNode;
        *head = newNode;
    } else {
        List* tail = (*head)->prev;
        tail->next = newNode;
        newNode->prev = tail;
        newNode->next = *head;
        (*head)->prev = newNode;
    }
}


void FillListWithRandomLetters(List** head, const int n) {
    for (int i = 0; i < n; i++) {
        char letter = 'A' + (rand() % 26);
        Append(head, letter);
    }
}

// bubble sorting
void SortList(List* head) {
    if (!head || head->next == head) return;

    int swapped;
    List* current;

    do {
        swapped = 0;
        current = head;

        while (current->next != head) {
            if (current->data > current->next->data) {
                char tempData = current->data;
                current->data = current->next->data;
                current->next->data = tempData;
                swapped = 1;
            }
            current = current->next;
        }
    } while (swapped);
}

void PrintList(List* head, const char* message) {
    if (!head) return;

    List* temp = head;
    printf("%s\n", message);
    do {
        printf("%c ", temp->data);
        temp = temp->next;
    } while (temp != head);
    printf("\n");
}

void FreeList(List** head) {
    if (!*head) return;

    List* current = *head;
    List* nextNode;

    printf("\nFreeing memory:\n");
    
    do {
        nextNode = current->next;
        printf("Freeing up: %c\n", current->data);
        free(current);           
        current = nextNode;       
    } while (current != *head); 

    *head = NULL;
    printf("Memory freeing completed\n");
}

int main() {
    srand(time(NULL));
    List* head = NULL;
    int n;

    InputNumberOfLetters(&n);
    FillListWithRandomLetters(&head, n);
    
    PrintList(head, "\nRandomly filled list:");
    
    SortList(head, n);
    PrintList(head, "\nSorted list:");

    FreeList(&head);

    return 0;
}