/** MDX files compile to React components; give TypeScript the shape. */
declare module "*.mdx" {
  import type { ComponentType } from "react";
  const MDXComponent: ComponentType<{ components?: Record<string, unknown> }>;
  export default MDXComponent;
}
