complex myType {
    string a;
    integer b;
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
        a = 10 & 1;
    }
    var integer counter;
    for (counter = 1;counter < (a + 5);counter++) {
        print(counter);
    }
}
