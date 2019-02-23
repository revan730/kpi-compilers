complex myType {
    string a;
    integer b;
}

func boolean myBoolFunc(void) {
    return false;
}

command myFunc(void) {
    var integer a;
    var boolean b;
    var complex myType c;
    var user Revan730;
    Revan730 = {
        hookSecret = "secret";
        accessToken = "token";
    }
    a = 10;
    a++;
    a--;
    b = true;
    c.a = "wow";
    c.b = 228;
    if (a != b || a >= b || a == b && a < b) {
        return;
    } else {
        b = !b;
    }
    var integer counter;
    while (counter < (a + 5)) {
        print(counter);
        counter++;
    }
}
