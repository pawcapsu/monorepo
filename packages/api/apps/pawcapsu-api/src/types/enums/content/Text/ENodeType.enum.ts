import { ENodeType } from "@app/shared";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(ENodeType, {
  name: "ENodeType",
  description: "Type of node of UniversalText object (TEXT, PICTURE, etc..)",
});
