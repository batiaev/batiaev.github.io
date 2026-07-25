import data from "@/data/data.json";

type Social = (typeof data.social)[number];

export function getSocial(name: string): Social | undefined {
  return data.social.find((s) => s.name === name);
}

export function socialLink(name: string): string {
  return getSocial(name)?.link ?? "#";
}
