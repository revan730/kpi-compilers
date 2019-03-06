complex myType {
    string a;
    integer b;
}

func boolean myBoolFunc(boolean myParam) {
    func boolean nestedFunc(void) {return true;}
    return nestedFunc();
}

command myFunc(void) {
    var integer a;
    var boolean b;
    var rune r;
    r = 'a';
    var complex myType c;
    var user Revan730;
    Revan730 = {
        hookSecret = "secret";
        accessToken = "token";
    }
    a = 10;
    a++;
    a--;
    b = myBoolFunc(true);
    b = true;
    c.a = "wow such string";
    c.b = 228;
    if (a != a || c.b >= a || b == b && a < a) {
        return;
    } else {
        b = !b;
    }
    var integer counter;
    while (counter < (a + 5)) {
        print(itoa(counter));
        counter++;
    }
}

myFunc();