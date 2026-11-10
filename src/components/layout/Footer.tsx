export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-8">
        <img
          src="/images/footer-logo-light.svg"
          alt="Holidaze"
          className="h-16 w-auto dark:hidden"
        />
        <img
          src="/images/footer-logo-dark.svg"
          alt="Holidaze"
          className="hidden h-16 w-auto dark:block"
        />
      </div>
    </footer>
  );
}
