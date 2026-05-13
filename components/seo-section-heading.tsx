type SeoSectionHeadingProps = {
  id: string;
  title: string;
};

export function SeoSectionHeading({ id, title }: SeoSectionHeadingProps) {
  return (
    <div className="border-l-2 border-[#00D17F]/30 pl-6 md:pl-8">
      <h2 id={id} className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
