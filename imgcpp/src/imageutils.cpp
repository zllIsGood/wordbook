#include <iostream>
#include "lodepng.h"
#include "imageutils.h"

using namespace std;

void encodeTwoSteps(const char *filename, vector<unsigned char> &image, unsigned width, unsigned height)
{
    std::vector<unsigned char> png;

    unsigned error = lodepng::encode(png, image, width, height);
    if (!error)
        lodepng::save_file(png, filename);

    //if there's an error, display it
    if (error)
        std::cout << "encoder error " << error << ": " << lodepng_error_text(error) << std::endl;
}
void decodeTwoSteps(const char *filename)
{
    std::vector<unsigned char> png;
    std::vector<unsigned char> image; //the raw pixels
    unsigned width, height;

    //load and decode
    unsigned error = lodepng::load_file(png, filename);
    if (!error)
        error = lodepng::decode(image, width, height, png);
    cout << "size:" + to_string(image.size()) << endl;
    cout << "w:" + to_string(width) << endl;
    cout << "h:" + to_string(height) << endl;
    cout << to_string(image[0]) << to_string(image[1]) << to_string(image[2]) << to_string(image[3]) << endl;
    //if there's an error, display it
    if (error)
        std::cout << "decoder error " << error << ": " << lodepng_error_text(error) << std::endl;

    //the pixels are now in the vector "image", 4 bytes per pixel, ordered RGBARGBA..., use it as texture, draw it, ...

    const char *filename2 = "test2.png";
    std::vector<unsigned char> png2;
    std::vector<unsigned char> image2; //the raw pixels
    unsigned width2, height2;

    //load and decode
    error = lodepng::load_file(png2, filename2);
    if (!error)
        error = lodepng::decode(image2, width2, height2, png2);
    int err = compare_img(image, width, height, image2, width2, height2);
    cout << "err:" + to_string(err) << endl;
}
/* img1>img2  获取 img2是不是img1的子图 若是 返回 (x<<16)+y 
 * the pixels are now in the vector "image", 4 bytes per pixel, ordered RGBARGBA...
 */
int compare_img(vector<unsigned char> img1, int w1, int h1, vector<unsigned char> img2, int w2, int h2)
{
    if (w1 < w2 || h1 < h2)
    {
        return -1;
    }
    int x = 0, y = 0;
    int dw = w1 - w2, dh = h1 - h2;
    uint32_t *pic1 = (uint32_t *)(img1.data());
    uint32_t *pic2 = (uint32_t *)(img2.data());
    cout << "LOOP:" << dh << dw << h2 << w2 << endl;
    for (uint32_t j = 0; j < dh + 1; j++)
    {
        uint32_t i = -1;
    LOOP:
        i++;
        while (i < dw + 1)
        {
            for (int m = 0; m < h2; m++)
            {
                for (int n = 0; n < w2; n++)
                {
                    if (pic2[m * w2 + n] != pic1[(m + j) * w1 + (n + i)])
                    {
                        goto LOOP;
                        // cout << pic2[m * w2 + n] << endl;
                        // cout << pic1[(m + j) * w1 + (n + i)] << endl;
                    }
                }
            }
            cout << i << endl;
            cout << j << endl;
            return (i << 16) + j;
        }
    }
    cout << "no x y!" << endl;
    return -2;
}