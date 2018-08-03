
#include <Windows.h>

/** You can use this one to examine the given memory blocks.
  * However, since you're inside another process, you cannot use
  * std::cout. But you'll get the idea (just an example). The code
  * is from my another project.
  */
void MyDump(const void *m, unsigned int n)
{
        const unsigned char *p = reinterpret_cast<const unsigned char *>(m);
        char buffer[16];
        unsigned int mod = 1;

        memset(&buffer, 0, sizeof(buffer));

        std::cout << "------------------------------------------------------------------------------------\nOffset     | Hex                                                | ASCII            |\n------------------------------------------------------------------------------------\n0x" << std::setfill('0') << std::setw(8) << std::hex << (long)m << " |";

        for (unsigned int i = 0; i < n; ++i, ++mod) {
                buffer[i % 16] = p[i];

                --mod;

                if (mod % 4 == 0)
                        std::cout << " ";

                ++mod;

                std::cout << std::setw(2) << std::hex << static_cast<unsigned int>(p[i]) << " ";

                if ((mod == 16 && i != 0) || i == n - 1) {
                        if (i == n - 1) {
                                for (unsigned int j = 0; j < (16 - mod) * 3; ++j)
                                        std::cout << " ";

                                if (mod <= 4)
                                        std::cout << " ";

                                if (mod <= 8)
                                        std::cout << " ";

                                if (mod <= 12)
                                        std::cout << " ";
                        }

                        mod = 0;

                        std::cout << "| ";

                        for (unsigned short j = 0; j < 16; ++j) {
                                switch (buffer[j]) {
                                        case 0x7:
                                        case 0x8:
                                        case 0x9:
                                        case 0xa:
                                        case 0xb:
                                        case 0xd:
                                        case 0xe:
                                        case 0xf:
                                                std::cout << " ";

                                                break;

                                        default: std::cout << buffer[j];
                                }
                        }

                        std::cout << " |";

                        if (i == n - 1) {
                                std::cout << "\n------------------------------------------------------------------------------------\n";

                                return;
                        }

                        memset(&buffer, 0, sizeof(buffer));

                        std::cout << "\n0x" << std::setfill('0') << std::setw(8) << std::hex << (long)m + i << " |";
                }
        }
}

BOOL APIENTRY DllMain(HANDLE h_module, DWORD ul_reason_for_call, LPVOID)
{
        switch (ul_reason_for_call) {
                case DLL_PROCESS_ATTACH:
                        /** Do the heap walk here, please see
                          * http://msdn.microsoft.com/en-us/library/ee175819%28v=VS.85%29.aspx
                          * for enumerating the heap.
                          */

                        break;

                case DLL_THREAD_ATTACH: break;

                case DLL_THREAD_DETACH: break;

                case DLL_PROCESS_DETACH:
        }
}
