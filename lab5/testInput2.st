complex myType {
    string a;
    integer b;
}

func integer myIntFunc(integer myParam) {
    return myParam;
}

var integer myInt;
myInt = myIntFunc(12);
print(itoa(myInt));
print("calling from Shanty");