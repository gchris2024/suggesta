import { Link } from "react-router-dom";

type FeatureSectionProps = {
  title: string;
  description: string;
  buttonLabel: string;
  buttonTo: string;
  imageSrc: string;
  imageAlt: string;
  desktopLayout: "text-left" | "text-right";
};

export default function FeatureSection({
  title,
  description,
  buttonLabel,
  buttonTo,
  imageSrc,
  imageAlt,
  desktopLayout,
}: FeatureSectionProps) {
  const textOrder =
    desktopLayout === "text-right" ? "md:order-2" : "md:order-1";
  const imageOrder =
    desktopLayout === "text-right" ? "md:order-1" : "md:order-2";

  return (
    <section className="mb-10 grid grid-cols-1 items-center gap-5 md:mb-16 md:grid-cols-2 md:gap-10">
      <div className={`${textOrder} order-2`}>
        <h2 className="m-0 text-2xl font-bold leading-tight md:text-4xl">
          {title}
        </h2>
        <p className="mb-5 mt-3 max-w-prose text-sm leading-relaxed text-neutral-500 md:mb-7 md:text-lg">
          {description}
        </p>
        <Link
          to={buttonTo}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-px hover:opacity-95 md:w-auto md:text-base"
        >
          {buttonLabel}
        </Link>
      </div>
      <figure className={`${imageOrder} order-1 m-0 flex flex-col gap-1`}>
        <div className="h-52 w-full overflow-hidden rounded-2xl md:h-72">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <figcaption className="text-right text-xs text-neutral-400">
          <a
            href="https://www.freepik.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Designed by Freepik
          </a>
        </figcaption>
      </figure>
    </section>
  );
}
