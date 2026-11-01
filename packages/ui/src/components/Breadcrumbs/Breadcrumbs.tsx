import { Link } from '../Link/Link';
export interface BreadcrumbItem {
  /** Visible text of the step. */
  label: string;
  /** Link target. Ignored for the last item, which is always the current page. */
  href?: string;
}
export interface BreadcrumbsProps {
  /** Path from the top level to the current page. The last item is marked as the current page. */
  items: BreadcrumbItem[];
  /** Accessible name of the navigation landmark. */
  label?: string;
}
export function Breadcrumbs({ items, label = 'Breadcrumb' }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className="fui-breadcrumbs">
      <ol>
        {items.map((item, index) => (
          <li key={`${index}-${item.label}`}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
