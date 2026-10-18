import { site } from "../src/site.config.mjs";
import { canRelease } from "../src/lib.mjs";
if (!canRelease(site)) {
  console.error(
    "Lançamento público bloqueado: valide registro PF/PJ, habilitação, horários, domínio, contato de privacidade, licença do retrato, informações comerciais, copy clínica, escopo profissional e política de privacidade em src/site.config.mjs.",
  );
  process.exitCode = 1;
} else {
  console.log(
    "Dados e aprovações declarados. Faça a homologação final com a responsável.",
  );
}
