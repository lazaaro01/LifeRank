import clsx from "clsx";

export function Panel({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={clsx(
        "glass rounded-[32px] p-6 sm:p-8",
        className
      )}
    >
      {children}
    </section>
  );
}