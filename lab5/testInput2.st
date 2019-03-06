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