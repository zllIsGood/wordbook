#include <iostream>
#include <string>
// #include "lodepng.h"
#include "imageutils.h"
using namespace std;

int main(int argc, char *argv[])

{
    std::cout << "Hello word!" << std::endl;

    const char *filename = /* argc > 1 ? argv[1] : */ "test1.png";

    // unsigned width = 513, height = 514;
    // std::vector<unsigned char> image;
    // image.resize(width * height * 4);
    // for (unsigned y = 0; y < height; y++)
    //     for (unsigned x = 0; x < width; x++)
    //     {
    //         image[4 * width * y + 4 * x + 0] = !(y > 1 && x > 0) ? 10 : 0;   //r
    //         image[4 * width * y + 4 * x + 1] = !(y > 1 && x > 0) ? 10 : 255; //g
    //         image[4 * width * y + 4 * x + 2] = !(y > 1 && x > 0) ? 10 : 0;   //b
    //         image[4 * width * y + 4 * x + 3] = !(y > 1 && x > 0) ? 10 : 255; //a
    //     }
    // encodeTwoSteps(filename, image, width, height);

    decodeTwoSteps(filename);

    // int a = 1, b = 2;
    // swap(a, b);
    // cout << "a:" + to_string(a) << endl;
    // cout << "end!";

    // string str = "fddffffzll";
    // str.append("dsadzll");
    // cout << str << endl;
    // string substr = str.substr(2);
    // cout << substr << endl;
    // swap(str, substr);
    // cout << str + substr << endl;

    return 0;
}
