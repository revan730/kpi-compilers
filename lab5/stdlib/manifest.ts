import { ComplexType } from "../ast/complexType";
import { ComplexField } from "../ast/complexField";

export const ManifestDec = new ComplexType("manifest", [
    new ComplexField("string", "image"),
    new ComplexField("integer", "replicas"),
    new ComplexField("string", "k8sName"),
]);