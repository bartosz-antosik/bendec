/** GENERATED BY BENDEC TYPE GENERATOR */
// primitive built-in: uint8_t
// ignored: char
using Char3 = char[3];
using BigArray = char[128];
using BigArrayNewtype = char[128];
struct Test {
    uint8_t one;
    uint8_t two;
    friend std::ostream &operator << (std::ostream &, const Test &);
} __attribute__ ((packed));
using Test3 = Test[3];
using Ident = Test3;
struct Foo {
    Ident id1;
    Test3 id2;
    Char3 id3;
    char id4[3];
    BigArray id5;
    BigArrayNewtype id6;
    friend std::ostream &operator << (std::ostream &, const Foo &);
} __attribute__ ((packed));

