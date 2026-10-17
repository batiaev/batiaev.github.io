/* The generated slice rather than data.json: the shell's sidebar and footer
   use these links, and the shell must stay light. */
import nav from "@/data/nav.generated.json";

type Social = (typeof nav.social)[number];

export function getSocial(name: string): Social | undefined {
  return nav.social.find((s) => s.name === name);
}

export function socialLink(name: string): string {
  return getSocial(name)?.link ?? "#";
}
