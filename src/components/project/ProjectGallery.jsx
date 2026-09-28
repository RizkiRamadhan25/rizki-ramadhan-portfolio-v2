import { motion } from "motion/react";

export default function ProjectGallery({
  screenshots,
  language,
}) {
  return (
    <div
      className="
        mt-10 grid gap-6
        md:grid-cols-2
      "
    >
      {screenshots.map((screenshot, index) => {
        const alt =
          screenshot.alt[language] ||
          screenshot.alt.en;

        const caption =
          screenshot.caption[language] ||
          screenshot.caption.en;

        return (
          <motion.figure
            key={`${screenshot.src}-${index}`}
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
            }}
            className={`
              overflow-hidden rounded-3xl
              border border-border
              bg-card/60
              ${
                index === 0
                  ? "md:col-span-2"
                  : ""
              }
            `}
          >
            <div className="overflow-hidden">
              <img
                src={screenshot.src}
                alt={alt}
                width="1600"
                height="900"
                loading="lazy"
                decoding="async"
                onError={(event) => {
                    event.currentTarget.src =
                    "/images/project-placeholder.svg";
                }}
                className="
                    aspect-video w-full
                    object-cover transition-transform
                    duration-700 hover:scale-105
                "
              />
            </div>

            <figcaption
              className="
                border-t border-border
                px-5 py-4 text-sm text-muted
              "
            >
              {caption}
            </figcaption>
          </motion.figure>
        );
      })}
    </div>
  );
}