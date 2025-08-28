declare module "csstype" {
  interface Properties {
    // Allow using CSS variables like var(--x)
    [key: `--${string}`]: string | number;
  }
}