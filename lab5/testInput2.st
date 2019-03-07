complex myType {
    string a;
    integer b;
}

func integer myIntFunc(integer myParam) {
    if (myParam > 10) {
        return 100;
    }
    return myParam;
}

command printWithWhile(void) {
    var integer counter;
    counter = 0;
    while (counter < 5) {
        print(itoa(counter));
        counter = counter + 1;
    }
}

var integer myInt;
var complex myType myTypeVar;
var user Revan730;
Revan730 = {
    hookSecret = "secret";
    accessToken = "token";
}
myInt = myIntFunc(12 + 12);
myTypeVar = {
    a = "a value";
    b = 12;
}
print(itoa(myInt));
print("calling from Shanty");
print("accessing complex type var field");
print(myTypeVar.a);
print("it works omg i'm so hyped");

printWithWhile();
print("this print should be after function call");