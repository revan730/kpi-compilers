var manifest ClipperManifest;
ClipperManifest = {
    image = "qorbani/golang-hello-world:latest";
    replicas = 1;
    k8sName = "golang-hello";
}
if (validateManifest(ClipperManifest) == true) {
    print(renderManifestYaml(ClipperManifest));
} else {
    print("Invalid manifest");
}
