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
    username = "revan730";
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
myTypeVar.a = "changed a value";
print("accessing complex type var field");
print(myTypeVar.a);
print("it works omg i'm so hyped");

printWithWhile();
print("this print should be after function call");
myInt++;
print(itoa(myInt));

print("accessing user type accessToken");
print(Revan730.accessToken);

var integer counter;
counter = 3;

while (counter < 5) {
        print(itoa(counter));
        counter = counter + 1;
}

if (true) {
    print("true from file scope if");
}

var repo ClipperFront;
ClipperFront = {
    fullName = "clipper-front";
    owner = Revan730;
    url = "https://github.com/revan730/clipper-front";
    branch = "dev";
}

var boolean validRepo;
validRepo = validateRepo(ClipperFront);
print(strConcat("Repo valid: ", btoa(validRepo)));

var ciConfig validConfig;
validConfig = {
    gcr = "eu.gcr.io/mygcrrepoprefix";
}

print(createCIData(ClipperFront, validConfig));

var manifest ClipperManifest;
ClipperManifest = {
    image = "eu.gcr.io/mygcrrepoprefix/clipper-front:latest";
    replicas = 2;
    k8sName = "clipper";
}
if (validateManifest(ClipperManifest) == true) {
    print(renderManifestYaml(ClipperManifest));
} else {
    print("Invalid manifest");
}
