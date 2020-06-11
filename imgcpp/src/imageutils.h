#pragma once
#include <vector>

void encodeTwoSteps(const char *filename, std::vector<unsigned char> &image, unsigned width, unsigned height);
void decodeTwoSteps(const char *filename);
int compare_img(std::vector<unsigned char> img1, int w1, int h1, std::vector<unsigned char> img2, int w2, int h2);