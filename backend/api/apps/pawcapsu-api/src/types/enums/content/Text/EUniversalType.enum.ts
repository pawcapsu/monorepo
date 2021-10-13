import { EUniversalTextType } from "@app/shared";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(EUniversalTextType, {
  name: "EUniversalTextType",
  description: "Type of UniversalText instance (TEXT, COMICS, etc...)",
});
