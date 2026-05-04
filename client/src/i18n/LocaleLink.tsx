import { Link } from "wouter";
import type { ComponentProps, ReactNode } from "react";
import { useLocale } from "./LocaleProvider";

/**
 * Drop-in wrapper around wouter's <Link> that auto-prefixes the active locale.
 * Pass a logical path like "/about" — rendered as "/th/about" or "/en/about".
 *
 * If `href` already starts with /th or /en the prefix is preserved.
 */
type AnchorAttrs = Omit<ComponentProps<"a">, "href" | "children">;

interface LocaleLinkProps extends AnchorAttrs {
  href: string;
  children: ReactNode;
}

export function LocaleLink({ href, children, ...rest }: LocaleLinkProps) {
  const { href: build } = useLocale();
  const startsWithLocale = /^\/(th|en)(\/|$)/.test(href);
  const finalHref = startsWithLocale ? href : build(href);

  return (
    <Link href={finalHref} {...rest}>
      {children}
    </Link>
  );
}
