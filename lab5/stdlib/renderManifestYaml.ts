import { BlockStatement } from "../ast/block";
import { Func } from "../ast/func";
import { FunctionParameter } from "../ast/functionParameter";

const renderManifestNative = (m: any): string => {
    return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: "${m.k8sName}"
spec:
  selector:
    matchLabels:
      app: "${m.k8sName}"
  replicas: ${m.replicas}
  template:
    metadata:
      labels:
        app: "${m.k8sName}"
    spec:
      containers:
      - name: "${m.k8sName}"
        image: "${m.image}"
        ports:
        - containerPort: 8082`;
};

export const RenderManifestYamlDec = new Func("renderManifestYaml",
 [new FunctionParameter("manifest", "m")], new BlockStatement([]), "string", renderManifestNative);
